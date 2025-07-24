from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

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
        serializer.save(sender=user)
