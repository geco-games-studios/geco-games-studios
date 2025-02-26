from django.db import models
from .models import UserProfile

class Donation(models.Model):
    donor = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='donations')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    donation_date = models.DateTimeField(auto_now_add=True)
    message = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Donation of ${self.amount} by {self.donor.username}"