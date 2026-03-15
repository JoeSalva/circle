from django.contrib import admin
from .models import User
from user_profile.models import Profile

# Register your models here.

class ProfileInline(admin.TabularInline):
    model = Profile
    can_delete = False

class UserAdmin(admin.ModelAdmin):
    inlines = [
        ProfileInline
    ]

admin.site.register(User, UserAdmin)