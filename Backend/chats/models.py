from django.db import models
from accounts.models import User


class ChatManager(models.Manager):
    def get_or_create_chat(self, user1, user2):
        users = sorted([user1, user2], key=lambda u: u.id)
        chats = self.filter(participants=users[0]).filter(participants=users[1])
        if chats.exists():
            return chats.first(), False
        
        chat = self.create()
        chat.participants.set(users)
        return chat, True


class Chat(models.Model):
    participants = models.ManyToManyField(User, related_name="chats")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ChatManager()

    def __str__(self):
        return f"Chat with {", ".join([user.username for user in self.participants.all()])}"


class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    STATUS_CHOICES = [
        ("sent", "Sent"),
        ("delivered", "Delivered"),
        ("seen", "Seen"),
    ]

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="sent")

    def __str__(self):
        return f"{self.content} by {self.sender}"