from django.contrib import admin
from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    """Admin for Profile model."""
    list_display = ('user', 'location', 'desc')
    search_fields = ('user__username', 'location')
    readonly_fields = ('user',)
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Profile Info', {'fields': ('desc', 'location')}),
    )