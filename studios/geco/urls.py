from django.urls import path
from .views import home  # Import the home view from the current app's views module

urlpatterns = [
    path('', home, name='home'),  # Map the root URL to the home view
]