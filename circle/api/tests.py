# from django.test import TestCase
# from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from core.models import User, Post, Like, Comment
from rest_framework.test import APITestCase

# class PostAPITestCase(TestCase):
#     """Test cases for Post API endpoints."""
    
#     def setUp(self):
#         self.client = APIClient()
#         self.user = User.objects.create_user(username='testuser', password='test123')
#         self.user2 = User.objects.create_user(username='testuser2', password='test123')
#         self.client.force_authenticate(user=self.user)
#         self.post = Post.objects.create(user=self.user, post='Test post')

#     def test_list_posts(self):
#         """Test retrieving list of posts."""
#         response = self.client.get('/posts/')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_create_post_authenticated(self):
#         """Test creating a post when authenticated."""
#         data = {'post': 'New test post'}
#         response = self.client.post('/posts/', data)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)

#     def test_create_post_unauthenticated(self):
#         """Test creating a post without authentication."""
#         self.client.force_authenticate(user=None) # type: ignore
#         data = {'post': 'New test post'}
#         response = self.client.post('/posts/', data)
#         self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        

#     def test_retrieve_post(self):
#         """Test retrieving a single post."""
#         response = self.client.get(f'/posts/{self.post.post_id}')
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response.data['post'], 'Test post') # type: ignore

#     def test_update_own_post(self):
#         """Test updating your own post."""
#         data = {'post': 'Updated post'}
#         response = self.client.patch(f'/posts/{self.post.post_id}', data)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#     def test_update_others_post(self):
#         """Test cannot update someone else's post."""
#         self.client.force_authenticate(user=self.user2) # type: ignore
#         data = {'post': 'Hacked post'}
#         response = self.client.patch(f'/posts/{self.post.post_id}', data)
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

#     def test_delete_own_post(self):
#         """Test deleting your own post."""
#         response = self.client.delete(f'/posts/{self.post.post_id}')
#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

#     def test_delete_others_post(self):
#         """Test cannot delete someone else's post."""
#         self.client.force_authenticate(user=self.user2) # type: ignore
#         response = self.client.delete(f'/posts/{self.post.post_id}')
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)