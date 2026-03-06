from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from .serializers import FeedPostSerializer, PostDetailSerializer,  CommentSerializer
from core.models import Post, Comment

@api_view(['GET'])
def post_feed(request):
    posts = Post.objects.all()
    serializer = FeedPostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def comment_list(request):
    comments = Comment.objects.all()
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)

class PostDetailAPIView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostDetailSerializer
    # lookup_url_kwarg = 'id'