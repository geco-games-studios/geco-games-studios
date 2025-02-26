from django.db import models
from django.contrib.auth.models import AbstractUser

class UserProfile(AbstractUser):
    phone_number = models.CharField(max_length=15, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    date_of_birth = models.DateField()
    city = models.CharField(max_length=100)
    town = models.CharField(max_length=100)
    residential_address_line_1 = models.CharField(max_length=255)
    residential_address_line_2 = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.username