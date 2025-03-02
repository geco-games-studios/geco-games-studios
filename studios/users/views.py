from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import UserProfileForm

def register(request):
    if request.method == 'POST':
        form = UserProfileForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)  # Log the user in after registration
            return redirect('home')  # Redirect to the home page or another page
    else:
        form = UserProfileForm()
    return render(request, 'myapp/register.html', {'form': form})