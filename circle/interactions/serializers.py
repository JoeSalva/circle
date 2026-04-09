from core.models import Like, Comment, Following, User, Saved
from rest_framework import serializers

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = (
            'post',
            'user'
        )

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.CharField(read_only=True)

    class Meta:
        model = Comment
        fields = (
            'user',
            'comment',
            'image',
            'created_at'
        )

class FollowSerializer(serializers.ModelSerializer):
    follower = serializers.SerializerMethodField(read_only=True)
    def get_follower(self):
        user = self.context['request'].user
        return user

    class Meta:
        model = Following
        fields = (
            'follower',
            'following'
        )

class UserSerializer(serializers.ModelSerializer):
    description = serializers.CharField(source='profile.desc')
    class Meta:
        model=User
        fields = (
            'username',
            'description'
        )

class SavedPostsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Saved
        fields = (
            'post',
            'user'
        )