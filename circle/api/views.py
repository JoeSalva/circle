from rest_framework import generics
from .serializers import PostSerializer, SinglePostSerializer
from core.models import Post, Following, Like
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsOwnerOrReadOnly
from rest_framework.pagination import PageNumberPagination


class PostDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a specific post."""
    queryset = Post.objects.select_related('user').prefetch_related('likes', 'comments', 'saved')
    serializer_class = SinglePostSerializer
    lookup_field = 'post_id'
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]


class PostListCreateAPIView(generics.ListCreateAPIView):
    """List all posts or create a new post."""
    serializer_class = PostSerializer
    pagination_class = PageNumberPagination
    
    def get_queryset(self): # type: ignore
        return Post.objects.select_related('user').prefetch_related('likes', 'comments', 'saved')
    
    def get_permissions(self):
        """Allow any user to view posts, but require authentication to create."""
        if self.request.method == 'POST':
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [AllowAny]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)

    
class FollowingPostsListAPIView(generics.ListAPIView):
    """List posts from users that the current user follows."""
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self): # type: ignore
        """Get posts from users followed by the current user."""
        following = Following.objects.filter(follower=self.request.user).values_list('following', flat=True)
        return Post.objects.filter(user__in=following).select_related('user').prefetch_related('likes', 'comments', 'saved')

    
class LikedPostsListAPIView(generics.ListAPIView):
    """List posts that the current user has liked."""
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self): # type: ignore
        """Get posts liked by the current user."""
        return Post.objects.filter(likes__user=self.request.user).select_related('user').prefetch_related('likes', 'comments', 'saved').distinct()

    
class SavedPostsListAPIView(generics.ListAPIView):
    """List posts that the current user has saved."""
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self): # type: ignore
        """Get posts saved by the current user."""
        return Post.objects.filter(saved__user=self.request.user).select_related('user').prefetch_related('likes', 'comments', 'saved').distinct()
    
