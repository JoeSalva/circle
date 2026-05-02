from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from core.models import User, Post, Like, Comment, Following, Saved


class LikeAPITestCase(TestCase):
    """Test cases for Like API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='test123')
        self.post = Post.objects.create(user=self.user, post='Test post')
        self.client.force_authenticate(user=self.user)

    def test_toggle_like_on(self):
        """Test liking a post."""
        response = self.client.post(f'/posts/{self.post.post_id}/like')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['liked']) # type: ignore
        self.assertTrue(Like.objects.filter(user=self.user, post=self.post).exists())

    def test_toggle_like_off(self):
        """Test unliking a post."""
        Like.objects.create(user=self.user, post=self.post)
        response = self.client.post(f'/posts/{self.post.post_id}/like')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['liked']) # type: ignore
        self.assertFalse(Like.objects.filter(user=self.user, post=self.post).exists())


class CommentAPITestCase(TestCase):
    """Test cases for Comment API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='test123')
        self.post = Post.objects.create(user=self.user, post='Test post')
        self.client.force_authenticate(user=self.user)

    def test_list_comments(self):
        """Test retrieving comments on a post."""
        Comment.objects.create(user=self.user, post=self.post, comment='Test comment')
        response = self.client.get(f'/posts/{self.post.post_id}/comments')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_comment(self):
        """Test creating a comment on a post."""
        data = {'comment': 'Great post!'}
        response = self.client.post(f'/posts/{self.post.post_id}/comments', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Comment.objects.filter(user=self.user, post=self.post).exists())


class FollowAPITestCase(TestCase):
    """Test cases for Follow API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1', password='test123')
        self.user2 = User.objects.create_user(username='user2', password='test123')
        self.client.force_authenticate(user=self.user1)

    def test_toggle_follow_on(self):
        """Test following a user."""
        response = self.client.post(f'/follow/user/{self.user2.id}') # type: ignore
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['following']) # type: ignore
        self.assertTrue(Following.objects.filter(follower=self.user1, following=self.user2).exists())

    def test_toggle_follow_off(self):
        """Test unfollowing a user."""
        Following.objects.create(follower=self.user1, following=self.user2)
        response = self.client.post(f'/follow/user/{self.user2.id}') # type: ignore
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['following']) # type: ignore

    def test_cannot_follow_self(self):
        """Test cannot follow yourself."""
        response = self.client.post(f'/follow/user/{self.user1.id}') # type: ignore
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_followers(self):
        """Test retrieving followers list."""
        Following.objects.create(follower=self.user2, following=self.user1)
        response = self.client.get('/user/me/followers/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_following(self):
        """Test retrieving following list."""
        Following.objects.create(follower=self.user1, following=self.user2)
        response = self.client.get('/user/me/following/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class SaveAPITestCase(TestCase):
    """Test cases for Save API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='test123')
        self.post = Post.objects.create(user=self.user, post='Test post')
        self.client.force_authenticate(user=self.user)

    def test_toggle_save_on(self):
        """Test saving a post."""
        response = self.client.post(f'/posts/{self.post.post_id}/save')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['saved']) # type: ignore
        self.assertTrue(Saved.objects.filter(user=self.user, post=self.post).exists())

    def test_toggle_save_off(self):
        """Test unsaving a post."""
        Saved.objects.create(user=self.user, post=self.post)
        response = self.client.post(f'/posts/{self.post.post_id}/save')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['saved']) # type: ignore
