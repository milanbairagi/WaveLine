from django.urls import path
from . import views

urlpatterns = [
    path("", views.ChatListCreate.as_view(), name="list-chat"),
    path("<int:chat_id>/messages/", views.ChatMessageView.as_view(), name="list-message"),
]
