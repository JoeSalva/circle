from django.db import models
from core.models import User

# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    desc = models.CharField(max_length=45, null=True, blank=True)
    location = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.user.username}'s Profile"