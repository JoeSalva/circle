from django.contrib import admin
from django.urls import path
from .views import PostDetailAPIView, PostListCreateAPIView, FollowingPostsListAPIView, LikedPostsListAPIView, SavedPostsListAPIView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('posts/<uuid:post_id>', PostDetailAPIView.as_view(), name='post'),
    path('posts/', PostListCreateAPIView.as_view(), name='add_post'),
    path('following/posts/', FollowingPostsListAPIView.as_view(), name='friend_posts'),
    path('liked/posts/', LikedPostsListAPIView.as_view(), name='liked_posts'),
    path('saved/posts/', SavedPostsListAPIView.as_view(), name='saved_posts'),

    #Schema/Documentation
    path('circle/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('circle/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('circle/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]