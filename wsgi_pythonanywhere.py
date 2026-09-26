# PythonAnywhere WSGI file for Circle.
# On PythonAnywhere: Web tab -> click the WSGI configuration file link,
# DELETE its contents, paste this file in, and fix the two YOURUSERNAME values.
# Then: Web tab -> Reload.

import os
import sys

USERNAME = "YOURUSERNAME"  # <- fix this (appears twice below)

REPO = f"/home/{USERNAME}/circle-api"
PROJECT = f"{REPO}/circle"  # folder containing manage.py and the `circle` package

if PROJECT not in sys.path:
    sys.path.insert(0, PROJECT)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "circle.settings")
os.environ.setdefault("USE_SQLITE", "True")
os.environ.setdefault("DJANGO_SECRET_KEY", "change-me-to-a-long-random-string")
os.environ.setdefault("DEBUG", "False")
os.environ.setdefault("ALLOWED_HOSTS", f"{USERNAME}.pythonanywhere.com")

from django.core.wsgi import get_wsgi_application  # noqa: E402

application = get_wsgi_application()
