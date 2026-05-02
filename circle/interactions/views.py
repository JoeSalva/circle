from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from core.models import Post, Like, Comment, User, Following, Saved
from .serializers import LikeSerializer, CommentSerializer, FollowSerializer, UserSerializer, SavedPostsSerializer


class ToggleLikeAPIView(generics.GenericAPIView):
    """Toggle like status on a post."""
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        """Create or delete a like."""
        post = get_object_or_404(Post, post_id=post_id)
        like = Like.objects.filter(user=request.user, post=post)

        if like.exists():
            like.delete()
            return Response({'liked': False})
        else:
            Like.objects.create(user=request.user, post=post)
            return Response({'liked': True})


class CommentPostAPIView(generics.ListCreateAPIView):
    """List all comments on a post or create a new comment."""
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self): # type: ignore
        """Get all comments for a specific post."""
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id).select_related('user').order_by('-created_at')
    
    def perform_create(self, serializer):
        """Create comment and associate it with the post and user."""
        post_id = self.kwargs['post_id']
        post = get_object_or_404(Post, post_id=post_id)
        return serializer.save(post=post, user=self.request.user)

    
class ToggleFollowAPIView(generics.GenericAPIView):
    """Toggle follow status on a user."""
    serializer_class = FollowSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, id):
        """Create or delete a follow relationship."""
        user = get_object_or_404(User, id=id)

        if request.user == user:
            return Response({'detail': 'Users cannot follow themselves'}, status=400)

        following = Following.objects.filter(follower=request.user, following=user)

        if following.exists():
            following.delete()
            return Response({'following': False})
        else:
            Following.objects.create(follower=request.user, following=user)
            return Response({'following': True})

        
class FollowersListAPIView(generics.ListAPIView):
    """List all followers of the current user."""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self): # type: ignore
        """Get all users following the current user."""
        followers = Following.objects.filter(following=self.request.user).values_list('follower', flat=True)
        return User.objects.filter(id__in=followers).select_related('profile')


class FollowingListAPIView(generics.ListAPIView):
    """List all users that the current user is following."""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self): # type: ignore
        """Get all users followed by the current user."""
        following = Following.objects.filter(follower=self.request.user).values_list('following', flat=True)
        return User.objects.filter(id__in=following).select_related('profile')

    
class ToggleSaveAPIView(generics.GenericAPIView):
    """Toggle save status on a post."""
    serializer_class = SavedPostsSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        """Create or delete a saved post."""
        post = get_object_or_404(Post, post_id=post_id)
        save = Saved.objects.filter(user=request.user, post=post)
        
        if save.exists():
            save.delete()
            return Response({'saved': False})
        else:
            Saved.objects.create(user=request.user, post=post)
            return Response({'saved': True})