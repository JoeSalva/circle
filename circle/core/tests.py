from django.test import TestCase
from django.core.exceptions import ValidationError
from .models import User, Post, Like, Comment, Following, Saved


class UserModelTestCase(TestCase):
    """Test cases for User model."""
    
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='testuser1',
            password='testpass123'
        )
        self.user2 = User.objects.create_user(
            username='testuser2',
            password='testpass123'
        )

    def test_create_user(self):
        """Test user creation."""
        self.assertEqual(self.user1.username, 'testuser1')
        self.assertTrue(self.user1.check_password('testpass123'))

    def test_user_str(self):
        """Test user string representation."""
        self.assertEqual(str(self.user1), 'testuser1')


class PostModelTestCase(TestCase):
    """Test cases for Post model."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.post = Post.objects.create(
            user=self.user,
            post='Test post content',
            visibility='public'
        )

    def test_create_post(self):
        """Test post creation."""
        self.assertEqual(self.post.post, 'Test post content')
        self.assertEqual(self.post.user, self.user)
        self.assertEqual(self.post.visibility, 'public')

    def test_post_str(self):
        """Test post string representation contains username."""
        post_str = str(self.post)
        self.assertIn('testuser', post_str)
        self.assertIn(str(self.post.post_id), post_str)

    def test_post_ordering(self):
        """Test posts are ordered by creation date."""
        post2 = Post.objects.create(user=self.user, post='Second post')
        posts = Post.objects.all()
        self.assertEqual(posts[0], post2)


class LikeModelTestCase(TestCase):
    """Test cases for Like model."""
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='test')
        self.post = Post.objects.create(user=self.user, post='Test')
        self.like = Like.objects.create(user=self.user, post=self.post)

    def test_create_like(self):
        """Test like creation."""
        self.assertEqual(self.like.user, self.user)
        self.assertEqual(self.like.post, self.post)

    def test_like_unique_constraint(self):
        """Test user can only like a post once."""
        with self.assertRaises(Exception):
            Like.objects.create(user=self.user, post=self.post)

    def test_like_str(self):
        """Test like string representation."""
        like_str = str(self.like)
        self.assertIn('testuser', like_str)
        self.assertIn('liked', like_str)


class CommentModelTestCase(TestCase):
    """Test cases for Comment model."""
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='test')
        self.post = Post.objects.create(user=self.user, post='Test')
        self.comment = Comment.objects.create(
            user=self.user,
            post=self.post,
            comment='Test comment'
        )

    def test_create_comment(self):
        """Test comment creation."""
        self.assertEqual(self.comment.comment, 'Test comment')
        self.assertEqual(self.comment.user, self.user)
        self.assertEqual(self.comment.post, self.post)

    def test_comment_ordering(self):
        """Test comments are ordered by creation date."""
        comment2 = Comment.objects.create(user=self.user, post=self.post, comment='Second')
        comments = Comment.objects.all()
        self.assertEqual(comments[0], comment2)  # Most recent first


class FollowingModelTestCase(TestCase):
    """Test cases for Following model."""
    
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='test')
        self.user2 = User.objects.create_user(username='user2', password='test')
        self.following = Following.objects.create(follower=self.user1, following=self.user2)

    def test_create_following(self):
        """Test following creation."""
        self.assertEqual(self.following.follower, self.user1)
        self.assertEqual(self.following.following, self.user2)

    def test_cannot_follow_self(self):
        """Test user cannot follow themselves."""
        with self.assertRaises(ValidationError):
            following = Following(follower=self.user1, following=self.user1)
            following.clean()

    def test_following_unique_constraint(self):
        """Test user can only follow another user once."""
        with self.assertRaises(Exception):
            Following.objects.create(follower=self.user1, following=self.user2)


class SavedModelTestCase(TestCase):
    """Test cases for Saved model."""
    
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='test')
        self.post = Post.objects.create(user=self.user, post='Test')
        self.saved = Saved.objects.create(user=self.user, post=self.post)

    def test_create_saved(self):
        """Test saved post creation."""
        self.assertEqual(self.saved.user, self.user)
        self.assertEqual(self.saved.post, self.post)

    def test_saved_unique_constraint(self):
        """Test user can only save a post once."""
        with self.assertRaises(Exception):
            Saved.objects.create(user=self.user, post=self.post)
