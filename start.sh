#!/bin/bash
set -euo pipefail

cd circle

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting gunicorn..."
exec gunicorn circle.wsgi:application --bind "0.0.0.0:${PORT:-8000}" --workers 2 --threads 4 --timeout 60
