from rest_framework.permissions import BasePermission
from rest_framework.exceptions import ValidationError

class IsParticipationOfChat(BasePermission):

    def has_permission(self, request, view):
        user = request.user
        chat_id = view.kwargs.get("chat_id")
        if not chat_id:
            raise ValidationError({"chat_id": "This field is required!"})
        
        from .models import Chat
        
        try:
            chat = Chat.objects.get(id=chat_id)
        except Chat.DoesNotExist:
            raise ValidationError({"chat_id": "Chat with the id does not exist."})
        
        return user in chat.participants.all()

