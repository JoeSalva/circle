from rest_framework import serializers
from rest_framework.reverse import reverse
from .models import Profile
from core.models import Post


class UserPostsSerializer(serializers.ModelSerializer):
    """Serializer for posts in user profile."""
    post_id = serializers.UUIDField(read_only=True)
    total_comments = serializers.IntegerField(read_only=True)
    total_likes = serializers.IntegerField(read_only=True)
    is_liked = serializers.SerializerMethodField()
    post_url = serializers.SerializerMethodField()
    comments_url = serializers.SerializerMethodField()
    
    
    def get_is_liked(self, obj) -> bool:
        """Check if current user has liked this post."""
        # user = self.context['request'].user
        return bool(getattr(obj, 'user_likes', []))
    
    def get_comments_url(self, obj) -> str:
        """Get URL to comments endpoint."""
        request = self.context.get('request')
        return reverse('comments', kwargs={'post_id': obj.post_id}, request=request)
    
    def get_post_url(self, obj) -> str:
        """Generate URL to post detail view."""
        request = self.context.get('request')
        return reverse('post', kwargs={'post_id':obj.post_id}, request=request)

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
            'post_url',
            'comments_url',
            'created_at',
        )
        read_only_fields = ('post_id', 'created_at', 'is_liked', 'total_comments', 'total_likes', 'comments_url', 'post_url')


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for public user profile information."""
    username = serializers.CharField(source='user.username', read_only=True)
    total_posts = serializers.IntegerField(read_only=True)
    followers = serializers.IntegerField(read_only=True)
    following = serializers.IntegerField(read_only=True)
    user_follows = serializers.SerializerMethodField()
    follows_user = serializers.SerializerMethodField()
    posts_url = serializers.SerializerMethodField()

    
    def get_user_follows(self, obj) -> bool:
        """Check if current user is following this user."""
        # Uses prefetched data from view
        return len(getattr(obj.user, 'followed_by_me', [])) > 0
        
    def get_follows_user(self, obj) -> bool:
        """Check if this user is following the current user."""
        return len(getattr(obj.user, 'following_me', [])) > 0
        
    def get_posts_url(self, obj) -> str:
        """Get URL to user's posts."""
        request = self.context.get('request')
        return reverse('user_post', kwargs={'user_id': obj.user.id}, request=request)

    class Meta:
        model = Profile
        fields = (
            'username',
            'desc',
            'location',
            'total_posts',
            'following',
            'followers',
            'user_follows',
            'follows_user',
            'posts_url'
        )
        read_only_fields = ('username', 'total_posts', 'following', 'followers', 'user_follows', 'follows_user', 'posts_url')


class PrivateProfileSerializer(serializers.ModelSerializer):
    """Serializer for current user's profile (editable)."""
    username = serializers.CharField(source='user.username', read_only=True)
    total_posts = serializers.IntegerField(read_only=True)
    followers = serializers.IntegerField(read_only=True)
    following = serializers.IntegerField(read_only=True)
    posts_url = serializers.SerializerMethodField()

    def get_posts_url(self, obj) -> str:
        """Get URL to user's posts."""
        request = self.context.get('request')
        return reverse('user_post', kwargs={'user_id': obj.user.id}, request=request)

    class Meta:
        model = Profile
        fields = (
            'username',
            'desc',
            'location',
            'total_posts',
            'followers',
            'following',
            'posts_url'
        )
        read_only_fields = ('username', 'total_posts', 'followers', 'following', 'posts_url')