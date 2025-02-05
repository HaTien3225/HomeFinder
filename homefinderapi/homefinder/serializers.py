from django.template.context_processors import request
from rest_framework import serializers
from .models import User, Listing, Follow, Comment, Notification, Chat, RoomRequest, Statistics



from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False)
    image_1 = serializers.ImageField(required=False, allow_null=True)
    image_2 = serializers.ImageField(required=False, allow_null=True)
    image_3 = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'password', 'email', 'avatar',
            'role', 'phone_number', 'address', 'is_active', 'is_staff',
            'image_1', 'image_2', 'image_3'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # Chuyển đổi URL ảnh nếu có
        request = self.context.get('request')
        if instance.avatar:
            data['avatar'] = instance.avatar.url if hasattr(instance.avatar, 'url') else None
        for img_field in ['image_1', 'image_2', 'image_3']:
            image = getattr(instance, img_field, None)
            if image:
                data[img_field] = image.url if hasattr(image, 'url') else None
            else:
                data[img_field] = None  # Trả về None nếu không có ảnh

        return data



class ListingSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)  # Lấy thông tin người đăng tin từ UserSerializer
    image = serializers.ImageField(required=False, allow_null=True)  # Trường ảnh cho listing (giống avatar)

    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'description', 'price', 'address',
            'district', 'city', 'max_occupants', 'longitude', 'latitude', 'image',
            'host', 'is_approved', 'is_verified'
        ]

    def to_representation(self, instance):
        # Lấy dữ liệu từ to_representation của base class
        data = super().to_representation(instance)

        # Chuyển đổi URL của ảnh (nếu có)
        request = self.context.get('request')
        if instance.image:
            data['image'] = instance.image.url if hasattr(instance.image, 'url') else None

        return data


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
    tenant = serializers.CharField(read_only=True)

    class Meta:
        model = RoomRequest
        fields = ['id', 'tenant', 'title', 'description', 'price_range', 'preferred_location', 'created_at']