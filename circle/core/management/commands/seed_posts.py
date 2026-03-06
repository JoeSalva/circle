from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import Post
from faker import Faker
import random

fake = Faker()


class Command(BaseCommand):
    help = "Seed database with users and mock posts"

    def handle(self, *args, **options):
        users = list(User.objects.all())

        if len(users) < 4:
            User.objects.get_or_create(
                username="admin_two",
                defaults={
                    "email": "admin2@example.com",
                    "is_staff": True,
                    "is_superuser": True,
                },
            )
            User.objects.get_or_create(
                username="admin_three",
                defaults={
                    "email": "admin3@example.com",
                    "is_staff": True,
                    "is_superuser": True,
                },
            )
            User.objects.get_or_create(
                username="regular_user",
                defaults={
                    "email": "user@example.com",
                    "is_staff": False,
                    "is_superuser": False,
                },
            )

        users = list(User.objects.all())

        Post.objects.bulk_create(
            [
                Post(
                    user=random.choice(users),
                    post=fake.sentence(nb_words=12),
                    visibility=random.choice(["public", "private"]),
                )
                for _ in range(50)
            ]
        )

        self.stdout.write(self.style.SUCCESS("✅ 50 posts created"))