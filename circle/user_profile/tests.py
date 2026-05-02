from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from core.models import User, Post
from .models import Profile


class ProfileAPITestCase(TestCase):
    """Test cases for Profile API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='test123')
        self.user2 = User.objects.create_user(username='testuser2', password='test123')
        self.client.force_authenticate(user=self.user)

    def test_list_profiles_excludes_current_user(self):
        """Test listing profiles excludes current user."""
        response = self.client.get('/users/profile/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        usernames = [p.get('username') for p in response.data.get('results', [])] # type: ignore
        self.assertNotIn('testuser', usernames)
        self.assertIn('testuser2', usernames)

    def test_retrieve_user_profile(self):
        """Test retrieving a specific user's profile."""
        response = self.client.get(f'/user/{self.user2.id}/profile/') # type: ignore
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser2') # type: ignore

    def test_retrieve_logged_user_profile(self):
        """Test retrieving current user's profile."""
        response = self.client.get('/user/me/profile/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_logged_user_profile(self):
        """Test updating current user's profile."""
        data = {'desc': 'Updated bio', 'location': 'NYC'}
        response = self.client.patch('/user/me/profile/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class UserPostsAPITestCase(TestCase):
    """Test cases for User Posts API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='test123')
        self.user2 = User.objects.create_user(username='testuser2', password='test123')
        self.client.force_authenticate(user=self.user)
        self.post = Post.objects.create(user=self.user, post='My post')

    def test_list_own_posts(self):
        """Test listing current user's posts."""
        response = self.client.get('/user/me/posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_post_from_profile(self):
        """Test creating post from user posts endpoint."""
        data = {'post': 'New post via profile'}
        response = self.client.post('/user/me/posts/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_other_user_posts(self):
        """Test listing another user's posts."""
        response = self.client.get(f'/user/{self.user2.id}/posts/') # type: ignore
        self.assertEqual(response.status_code, status.HTTP_200_OK)
