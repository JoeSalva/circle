from django.conf import settings
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('api.urls')),
    path('', include('user_profile.urls')),
    path('', include('interactions.urls')),
    path('', include('authentication.urls')),
]

if settings.ENABLE_SILK:
    urlpatterns.append(path('silk/', include('silk.urls', namespace='silk')))