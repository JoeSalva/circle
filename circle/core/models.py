import uuid
from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    pass

class Post(models.Model):
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
    ]
    
    post_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    post = models.CharField(max_length=1000)
    image = models.ImageField(upload_to='core/posts/', null=True, blank=True)
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default='public')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.user.username}'s post - {self.created_at.strftime('%Y-%m-%d')} ({self.post_id})"

class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_like')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('post', 'user')

    def __str__(self) -> str:
        return f"{self.user.username} liked {self.post.user.username}'s post"

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_comment')
    comment = models.CharField(max_length=1000)
    image = models.ImageField(upload_to='comments/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Comment by {self.user.username} on {self.post.user.username}'s post"
    
class Following(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='follower')
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followed')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')

    def __str__(self) -> str:
        return f"{self.follower.username} follows {self.following.username}"
    
    def clean(self) -> None:
        if self.follower == self.following:
            raise ValidationError('Users cannot follow themselves')
        
class Saved(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='saved')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')

    class Meta:
        verbose_name = 'Saved'
        verbose_name_plural = 'Saved'
        unique_together = ('post', 'user')

    def __str__(self) -> str:
        return f'Post has been saved by {self.user.username}'
    