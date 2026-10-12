from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    # Human front door: proof-of-work landing page. The live API (Swagger) is
    # linked from it, so visitors get context before raw schema.
    path('', TemplateView.as_view(template_name='home.html'), name='home'),
    path('admin/', admin.site.urls),
    path('', include('api.urls')),
    path('', include('user_profile.urls')),
    path('', include('interactions.urls')),
    path('', include('authentication.urls')),
]

if settings.ENABLE_SILK:
    urlpatterns.append(path('silk/', include('silk.urls', namespace='silk')))