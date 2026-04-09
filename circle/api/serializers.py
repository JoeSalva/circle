from rest_framework import serializers
from rest_framework.reverse import reverse
from core.models import Post, User

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username'
        )

class PostSerializer(serializers.ModelSerializer):
    post_id = serializers.UUIDField(read_only=True)
    total_comments = serializers.SerializerMethodField()
    total_likes = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    post_url = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    user = AuthorSerializer(read_only=True)

    def get_total_comments(self, obj) -> int:
        return obj.comments.count()
    
    def get_total_likes(self, obj) -> int:
        return obj.likes.count()
    
    def get_is_liked(self, obj) -> bool:
        user = self.context['request'].user
        return obj.likes.filter(user=user).exists()
    
    def get_post_url(self, obj):
        request = self.context.get('request')
        return reverse('post', kwargs={'post_id':obj.post_id}, request=request)
    
    def get_is_saved(self, obj):
        user = self.context['request'].user
        return obj.saved.filter(user=user).exists()
    

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

class SinglePostSerializer(serializers.ModelSerializer):
    post_id = serializers.UUIDField(read_only=True)
    total_comments = serializers.SerializerMethodField()
    total_likes = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    comments_url = serializers.SerializerMethodField()
    total_saves = serializers.SerializerMethodField()
    user = AuthorSerializer(read_only=True)

    def get_total_comments(self, obj) -> int:
        return obj.comments.count()
    
    def get_total_likes(self, obj) -> int:
        return obj.likes.count()
    
    def get_is_liked(self, obj) -> bool:
        user = self.context['request'].user
        return obj.likes.filter(user=user).exists()
    
    def get_comments_url(self, obj):
        request = self.context.get('request')
        return reverse('comments', kwargs={'post_id':obj.post_id}, request=request)
    
    def get_total_saves(self, obj):
        user = self.context['request'].user
        return obj.saved.count()

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
            'total_saves',
            'comments_url',
            'created_at',
        )