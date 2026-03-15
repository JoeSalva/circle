from rest_framework import serializers
from .models import Profile
from core.models import Post


class UserPostsSerializer(serializers.ModelSerializer):
    post_id = serializers.UUIDField(read_only=True)
    total_comments = serializers.SerializerMethodField()
    total_likes = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    def get_total_comments(self, obj) -> int:
        return obj.comments.count()
    
    def get_total_likes(self, obj) -> int:
        return obj.likes.count()
    
    def get_is_liked(self, obj) -> bool:
        user = self.context['request'].user
        return obj.likes.filter(user=user).exists()


    class Meta:
        model = Post
        fields = (
            'post_id',
            'post',
            'image',
            'total_comments',
            'is_liked',
            'total_likes',
            'visibility',
            'created_at',
        )



class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source = 'user.username')
    total_posts = serializers.SerializerMethodField(read_only=True)

    def get_total_posts(self, obj) -> int:
        return obj.user.posts.count()


    class Meta:
        model = Profile
        fields = (
            'username',
            'desc',
            'location',
            'total_posts'
        )