# Circle Social Media API

Circle is a Django REST Framework backend for a social media platform. It models the core interactions behind a feed-based product: users can register, authenticate with JWTs, create posts, comment, like, save posts, follow other users, and view profile and feed endpoints.

The project is organized as a production-style API rather than a tutorial prototype. It uses a custom user model, normalized relationship tables for social interactions, filtered and paginated list endpoints, OpenAPI documentation through drf-spectacular, Redis-backed infrastructure for caching/Celery, and query optimizations such as `select_related`, `prefetch_related`, and annotated counts.

## What the API Supports

- User signup and JWT authentication
- Public post listing and post detail views
- Authenticated post creation, updates, and deletion by owners
- Post images and public/private visibility fields
- Like/unlike and save/unsave toggles
- Comment listing and creation on posts
- Follow/unfollow relationships between users
- Lists for followers, following, followed-user posts, liked posts, and saved posts
- Public profile browsing and editable current-user profile data
- Search, filtering, ordering, and pagination on supported list endpoints
- Generated Swagger UI and ReDoc API documentation
- Celery task dispatch after post creation

## Tech Stack

- Python
- Django
- Django REST Framework
- Simple JWT
- PostgreSQL
- Redis
- Celery
- django-filter
- drf-spectacular
- django-silk

## Project Structure

```text
circle/
  api/              Post feeds, post detail views, filters, and Celery tasks
  authentication/   Signup and JWT token routes
  core/             Shared models: User, Post, Like, Comment, Following, Saved
  interactions/     Like, save, comment, follow, followers, and following APIs
  user_profile/     Profile and user-post APIs
  circle/           Django settings, root URLs, Celery app, ASGI/WSGI
```

## Main Data Models

- `User`: custom Django user model used across the project.
- `Profile`: one-to-one profile for a user, including description and location.
- `Post`: user-owned content with text, optional image, visibility, and UUID primary key.
- `Like`: unique user/post relationship for liking posts.
- `Comment`: user-authored comments attached to posts.
- `Following`: unique follower/following relationship between users.
- `Saved`: unique user/post relationship for saved posts.

## API Overview

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/signup/` | Register a new user |
| `POST` | `/api/token/` | Obtain JWT access and refresh tokens |
| `POST` | `/api/token/refresh/` | Refresh an access token |

### Posts and Feeds

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/posts/` | List posts with pagination, filtering, search, and ordering |
| `POST` | `/posts/` | Create a post as the authenticated user |
| `GET` | `/posts/<post_id>` | Retrieve a single post |
| `PUT/PATCH` | `/posts/<post_id>` | Update a post owned by the authenticated user |
| `DELETE` | `/posts/<post_id>` | Delete a post owned by the authenticated user |
| `GET` | `/following/posts/` | List posts from users the current user follows |
| `GET` | `/liked/posts/` | List posts liked by the current user |
| `GET` | `/saved/posts/` | List posts saved by the current user |

### Interactions

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/posts/<post_id>/like` | Toggle like/unlike for a post |
| `POST` | `/posts/<post_id>/save` | Toggle save/unsave for a post |
| `GET` | `/posts/<post_id>/comments` | List comments on a post |
| `POST` | `/posts/<post_id>/comments` | Add a comment to a post |
| `POST` | `/follow/user/<id>` | Toggle follow/unfollow for a user |
| `GET` | `/user/me/followers/` | List the current user's followers |
| `GET` | `/user/me/following/` | List users followed by the current user |

### Profiles

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/users/profile/` | List user profiles except the current user |
| `GET` | `/user/<user_id>/profile/` | Retrieve another user's profile |
| `GET` | `/user/me/profile/` | Retrieve the current user's profile |
| `PUT/PATCH` | `/user/me/profile/` | Update the current user's profile |
| `GET` | `/user/me/posts/` | List the current user's posts |
| `POST` | `/user/me/posts/` | Create a post from the current-user posts endpoint |
| `GET` | `/user/<user_id>/posts/` | List posts by a specific user |

### API Documentation

| Endpoint | Description |
| --- | --- |
| `/circle/schema/` | OpenAPI schema |
| `/circle/schema/swagger-ui/` | Swagger UI |
| `/circle/schema/redoc/` | ReDoc documentation |

## Query Features

The post list endpoint supports:

- Filtering by username and post text through `django-filter`
- Searching by username and post content
- Ordering by `created_at`
- Paginated responses

Several list/detail views annotate response data with counts such as `total_likes`, `total_comments`, `total_saves`, `followers`, `following`, and `total_posts`.

## Local Setup

1. Clone the repository and enter the project directory.

   ```bash
   git clone <repository-url>
   cd circle
   ```

2. Create and activate a virtual environment.

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```

3. Install dependencies.

   ```bash
   pip install -r requirements.txt
   ```

4. Configure PostgreSQL.

   The current settings expect a local PostgreSQL database named `circle_db`. Update `circle/circle/settings.py` or your environment-specific settings to match your local database credentials.

5. Run migrations.

   ```bash
   cd circle
   python manage.py migrate
   ```

6. Start the development server.

   ```bash
   python manage.py runserver
   ```

The API will be available at `http://127.0.0.1:8000/`.

## Optional Services

Redis is configured for Django caching and as the Celery broker/result backend:

```text
redis://127.0.0.1:6379/1
```

To run background workers for post-created email tasks, start Redis and then run:

```bash
celery -A circle worker -l info
```

The project also includes django-silk at `/silk/` for request profiling during development.

## Running Tests

From the Django project directory:

```bash
python manage.py test
```

## Project Goal

This project is a backend engineering portfolio project focused on building a clear, extensible REST API for social networking behavior. It demonstrates practical DRF patterns for authentication, permissions, relational modeling, serialized API responses, endpoint organization, and performance-aware database access.