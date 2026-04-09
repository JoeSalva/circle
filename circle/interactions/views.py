from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from api.permissions import IsOwnerOrReadOnly
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from core.models import Post, Like, Comment, User, Following
from .serializers import LikeSerializer, CommentSerializer, FollowSerializer, UserSerializer, SavedPostsSerializer

# Create your views here.
class ToggleLikeAPIView(generics.GenericAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def post(self, request, post_id):
        post = get_object_or_404(Post, post_id=post_id)
        like = Like.objects.filter(user=request.user, post=post)

        if like.exists():
            like.delete()
            return Response({'liked': False})
        else:
            Like.objects.create(user=request.user, post=post)
            return Response({'liked': True})

class CommentPostAPIView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self): #type:ignore
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id)
    
    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        post = Post.objects.get(post_id=post_id)
        return serializer.save(post=post, user=self.request.user)
    
class ToggleFollowAPIView(generics.GenericAPIView):
    serializer_class = FollowSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, id):
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
    serializer_class = UserSerializer

    def get_queryset(self): #type:ignore
        followers = Following.objects.filter(following=self.request.user).values('follower')
        return User.objects.filter(id__in=followers)

class FollowingListAPIView(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self): #type:ignore
        following = Following.objects.filter(follower=self.request.user).values('following')
        return User.objects.filter(id__in=following)
    
# class SavedPostsListAPIView(generics.ListAPIView):
#     serializer_class = Post
#     permission_classes = [IsAuthenticated]