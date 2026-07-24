from typing import Any, cast
from django.urls import re_path

from chats.consumers import ChatConsumer


websocket_urlpatterns = [
    # re_path(r'ws/chats/(?P<chat_id>\d+)/message/$', cast(Any, ChatConsumer.as_asgi())),
    re_path(r'ws/chats/message/$', ChatConsumer.as_asgi()),
]