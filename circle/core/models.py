import uuid
from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Extended user model for social media platform."""
    pass


class Post(models.Model):
    """User post model with visibility controls."""
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
    ]
    
    post_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts', db_index=True)
    post = models.CharField(max_length=1000)
    image = models.ImageField(upload_to='core/posts/', null=True, blank=True)
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default='public', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['visibility', '-created_at']),
        ]

    def __str__(self) -> str:
        return f"{self.user.username}: {self.post_id}"


class Like(models.Model):
    """Model for tracking user likes on posts."""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes', db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_like', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('post', 'user')
        indexes = [
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self) -> str:
        return f"{self.user.username} liked {self.post.user.username}'s post"


class Comment(models.Model):
    """Model for post comments with explicit ID field."""
    id = models.AutoField(primary_key=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments', db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_comment', db_index=True)
    comment = models.CharField(max_length=1000)
    image = models.ImageField(upload_to='comments/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['post', '-created_at']),
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self) -> str:
        return f"Comment by {self.user.username} on {self.post.user.username}'s post"


class Following(models.Model):
    """Model for tracking user follow relationships."""
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='follower', db_index=True)
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followed', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')
        indexes = [
            models.Index(fields=['follower', '-created_at']),
            models.Index(fields=['following', '-created_at']),
        ]

    def __str__(self) -> str:
        return f"{self.follower.username} follows {self.following.username}"
    
    def clean(self) -> None:
        if self.follower == self.following:
            raise ValidationError('Users cannot follow themselves')


class Saved(models.Model):
    """Model for tracking user saved posts."""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='saved', db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Saved'
        verbose_name_plural = 'Saved'
        unique_together = ('post', 'user')
        indexes = [
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self) -> str:
        return f'Post has been saved by {self.user.username}'