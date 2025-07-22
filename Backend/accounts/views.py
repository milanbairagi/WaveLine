from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny

from .serializers import UserSerializer
from .models import User


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny,]