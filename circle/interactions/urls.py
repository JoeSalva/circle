from django.urls import path, include
from interactions.views import ToggleLikeAPIView

urlpatterns = [
    path('posts/<uuid:post_id>/like', ToggleLikeAPIView.as_view(), name='likes'),
]