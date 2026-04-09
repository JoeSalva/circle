from django.contrib import admin
from django.urls import path
from .views import UsersProfileList, LoggedUserPostsListCreate, RetrieveUsersProfile, RetrieveLoggedUserProfile, UserPostsListAPIView

urlpatterns = [
    path('users/profile/', UsersProfileList.as_view(), name='profile'),
    path('user/<int:user_id>/profile/', RetrieveUsersProfile.as_view(), name='user_profile'),
    path('user/me/profile/', RetrieveLoggedUserProfile.as_view(), name='my_profile'),
    path('user/me/posts/', LoggedUserPostsListCreate.as_view(), name='profile_post'),
    path('user/<int:user_id>/posts/', UserPostsListAPIView.as_view(), name='user_post'),
]