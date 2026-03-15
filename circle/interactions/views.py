from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from core.models import Post, Like
from .serializers import PostLikeSerializer

# Create your views here.

class ToggleLikeAPIView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, post_id=post_id)
        like = Like.objects.filter(user=request.user, post=post)

        if like.exists():
            like.delete()
            return Response({'liked': False})
        else:
            Like.objects.create(user=request.user, post=post)
            return Response({'liked': True})
    

