from django.shortcuts import render
from .serializers import UserProfileSerializer, UserPostsSerializer
from .models import Profile
from core.models import Post, User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class UserProfileList(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(user = self.request.user)

class UserPostsListCreate(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = UserPostsSerializer
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)