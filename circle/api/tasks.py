from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

@shared_task
def send_post_successful_email(post_id, user_email):
    subject = "Post Upload Successful"
    message = f"Your post with ID {post_id} has been successfully uploaded"
    return send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user_email])