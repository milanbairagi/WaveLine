from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs["username"]
        password = attrs["password"]

        try:
            user = User.objects.get(username=username)
            if not user.check_password(password):
                raise serializers.ValidationError({"password": "Invalid password."})
        except User.DoesNotExist:
            raise serializers.ValidationError({"username": "User with the username does not exist."})

        if not user.is_active:
            raise serializers.ValidationError({"detail": "User account is inactive."})

        # If everything is fine, generate token using parent
        data = super().validate(attrs)
        return data
