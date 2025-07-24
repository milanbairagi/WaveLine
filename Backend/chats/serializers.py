from rest_framework import serializers

from .models import Chat, Message
from accounts.models import User


class ParticipantsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class ChatSerializer(serializers.ModelSerializer):
    participants = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all(), write_only=True)
    participants_detail = ParticipantsSerializer(many=True, read_only=True, source="participants")

    class Meta:
        model = Chat
        fields = ["id", "participants", "participants_detail", "created_at", "updated_at"]

    def validate_participants(self, value):
        if len(value) != 2:
            raise serializers.ValidationError("A chat must have exactly 2 participants.")
        return value
    
    def create(self, validated_data):
        print(f"{validated_data=}")
        participants = validated_data.pop("participants")
        chat = Chat.objects.create(**validated_data)
        chat.participants.set(participants)
        return chat
    
    def update(self, instance, validated_data):
        # Prevent changing participants on update
        validated_data.pop("participants", None)
        return super().update(instance, validated_data)


class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = ["id", "chat", "sender", "content", "timestamp"]
        read_only_fields = ["id", "sender", "timestamp"]

