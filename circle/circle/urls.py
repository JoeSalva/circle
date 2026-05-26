from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('api.urls')),
    path('', include('user_profile.urls')),
    path('', include('interactions.urls')),
    path('', include('authentication.urls')),
    path('silk/', include('silk.urls', namespace='silk'))
]