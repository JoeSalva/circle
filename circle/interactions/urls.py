from django.urls import path, include
from interactions.views import ToggleLikeAPIView, CommentPostAPIView, ToggleFollowAPIView, FollowersListAPIView, FollowingListAPIView

urlpatterns = [
    path('posts/<uuid:post_id>/like', ToggleLikeAPIView.as_view(), name='likes'),
    path('posts/<uuid:post_id>/comments', CommentPostAPIView.as_view(), name='comments'),
    path('follow/user/<int:id>', ToggleFollowAPIView.as_view(), name='follow'),
    path('user/me/followers/', FollowersListAPIView.as_view(), name='followers'),
    path('user/me/following/', FollowingListAPIView.as_view(), name='following'),
]