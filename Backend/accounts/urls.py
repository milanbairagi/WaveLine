from django.urls import path
from .views import CreateUserView, RetrieveUserView


urlpatterns = [
    path("register/", CreateUserView.as_view(), name="register"),
    path("user/", RetrieveUserView.as_view(), name="get_user"),
]
