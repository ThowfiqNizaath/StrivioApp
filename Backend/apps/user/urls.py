from django.urls import path
from .views import RegisterView, LoginView, UserAuthentication, CookieTokenRefreshView, LogoutView

urlpatterns = [
    path('signup/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('user/', UserAuthentication.as_view()),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),  # replaced
    path('logout/', LogoutView.as_view(), name='logout'),  # new
]
