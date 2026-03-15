from core.models import Like, Comment
from rest_framework import serializers

class PostLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = (
            'post',
            'user'
        )