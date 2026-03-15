from django.contrib import admin
from django.urls import path
from .views import PostDetailAPIView, PostListCreateAPIView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('feed/post/<uuid:post_id>', PostDetailAPIView.as_view(), name='post'),
    path('feed/posts/', PostListCreateAPIView.as_view(), name='add_post'),

    #Schema/Documentation
    path('circle/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('circle/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('circle/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    #Simple-Jwt
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]