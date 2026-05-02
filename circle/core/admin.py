from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Post, Like, Comment, Following, Saved


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom User admin with extended fields."""
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    """Admin for Post model."""
    list_display = ('post_id', 'user', 'visibility', 'created_at', 'updated_at')
    list_filter = ('visibility', 'created_at')
    search_fields = ('post', 'user__username')
    readonly_fields = ('post_id', 'created_at', 'updated_at')
    ordering = ('-created_at',)


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    """Admin for Like model."""
    list_display = ('user', 'post', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'post__post_id')
    readonly_fields = ('created_at',)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """Admin for Comment model."""
    list_display = ('id', 'user', 'post', 'created_at', 'updated_at')
    list_filter = ('created_at',)
    search_fields = ('comment', 'user__username', 'post__post_id')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)


@admin.register(Following)
class FollowingAdmin(admin.ModelAdmin):
    """Admin for Following model."""
    list_display = ('follower', 'following', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('follower__username', 'following__username')
    readonly_fields = ('created_at',)


@admin.register(Saved)
class SavedAdmin(admin.ModelAdmin):
    """Admin for Saved model."""
    list_display = ('user', 'post', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'post__post_id')
    readonly_fields = ('created_at',)
