from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from .permissions import IsParticipationOfChat


class ChatListCreate(generics.ListCreateAPIView):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        chats = Chat.objects.filter(participants=self.request.user)
        return chats
    

class ChatMessageView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated, IsParticipationOfChat]

    def get_queryset(self):
        chat_id = self.kwargs.get("chat_id")
        messages = Message.objects.filter(chat__id=chat_id)
        return messages
    
    def perform_create(self, serializer):
        user = self.request.user
        chat_id = self.kwargs.get("chat_id")
        if not chat_id:
            raise ValidationError({"chat_id": "This field is required!"})
        
        try:
            chat = Chat.objects.get(id=chat_id)
        except Chat.DoesNotExist:
            raise ValidationError("The specified chat does not exist.")
        
        if user not in chat.participants.all():
            raise ValidationError("You are not a participant of this chat.")
        
        serializer.save(sender=user, chat=chat)
