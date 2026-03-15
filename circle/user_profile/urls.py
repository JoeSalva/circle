from django.contrib import admin
from django.urls import path
from .views import UserProfileList, UserPostsListCreate

urlpatterns = [
    path('profile/', UserProfileList.as_view(), name='profile'),
    path('profile/posts', UserPostsListCreate.as_view(), name='profile'),
]