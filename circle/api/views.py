from rest_framework import generics, filters, status
from rest_framework.response import Response
from django.db.models import Prefetch, Count
from .serializers import PostSerializer, SinglePostSerializer
from core.models import Post, Following, Like, Saved
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsOwnerOrReadOnly
from rest_framework.pagination import PageNumberPagination
from .filters import PostFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers
from api.tasks import send_post_successful_email


class PostDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a specific post."""
    # queryset = Post.objects.all()
    serializer_class = SinglePostSerializer
    lookup_field = 'post_id'
    
    def get_queryset(self):  # type: ignore
        if self.request.method == "GET":
            return Post.objects.select_related(
                'user'
            ).annotate(
                total_likes=Count('likes', distinct=True),
                total_comments=Count('comments', distinct=True),
                total_saves=Count('saved', distinct=True)      
            ).prefetch_related(
                'comments',
                Prefetch(   
                    'likes', 
                    queryset=Like.objects.filter(user=self.request.user), 
                    to_attr='user_likes'
                ),
                Prefetch(
                    'saved',
                    queryset=Saved.objects.filter(user=self.request.user),
                    to_attr='user_saved'
                )
            )
        return Post.objects.select_related('user')
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"Post has been deleted"}, status=status.HTTP_204_NO_CONTENT)

    def get_permissions(self):
        self.permission_classes = [AllowAny]
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            self.permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
        return super().get_permissions()


class PostListCreateAPIView(generics.ListCreateAPIView):
    """List all posts or create a new post."""
    throttle_scope = 'posts'
    serializer_class = PostSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = PostFilter
    search_fields = ['user__username', 'post']
    ordering_fields = ['created_at']
    
    # @method_decorator (cache_page(60 * 15, key_prefix='post_list'))
    # @method_decorator (vary_on_headers("Authorization"))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self): # type: ignore
        return Post.objects.select_related(
            'user'
            ).annotate(
            total_likes = Count('likes', distinct=True),
            total_comments = Count('comments', distinct=True)            
        ).prefetch_related(
            'comments',
            Prefetch(   
                'likes', 
                queryset=Like.objects.filter(user=self.request.user), 
                to_attr='user_likes'
                ),
            Prefetch(
                'saved',
                queryset=Saved.objects.filter(user=self.request.user),
                to_attr='user_saved'
                )
            )
    
    def get_permissions(self):
        """Allow any user to view posts, but require authentication to create."""
        if self.request.method == 'POST':
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [AllowAny]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        post = serializer.save(user=self.request.user)
        send_post_successful_email.delay(post.post_id, self.request.user.email) #type:ignore

    
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