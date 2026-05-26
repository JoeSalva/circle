import logging
from .models import User
from user_profile.models import Profile
from.models import Post
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete
from django.core.cache import cache

logger = logging.getLogger(__name__)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create user profile when a new user is created."""
    if created:
        Profile.objects.create(user=instance)
        logger.info(f"Profile created for user: {instance.username}")

@receiver([post_save, post_delete], sender=Post)
def invalidate_post_cache(sender, instance, **kwargs):
    """to delete post caches when a post is saved or is deleted"""
    cache.delete_pattern('*post_list*') #type:ignore