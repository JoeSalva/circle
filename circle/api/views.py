from rest_framework import generics
from .serializers import FeedPostSerializer, PostCommentSerializer
from core.models import Post
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsOwnerOrReadOnly
from rest_framework.pagination import PageNumberPagination

class PostDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostCommentSerializer
    lookup_field = 'post_id'
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

class PostListCreateAPIView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = FeedPostSerializer
    pagination_class = PageNumberPagination
    permission_classes = [IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)

    def get_permissions(self):
        self.permission_classes = [AllowAny]
        if self.request.method == 'POST':
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()