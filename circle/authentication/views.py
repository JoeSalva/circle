from .serializers import SignUpSerializer
from core.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny


class UserSignUpAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class =SignUpSerializer
    permission_classes = [AllowAny]