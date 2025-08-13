from django.urls import path
from .views import CreateUserView, RetrieveCurrentUserView


urlpatterns = [
    path("register/", CreateUserView.as_view(), name="register"),
    path("me/", RetrieveCurrentUserView.as_view(), name="get_current_user"),
]
