from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import UserProfile

class UserProfileForm(UserCreationForm):
    phone_number = forms.CharField(max_length=15, required=True)
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    date_of_birth = forms.DateField(required=True, widget=forms.DateInput(attrs={'type': 'date'}))
    city = forms.CharField(max_length=100, required=True)
    town = forms.CharField(max_length=100, required=True)
    residential_address_line_1 = forms.CharField(max_length=255, required=True)
    residential_address_line_2 = forms.CharField(max_length=255, required=False)

    class Meta:
        model = UserProfile
        fields = ['username', 'phone_number', 'email', 'first_name', 'last_name', 'date_of_birth', 'city', 'town', 'residential_address_line_1', 'residential_address_line_2', 'password1', 'password2']