from django.template.context_processors import request
from rest_framework import serializers
from .models import User, Listing, Follow, Comment, Notification, Chat, RoomRequest, Statistics


class UserSerializer(serializers.ModelSerializer):
    avatar=serializers.ImageField(required=False)
    def create(self, validated_data):
        data=validated_data.copy()
        u=User(**data)
        u.set_password(u.password)
        u.save()
        return u

    def to_representation(self, instance):
        data=super().to_representation(instance)
        data['avatar']=instance.avatar.url
        return  data

    def get_avatar(self, user):
        # Kiểm tra nếu user.avatar tồn tại
        if user.avatar:
            # Nếu avatar là một URL, trả về URL
            if hasattr(user.avatar, 'url'):
                return user.avatar.url
            # Nếu avatar là một đường dẫn nội bộ
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(f'/static/{user.avatar.name}')
        return None  # Nếu không có avatar, trả về None

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'avatar', 'role', 'phone_number', 'is_active', 'is_staff']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class ListingSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)
    image = serializers.SerializerMethodField(source='images')

    def get_image(self, listing):
        # Kiểm tra nếu listing.image tồn tại
        if listing.image:
            # Nếu image là một URL, trả về URL
            if hasattr(listing.image, 'url'):
                return listing.image.url
            # Nếu image là một đường dẫn nội bộ
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(f'/static/{listing.image.name}')
        return None  # Nếu không có hình ảnh, trả về None

    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'description', 'price', 'address', 'district',
            'max_occupants', 'longitude', 'latitude', 'image', 'host',
            'is_approved', 'is_verified'
        ]


class FollowSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    host = UserSerializer(read_only=True)

    class Meta:
        model = Follow
        fields = ['id', 'user', 'host']


class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["id", "user", "listing", "room_request", "content", "parent_comment", "replies", "created_at"]

    def get_replies(self, obj):
        """
        Lấy danh sách phản hồi cho bình luận.
        """
        replies = obj.replies.filter(active=True)
        return CommentSerializer(replies, many=True).data


class NotificationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'user', 'content']


class ChatSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)

    class Meta:
        model = Chat
        fields = ['id', 'sender', 'receiver', 'message', 'timestamp']


class StatisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statistics
        fields = ['id', 'date', 'total_users', 'total_hosts', 'total_listings']


class RoomRequestSerializer(serializers.ModelSerializer):
    tenant = UserSerializer(read_only=True)

    class Meta:
        model = RoomRequest
        fields = ['id', 'tenant', 'title', 'description', 'price_range', 'preferred_location', 'created_at']