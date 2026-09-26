#!/bin/bash
set -euo pipefail

cd circle

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

# Optional: create the admin user from env vars (set DJANGO_SUPERUSER_USERNAME,
# DJANGO_SUPERUSER_EMAIL, DJANGO_SUPERUSER_PASSWORD on the platform)
if [ -n "${DJANGO_SUPERUSER_USERNAME:-}" ]; then
  echo "Ensuring superuser exists..."
  python manage.py createsuperuser --noinput || true
fi

# Optional: seed demo posts (set SEED_DEMO=1)
if [ "${SEED_DEMO:-}" = "1" ]; then
  python manage.py seed_posts || true
fi

echo "Starting gunicorn..."
exec gunicorn circle.wsgi:application --bind "0.0.0.0:${PORT:-8000}" --workers 2 --threads 4 --timeout 60
