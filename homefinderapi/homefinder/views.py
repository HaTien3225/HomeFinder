from django.contrib.admin.templatetags.admin_list import pagination
from django.db.models import Count, Prefetch
from oauth2_provider.contrib.rest_framework import permissions
from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from . import paginators
from .models import User, Listing, Follow, Comment, Notification, RoomRequest, Chat, Statistics
from .paginators import ItemPaginator
from .serializers import UserSerializer, ListingSerializer, FollowSerializer, CommentSerializer, NotificationSerializer, \
    RoomRequestSerializer, ChatSerializer, StatisticsSerializer


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    pagination_class = paginators.ItemPaginator
    parser_classes = [MultiPartParser, FormParser]

    # Existing actions
    @action(methods=['get'], url_path='current-user', detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_user(self, request):
        return Response(UserSerializer(request.user).data)

    @action(methods=['patch'], detail=False, url_path='update-profile', permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        user = request.user
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(methods=['delete'], detail=True, url_path='delete', permission_classes=[IsAuthenticated])
    def delete_user(self, request, pk):
        user = self.get_object()
        if user != request.user:
            return Response({"error": "Không có quyền xóa tài khoản này"}, status=403)
        user.delete()
        return Response({"message": "Tài khoản đã được xóa"})

    # New action to get user by id
    @action(methods=['get'], detail=True, url_path='get-user-by-id', permission_classes=[IsAuthenticated])
    def get_user_by_id(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
            return Response(UserSerializer(user).data)
        except User.DoesNotExist:
            return Response({"error": "Người dùng không tồn tại"}, status=404)


class ListingViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    pagination_class = ItemPaginator

    def get_queryset(self):
        query = self.queryset

        # Lọc theo từ khóa
        kw = self.request.query_params.get('q')
        if kw:
            query = query.filter(title__icontains=kw)

        # Lọc theo vị trí (địa chỉ)
        location = self.request.query_params.get('address')
        if location:
            query = query.filter(address__icontains=location)

        # Lọc theo quận/huyện
        district = self.request.query_params.get('district')
        if district:
            query = query.filter(district=district)

        # Lọc theo thành phố
        city = self.request.query_params.get('city')
        if city:
            query = query.filter(city=city)

        # Lọc theo giá
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            query = query.filter(price__gte=min_price)
        if max_price:
            query = query.filter(price__lte=max_price)

        # Lọc theo số người tối đa
        max_occupants = self.request.query_params.get('max_occupants')
        if max_occupants:
            query = query.filter(max_occupants=max_occupants)

        return query

    @action(methods=['get'], url_path='comments', detail=True)
    def get_comments(self, request, pk=None):
        """
        Lấy bình luận của một listing cụ thể.
        """
        listing = self.get_object()
        comments = Comment.objects.filter(listing=listing, active=True).select_related('user')

        # Lọc và trả về bình luận cho listing
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(methods=['post'], detail=True, url_path='favorite', permission_classes=[IsAuthenticated])
    def favorite_listing(self, request, pk=None):
        """
        Thêm hoặc xóa listing khỏi danh sách yêu thích của người dùng.
        """
        listing = self.get_object()
        user = request.user
        if listing.favorites.filter(id=user.id).exists():
            listing.favorites.remove(user)
            return Response({"message": "Đã xóa khỏi yêu thích"})
        else:
            listing.favorites.add(user)
            return Response({"message": "Đã thêm vào yêu thích"})

    @action(methods=['post'], detail=True, url_path='report', permission_classes=[IsAuthenticated])
    def report_listing(self, request, pk=None):
        """
        Báo cáo listing với lý do cụ thể.
        """
        listing = self.get_object()
        reason = request.data.get('reason', '')
        # Xử lý logic báo cáo (có thể lưu vào cơ sở dữ liệu hoặc gửi thông báo)
        return Response({"message": "Báo cáo đã được gửi", "reason": reason})

    @action(methods=['delete'], detail=True, url_path='delete', permission_classes=[IsAuthenticated])
    def delete_listing(self, request, pk=None):
        """
        Xóa một listing nếu người dùng là chủ sở hữu.
        """
        listing = self.get_object()
        if listing.host != request.user:
            return Response({"error": "Không có quyền xóa listing này"}, status=403)
        listing.delete()
        return Response({"message": "Listing đã được xóa"})

    def perform_create(self, serializer):
        """
        Lưu listing với host là người dùng hiện tại.
        """
        serializer.save(host=self.request.user)


class CommentViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = Comment.objects.select_related('user', 'listing', 'room_request', 'parent_comment')
    serializer_class = CommentSerializer
    pagination_class = ItemPaginator
    permission_classes = [IsAuthenticated]  # Đảm bảo người dùng phải đăng nhập

    def get_queryset(self):
        """
        Truy vấn bình luận theo từng bài đăng hoặc yêu cầu phòng, tối ưu với Prefetch.
        """
        listing_id = self.request.query_params.get("listing")
        room_request_id = self.request.query_params.get("room_request")

        queryset = self.queryset.filter(active=True)

        if listing_id:
            queryset = queryset.filter(listing_id=listing_id).prefetch_related(
                Prefetch("replies", queryset=Comment.objects.filter(active=True))
            )
        elif room_request_id:
            queryset = queryset.filter(room_request_id=room_request_id).prefetch_related(
                Prefetch("replies", queryset=Comment.objects.filter(active=True))
            )

        return queryset

    def perform_create(self, serializer):
        """
        Kiểm tra và lưu comment mới, hỗ trợ phản hồi bình luận.
        """
        if not self.request.user.is_authenticated:
            return Response({"error": "Bạn cần đăng nhập để tạo bình luận"}, status=401)

        listing_id = self.request.data.get("listing")
        room_request_id = self.request.data.get("room_request")
        parent_comment_id = self.request.data.get("parent_comment")

        if listing_id and room_request_id:
            return Response({"error": "Chỉ có thể thuộc Listing hoặc RoomRequest, không phải cả hai"}, status=400)

        if parent_comment_id:
            parent_comment = Comment.objects.filter(id=parent_comment_id, active=True).first()
            if not parent_comment:
                return Response({"error": "Bình luận gốc không tồn tại hoặc đã bị xóa"}, status=400)
            serializer.save(user=self.request.user, parent_comment=parent_comment)
        elif listing_id:
            serializer.save(user=self.request.user, listing_id=listing_id)
        elif room_request_id:
            serializer.save(user=self.request.user, room_request_id=room_request_id)
        else:
            return Response({"error": "Cần có Listing hoặc RoomRequest để tạo bình luận"}, status=400)

    @action(methods=["patch"], detail=True, url_path="update", permission_classes=[IsAuthenticated])
    def update_comment(self, request, pk=None):
        """
        Cập nhật bình luận nếu người dùng là chủ sở hữu.
        """
        comment = self.get_object()
        if comment.user != request.user:
            return Response({"error": "Bạn không có quyền chỉnh sửa bình luận này"}, status=403)

        serializer = self.get_serializer(comment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(methods=["delete"], detail=True, url_path="delete", permission_classes=[IsAuthenticated])
    def delete_comment(self, request, pk=None):
        """
        Xóa bình luận nếu người dùng là chủ sở hữu.
        """
        comment = self.get_object()
        if comment.user != request.user:
            return Response({"error": "Bạn không có quyền xóa bình luận này"}, status=403)

        comment.delete()
        return Response({"message": "Bình luận đã bị xóa"})


class FollowViewSet(viewsets.ViewSet, generics.ListAPIView):
    """
    A viewset for creating and listing follows.
    """
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    pagination_class = paginators.ItemPaginator
    permission_classes = [IsAuthenticated]  # Chỉ cho phép những người đã đăng nhập

    def perform_create(self, serializer):
        # Lưu đối tượng Follow với user hiện tại
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['POST'])
    def follow(self, request):
        """
        API để theo dõi chủ nhà trọ.
        """
        host_id = request.data.get('host_id')

        if not host_id:
            return Response({"error": "Host ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            host = User.objects.get(id=host_id)
        except User.DoesNotExist:
            return Response({"error": "Host not found."}, status=status.HTTP_404_NOT_FOUND)

        # Kiểm tra nếu người dùng đã theo dõi host này
        existing_follow = Follow.objects.filter(user=request.user, host=host).first()
        if existing_follow:
            return Response({"message": "You are already following this host."}, status=status.HTTP_200_OK)

        # Tạo đối tượng Follow mới
        follow = Follow.objects.create(user=request.user, host=host)
        return Response({"message": "You are now following this host."}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['DELETE'])
    def unfollow(self, request):
        """
        API để hủy theo dõi chủ nhà trọ.
        """
        host_id = request.data.get('host_id')

        if not host_id:
            return Response({"error": "Host ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            host = User.objects.get(id=host_id)
        except User.DoesNotExist:
            return Response({"error": "Host not found."}, status=status.HTTP_404_NOT_FOUND)

        # Kiểm tra nếu người dùng có đang theo dõi chủ nhà này không
        follow = Follow.objects.filter(user=request.user, host=host).first()
        if not follow:
            return Response({"error": "You are not following this host."}, status=status.HTTP_404_NOT_FOUND)

        # Hủy theo dõi
        follow.delete()
        return Response({"message": "You have unfollowed this host."}, status=status.HTTP_204_NO_CONTENT)


# Notification ViewSet
class NotificationViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    pagination_class = paginators.ItemPaginator

    @action(methods=['post'], detail=True, url_path='mark-read', permission_classes=[IsAuthenticated])
    def mark_as_read(self, request, pk):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({"message": "Thông báo đã được đánh dấu là đã đọc"})

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Chat ViewSet
class ChatViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    pagination_class = paginators.ItemPaginator

    @action(methods=['get'], detail=False, url_path='history', permission_classes=[IsAuthenticated])
    def chat_history(self, request):
        chats = Chat.objects.filter(sender=request.user) | Chat.objects.filter(receiver=request.user)
        return Response(ChatSerializer(chats, many=True).data)

    @action(methods=['delete'], detail=True, url_path='delete', permission_classes=[IsAuthenticated])
    def delete_chat(self, request, pk):
        chat = self.get_object()
        if chat.sender != request.user and chat.receiver != request.user:
            return Response({"error": "Không có quyền xóa tin nhắn này"}, status=403)
        chat.delete()
        return Response({"message": "Tin nhắn đã được xóa"})

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


# RoomRequest ViewSet
class RoomRequestViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = RoomRequest.objects.all()
    serializer_class = RoomRequestSerializer
    pagination_class = paginators.ItemPaginator

    def get_queryset(self):
        query = self.queryset

        # Lọc theo từ khóa
        kw = self.request.query_params.get('q')
        if kw:
            query = query.filter(title__icontains=kw)

        return query

    @action(methods=['delete'], detail=True, url_path='cancel', permission_classes=[IsAuthenticated])
    def cancel_request(self, request, pk):
        room_request = self.get_object()
        if room_request.tenant != request.user:
            return Response({"error": "Không có quyền hủy yêu cầu"}, status=403)
        room_request.delete()
        return Response({"message": "Yêu cầu phòng đã bị hủy"})

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user)


# Statistics ViewSet
class StatisticsViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Statistics.objects.all()
    serializer_class = StatisticsSerializer
    pagination_class = paginators.ItemPaginator

    @action(methods=['get'], detail=False, url_path='location-statistics', permission_classes=[IsAuthenticated])
    def location_statistics(self, request):
        data = Listing.objects.values('location').annotate(total=Count('id'))
        return Response(data)

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user)
