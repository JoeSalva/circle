from core.models import Like, Comment, Following, User, Saved
from rest_framework import serializers


class LikeSerializer(serializers.ModelSerializer):
    """Serializer for Like model."""
    class Meta:
        model = Like
        fields = ('post', 'user')
        read_only_fields = ('user',)


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for Comment model."""
    user = serializers.CharField(read_only=True)

    class Meta:
        model = Comment
        fields = (
            'id',
            'user',
            'comment',
            'image',
            'created_at',
            'updated_at'
        )
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')


class FollowSerializer(serializers.ModelSerializer):
    """Serializer for Following model."""
    follower = serializers.SerializerMethodField(read_only=True)
    
    def get_follower(self) -> str:
        """Get current user as follower."""
        user = self.context['request'].user
        return user

    class Meta:
        model = Following
        fields = ('follower', 'following')


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User with profile information."""
    description = serializers.CharField(source='profile.desc', read_only=True)
    
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'description'
        )
        read_only_fields = ('id', 'username', 'description')


class SavedPostsSerializer(serializers.ModelSerializer):
    """Serializer for Saved posts."""
    class Meta:
        model = Saved
        fields = ('post', 'user')
        read_only_fields = ('user',)