from rest_framework import serializers
from rest_framework.reverse import reverse
from core.models import Post, User


class AuthorSerializer(serializers.ModelSerializer):
    """Serializer for user/author information in posts."""
    class Meta:
        model = User
        fields = ('id', 'username')


class PostSerializer(serializers.ModelSerializer):
    """Serializer for post list view with essential fields and metadata.
    
    Used in list views where we show a feed of posts.
    Optimized with prefetch_related in views for likes, comments, and saved.
    """
    post_id = serializers.UUIDField(read_only=True)
    total_comments = serializers.IntegerField(read_only=True)
    total_likes = serializers.IntegerField(read_only=True)
    is_liked = serializers.SerializerMethodField()
    post_url = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    user = AuthorSerializer(read_only=True)
    
    def get_is_liked(self, obj) -> bool:
        """Check if current user has liked this post."""
        user = self.context['request'].user

        if not user.is_authenticated:
            return False
        
        return len(getattr(obj, 'user_likes', [])) > 0
    
    def get_post_url(self, obj) -> str:
        """Generate URL to post detail view."""
        request = self.context.get('request')
        return reverse('post', kwargs={'post_id':obj.post_id}, request=request)
    
    def get_is_saved(self, obj) -> bool:
        """Check if current user has saved this post."""
        user = self.context['request'].user

        if not user.is_authenticated:
            return False
        
        return len(getattr(obj, 'user_saved', [])) > 0

    class Meta:
        model = Post
        fields = (
            'post_id',
            'post',
            'image',
            'user',
            'total_comments',
            'is_liked',
            'total_likes',
            'is_saved',
            'visibility',
            'post_url',
            'created_at',
        )
        read_only_fields = ('post_id', 'created_at', 'user')


class SinglePostSerializer(serializers.ModelSerializer):
    """Serializer for post detail view with extended metadata.
    
    Used in detail views where we show a single post with all interactions.
    Includes comments URL and saves count; replaces post_url with comments_url.
    """
    post_id = serializers.UUIDField(read_only=True)
    total_comments = serializers.IntegerField(read_only=True)
    total_likes = serializers.IntegerField(read_only=True)
    is_liked = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    comments_url = serializers.SerializerMethodField()
    total_saves = serializers.IntegerField(read_only=True)
    user = AuthorSerializer(read_only=True)
    
    def get_is_liked(self, obj) -> bool:
        """Check if current user has liked this post."""
        user = self.context['request'].user
        if not user.is_authenticated:
            return False
        return len(getattr(obj, 'user_likes', [])) > 0
    
    def get_comments_url(self, obj) -> str:
        """Generate URL to comments endpoint for this post."""
        request = self.context.get('request')
        return reverse('comments', kwargs={'post_id':obj.post_id}, request=request)
    
    def get_total_saves(self, obj) -> int:
        """Get the number of times this post has been saved."""
        return obj.saved.count()
    
    def get_is_saved(self, obj) -> bool:
        """Check if current user has saved this post."""
        user = self.context['request'].user

        if not user.is_authenticated:
            return False
        
        return len(getattr(obj, 'user_saved', [])) > 0

    class Meta:
        model = Post
        fields = (
            'post_id',
            'post',
            'image',
            'user',
            'total_comments',
            'is_liked',
            'is_saved',
            'total_likes',
            'total_saves',
            'comments_url',
            'created_at',
            'visibility',
        )
        read_only_fields = ('post_id', 'created_at', 'user')