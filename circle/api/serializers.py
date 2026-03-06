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
    comments = CommentSerializer(many=True, read_only=True)
    id = serializers.PrimaryKeyRelatedField(read_only=True)
    total_comments = serializers.SerializerMethodField()
    total_likes = serializers.SerializerMethodField()

    def get_total_comments(self, obj):
        comments = obj.comments.all()
        return len(comments)
    
    def get_total_likes(self, obj):
        likes = obj.likes.all()
        return len(likes)

    class Meta:
        model = Post
        fields = (
            'id',
            'post',
            'image',
            'comments',
            'total_comments',
            'total_likes',
            'visibility',
            'created_at',
        )

class PostDetailSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    class Meta:
        model = Post
        fields = (
            'post',
            'comments',
            'created_at',
        )
