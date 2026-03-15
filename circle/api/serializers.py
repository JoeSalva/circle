from rest_framework import serializers
from core.models import Post, Like, Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = (
            'user',
            'comment',
            'image',
            'created_at'
        )


class FeedPostSerializer(serializers.ModelSerializer):
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

class PostCommentSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    class Meta:
        model = Post
        fields = (
            'post',
            'comments',
            'created_at',
        )

