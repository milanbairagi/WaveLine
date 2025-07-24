from django.contrib import admin

from .models import Chat, Message

class MessageAdmin(admin.ModelAdmin):
    list_display = ["chat", "sender", "content", "timestamp"]


class ChatAdmin(admin.ModelAdmin):
    list_display = ["participants_list", "created_at", "updated_at"]

    def participants_list(self, obj):
        return ", ".join([user.username for user in obj.participants.all()])


admin.site.register(Message, MessageAdmin)
admin.site.register(Chat, ChatAdmin)