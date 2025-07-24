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

    def to_internal_value(self, data):
        participants = data.get("participants")
        if isinstance(participants, int):
            user_id = self.context["request"].user.id
            data["participants"] = [user_id, participants]
        return super().to_internal_value(data)

    def validate_participants(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Participants must be a list of user IDs.")
        if value[0] == value[1]:
            raise serializers.ValidationError("Participants must be different users.")
        if len(value) != 2:
            raise serializers.ValidationError("A chat must have exactly 2 participants.")
        return value
    
    def create(self, validated_data):
        participants_id = validated_data.pop("participants")
        chat, created = Chat.objects.get_or_create_chat(participants_id[0], participants_id[1])

        if not created:
            raise serializers.ValidationError("Chat already exists between these users.")
        return chat
    
    def update(self, instance, validated_data):
        # Prevent changing participants on update
        validated_data.pop("participants", None)
        return super().update(instance, validated_data)


class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = ["id", "chat", "sender", "content", "timestamp"]
        read_only_fields = ["id", "chat", "sender", "timestamp"]

