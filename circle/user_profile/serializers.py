from rest_framework import serializers
from rest_framework.reverse import reverse
from .models import Profile
from core.models import Post


class UserPostsSerializer(serializers.ModelSerializer):
    post_id = serializers.UUIDField(read_only=True)
    total_comments = serializers.SerializerMethodField()
    total_likes = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    comments_url = serializers.SerializerMethodField()

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
            'comments_url',
            'created_at',
        )

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    total_posts = serializers.SerializerMethodField(read_only=True)
    followers = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()
    is_follower = serializers.SerializerMethodField()
    posts_url = serializers.SerializerMethodField()

    def get_total_posts(self, obj) -> int:
        return obj.user.posts.count()
    
    def get_following(self, obj) -> int:
        return obj.user.follower.count()    
   
    def get_followers(self, obj) -> int:
        return obj.user.followed.count()
    
    def get_is_following(self, obj) -> bool:
        user = self.context['request'].user
        return user.follower.filter(following=obj.user).exists()
        
    def get_is_follower(self, obj) -> bool:
        user = self.context['request'].user
        return user.followed.filter(follower=obj.user).exists()
        
    def get_posts_url(self, obj) -> str:
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
            'is_following',
            'is_follower',
            'posts_url'
        )

class PrivateProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    total_posts = serializers.SerializerMethodField(read_only=True)
    followers = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()
    posts_url = serializers.SerializerMethodField()

    def get_total_posts(self, obj) -> int:
        return obj.user.posts.count()
    
    def get_followers(self, obj) -> int:
        return obj.user.follower.count()
    
    def get_following(self, obj) -> int:
        return obj.user.following.count()
    
    def get_posts_url(self, obj):
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
                'posts_url'
            )