from django.shortcuts import render
from .serializers import UserProfileSerializer, UserPostsSerializer, PrivateProfileSerializer
from .models import Profile
from core.models import Post, User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

# GET all Users' Profile
class UsersProfileList(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.exclude(user = self.request.user)

#Retrieve Specific User Profile
class RetrieveUsersProfile(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'user__id'
    lookup_url_kwarg = 'user_id'
    pagination_class = None

# GET Logged In User's Profile View
class RetrieveLoggedUserProfile(generics.RetrieveUpdateAPIView):
    serializer_class = PrivateProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile #type:ignore
    
class LoggedUserPostsListCreate(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = UserPostsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)

class UserPostsListAPIView(generics.ListAPIView):
    serializer_class = UserPostsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): #type:ignore
        user = get_object_or_404(User, id=self.kwargs['user_id'])
        return Post.objects.filter(user=user)