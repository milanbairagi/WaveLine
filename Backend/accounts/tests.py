from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User


class AccountTest(APITestCase):
    def setUp(self):
        """Set up test data that's reused across multiple tests."""
        self.user_data = {"username": "person", "password": "person123"}
        self.create_user_url = reverse("user-list-create")
        self.token_url = reverse("token_obtain_pair")
        self.token_refresh_url = reverse("token_refresh")
        self.current_user_url = reverse("current_user")

    def _create_user(self):
        """Helper method to create a user and return the response."""
        response = self.client.post(self.create_user_url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        return response

    def _get_token(self):
        """Helper method to create user and get JWT token."""
        self._create_user()
        response = self.client.post(self.token_url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return (response.data["access"], response.data["refresh"])

    def test_create_account(self):
        """
        Ensure we can create a new account.
        """
        response = self.client.post(self.create_user_url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, "person")

    def test_create_account_duplicate_username(self):
        """
        Ensure we cannot create accounts with duplicate usernames.
        """
        # Create first user
        self._create_user()
        
        # Try to create second user with same username
        response = self.client.post(self.create_user_url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)

    def test_create_account_invalid_data(self):
        """
        Ensure account creation fails with invalid data.
        """
        invalid_data = {"username": "", "password": "123"}  # empty username
        response = self.client.post(self.create_user_url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)

    def test_get_token(self):
        """
        Ensure we can obtain a JWT token.
        """
        self._create_user()
        
        response = self.client.post(self.token_url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_refresh_token(self):
        """
        Ensure we can refresh JWT tokens.
        """
        _, refresh_token = self._get_token()
        response = self.client.post(self.token_refresh_url, {"refresh": refresh_token}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_get_token_invalid_credentials(self):
        """
        Ensure token request fails with invalid credentials.
        """
        self._create_user()
        
        invalid_data = {"username": "person", "password": "wrongpassword"}
        response = self.client.post(self.token_url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_current_user(self):
        """
        Ensure we can get current logged in user.
        """
        access_token, _ = self._get_token()
        
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
        response = self.client.get(self.current_user_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "person")

    def test_get_current_user_unauthorized(self):
        """
        Ensure current user endpoint requires authentication.
        """
        response = self.client.get(self.current_user_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_current_user_invalid_token(self):
        """
        Ensure current user endpoint fails with invalid token.
        """
        self.client.credentials(HTTP_AUTHORIZATION="Bearer invalid_token")
        response = self.client.get(self.current_user_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
