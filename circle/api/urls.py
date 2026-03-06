from django.contrib import admin
from django.urls import path
from .views import post_feed, comment_list, PostDetailAPIView

urlpatterns = [
    path('post_feed/', post_feed, name='post'),
    path('comment_list/', comment_list, name='comments'),
    path('post_feed/<int:pk>', PostDetailAPIView.as_view(), name='post'),
]