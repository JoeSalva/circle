import os
import sys

USERNAME = "SalvaGain"  # 

REPO = f"/home/{USERNAME}/circle"
PROJECT = f"{REPO}/circle"  # folder containing manage.py and the `circle` package

if PROJECT not in sys.path:
    sys.path.insert(0, PROJECT)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "circle.settings")
os.environ.setdefault("USE_SQLITE", "True")
os.environ.setdefault("DJANGO_SECRET_KEY", "fb8801c88fe4bf601c686d1d3697ca1703612509efcf988f4d34d7959a94ad88")
os.environ.setdefault("DEBUG", "False")
os.environ.setdefault("ALLOWED_HOSTS", f"{USERNAME}.pythonanywhere.com")

from django.core.wsgi import get_wsgi_application  # noqa: E402

application = get_wsgi_application()
