import jwt
import json
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth import get_user_model
from django.conf import settings

from chats.models import Chat, Message
from chats.serializers import MessageSerializer


@database_sync_to_async
def get_user_chat_ids(user):
    return list(Chat.objects.filter(participants=user).values_list('id', flat=True))

@database_sync_to_async
def create_message(chat_id, user, content):
    """create a message in the chat"""
    try:
        chat = Chat.objects.get(id=chat_id)
        message = Message.objects.create(chat=chat, sender=user, content=content)
        # Serialize the message to return
        serializer = MessageSerializer(message)
        return serializer.data
    except Chat.DoesNotExist:
        raise ValueError("Chat does not exist")
    except Exception as e:
        raise ValueError(f"An error occurred while creating the message: {e}")
    
@database_sync_to_async
def get_valid_messages_ids(chat_id, message_ids, receiver_id):
    """Fetch message IDs that belong to the chat and were not sent by the receiver."""
    return list(
        Message.objects.filter(
            id__in=message_ids,
            chat__id=chat_id
        ).exclude(sender__id=receiver_id)
        .values_list('id', flat=True))

@database_sync_to_async
def set_messages_seen(chat_id, message_ids):
    Message.objects.filter(id__in=message_ids, chat__id=chat_id).update(status="seen")


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.user = None
        self.joined_chats = set()
        self.chat_id = self.scope["url_route"]["kwargs"]["chat_id"]

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
                # Check if chat ID is valid
                if not self.chat_id:
                    await self.send(json.dumps({"type": "error", "detail": "Chat ID is required"}))
                    return

                # Check if current user is part of the chat
                if not self.chat_id.isdigit() or int(self.chat_id) not in chat_ids:
                    await self.send(json.dumps({"type": "error", "detail": "Access denied to chat"}))
                    return
                
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
            content = data.get("content")

            # Check if the user is part of the chat
            if f"chat_{chat_id}" not in self.joined_chats:
                await self.send(json.dumps({"type": "error", "detail": "Access denied to chat"}))
                return
            
            # Create message using serializer
            message_data = await create_message(chat_id, self.user, content)

            # If message creation failed, send an error
            if not message_data:
                await self.send(json.dumps({"type": "error", "detail": "Failed to create message"}))
                return
            
            # Broadcast the chat message to the group
            await self.channel_layer.group_send(
                f"chat_{chat_id}",
                {
                    "type": "chat_message",
                    "message_data": message_data,
                }
            )
            
        elif data.get("type") == "messages_seen":
            if not self.user:
                await self.send(json.dumps({"type": "error", "detail": "User not authenticated"}))
                return
            
            chat_id = data.get("chat_id")
            message_ids = data.get("message_ids", [])

            # Check if the user is part of the chat
            if f"chat_{chat_id}" not in self.joined_chats:
                await self.send(json.dumps({"type": "error", "detail": "Access denied to chat"}))
                return

            # Validate message IDs belong to the chat and were not sent by this user
            valid_message_ids = await get_valid_messages_ids(chat_id, message_ids, self.user.id)
            
            # Update message statuses to 'seen'
            await set_messages_seen(chat_id, valid_message_ids)

            # Notify other participants about the seen status
            await self.channel_layer.group_send(
                f"chat_{chat_id}",
                {
                    "type": "messages_seen",
                    "message_ids": valid_message_ids,
                    "user_id": self.user.id,
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
        message_data = event["message_data"]

        # Send the message to WebSocket
        await self.send(json.dumps({
            "type": "chat_message",
            "message": message_data
        }))
        
    async def messages_seen(self, event):
        message_ids = event["message_ids"]
        user_id = event["user_id"]

        # Send the seen update to WebSocket
        await self.send(json.dumps({
            "type": "messages_seen",
            "message_ids": message_ids,
            "user_id": user_id,
        }))