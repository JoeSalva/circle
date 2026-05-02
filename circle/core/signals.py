import logging
from .models import User
from user_profile.models import Profile
from django.dispatch import receiver
from django.db.models.signals import post_save

logger = logging.getLogger(__name__)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create user profile when a new user is created."""
    if created:
        Profile.objects.create(user=instance)
        logger.info(f"Profile created for user: {instance.username}")