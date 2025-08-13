from django.urls import path
from .views import ListCreateUserView, RetrieveCurrentUserView


urlpatterns = [
    path("", ListCreateUserView.as_view(), name="user-list-create"),
    path("me/", RetrieveCurrentUserView.as_view(), name="current_user"),
]
