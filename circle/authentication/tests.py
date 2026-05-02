from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from core.models import User


class SignUpAPITestCase(TestCase):
    """Test cases for Sign Up API endpoint."""
    
    def setUp(self):
        self.client = APIClient()

    def test_signup_success(self):
        """Test successful user signup."""
        data = {
            'username': 'newuser',
            'password': 'SecurePass123!'
        }
        response = self.client.post('/auth/signup/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_signup_weak_password(self):
        """Test signup with weak password."""
        data = {
            'username': 'newuser',
            'password': '123'  # Too short
        }
        response = self.client.post('/auth/signup/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_signup_duplicate_username(self):
        """Test signup with existing username."""
        User.objects.create_user(username='existing', password='test123')
        data = {
            'username': 'existing',
            'password': 'SecurePass123!'
        }
        response = self.client.post('/auth/signup/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TokenAPITestCase(TestCase):
    """Test cases for JWT Token API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='test123')

    def test_obtain_token(self):
        """Test obtaining JWT token."""
        data = {
            'username': 'testuser',
            'password': 'test123'
        }
        response = self.client.post('/api/token/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data) # type: ignore
        self.assertIn('refresh', response.data) # type: ignore

    def test_obtain_token_wrong_password(self):
        """Test obtaining token with wrong password."""
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        response = self.client.post('/api/token/', data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_token(self):
        """Test refreshing access token."""
        # First obtain token
        login_data = {
            'username': 'testuser',
            'password': 'test123'
        }
        login_response = self.client.post('/api/token/', login_data)
        refresh_token = login_response.data['refresh'] # type: ignore
        
        # Then refresh
        response = self.client.post('/api/token/refresh/', {'refresh': refresh_token})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data) # type: ignore
