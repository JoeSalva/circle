from rest_framework import generics
from .serializers import PostSerializer, SinglePostSerializer
from core.models import Post, Following, Like
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsOwnerOrReadOnly
from rest_framework.pagination import PageNumberPagination

class PostDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = SinglePostSerializer
    lookup_field = 'post_id'
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    pagination_class = PageNumberPagination

class PostListCreateAPIView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = PageNumberPagination
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    
    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)

    def get_permissions(self):
        self.permission_classes = [AllowAny]
        if self.request.method == 'POST':
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()
    
class FollowingPostsListAPIView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self): #type:ignore
        following = Following.objects.filter(follower=self.request.user).values('following')
        return Post.objects.filter(user__in=following).select_related('user')
    
class LikedPostsListAPIView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self): #type:ignore
        return Post.objects.filter(likes__user=self.request.user).select_related('user')
    
class SavedPostsListAPIView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):  # type: ignore
        return Post.objects.filter(saved__user=self.request.user).select_related('user')
    
