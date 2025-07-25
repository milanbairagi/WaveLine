import jwt
import json
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth import get_user_model
from django.conf import settings

from chats.models import Chat

@database_sync_to_async
def get_user_chat_ids(user):
    return list(Chat.objects.filter(participants=user).values_list('id', flat=True))


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.user = None
        self.joined_chats = set()
    
    async def receive(self, text_data):
        data = json.loads(text_data)

        if data.get("type") == "auth":
            token = data.get("token")
            
            try:
                UntypedToken(token)
                decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = decoded.get("user_id")
                self.user = await database_sync_to_async(get_user_model().objects.get)(id=user_id)
                if not self.user or isinstance(self.user, AnonymousUser):
                    raise InvalidToken("User not found or not authenticated.")
                
                chat_ids = await get_user_chat_ids(self.user)
                for chat_id in chat_ids:
                    group_name = f"chat_{chat_id}"
                    self.joined_chats.add(group_name)
                    await self.channel_layer.group_add(
                        group_name,
                        self.channel_name
                    )
                
                await self.send(json.dumps({"status": "authenticated", "user_id": user_id}))

            except (jwt.DecodeError, jwt.ExpiredSignatureError):
                await self.send(json.dumps({"type": "error", "detail": "Invalid token"}))
                await self.close()

            except (InvalidToken, TokenError):
                await self.send(json.dumps({"type": "error", "detail": "Unauthorized"}))
                await self.close()

        elif data.get("type") == "chat_message":
            if not self.user:
                await self.send(json.dumps({"type": "error", "detail": "User not authenticated"}))
                return
            
            chat_id = data.get("chat_id")
            message = data.get("message")

            if f"chat_{chat_id}" not in self.joined_chats:
                await self.send(json.dumps({"type": "error", "detail": "Access denied to chat"}))
                return

            # Broadcast the chat message to the group
            await self.channel_layer.group_send(
                f"chat_{chat_id}",
                {
                    "type": "chat.message",
                    "message": message,
                    "user": self.user.username
                }
            )

    async def disconnect(self, close_code):
        for chat_id in self.joined_chats:
            await self.channel_layer.group_discard(
                chat_id,
                self.channel_name
            )
        self.joined_chats.clear()
        self.user = None

    async def chat_message(self, event):
        message = event["message"]
        sender = event["user"]

        # Send the message to WebSocket
        await self.send(json.dumps({
            "type": "chat_message",
            "message": message,
            "sender": sender
        }))