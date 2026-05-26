from .serializers import UserProfileSerializer, UserPostsSerializer, PrivateProfileSerializer
from .models import Profile
from core.models import Post, User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404


class UsersProfileList(generics.ListAPIView):
    """List all user profiles except the current user."""
    throttle_scope = 'profiles'
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self): # type: ignore
        """Get all profiles excluding the current user."""
        return Profile.objects.exclude(user=self.request.user).select_related('user')


class RetrieveUsersProfile(generics.RetrieveAPIView):
    """Retrieve a specific user's profile."""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'user__id'
    lookup_url_kwarg = 'user_id'

    def get_queryset(self): # type: ignore
        return Profile.objects.select_related('user')


class RetrieveLoggedUserProfile(generics.RetrieveUpdateAPIView):
    """Retrieve or update the current user's profile."""
    serializer_class = PrivateProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile  # type: ignore


class LoggedUserPostsListCreate(generics.ListCreateAPIView):
    """List all posts by the current user or create a new post."""
    serializer_class = UserPostsSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self): # type: ignore
        """Get all posts for the current user."""
        return Post.objects.filter(user=self.request.user).select_related('user').prefetch_related('likes', 'comments').order_by('-created_at')
    
    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)


class UserPostsListAPIView(generics.ListAPIView):
    """List all posts by a specific user."""
    serializer_class = UserPostsSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self): # type: ignore
        """Get all posts for a specific user."""
        user = get_object_or_404(User, id=self.kwargs['user_id'])
        return Post.objects.filter(user=user).select_related('user').prefetch_related('likes', 'comments').order_by('-created_at')