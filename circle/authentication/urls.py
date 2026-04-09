from django.urls import path
from .views import UserSignUpAPIView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    #Sign-up
    path('auth/signup/', UserSignUpAPIView.as_view(), name='sign_up'),
    
    #Simple-Jwt
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]