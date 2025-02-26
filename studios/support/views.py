from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .forms import DonationForm
from .models import Donation

@login_required
def donate(request):
    if request.method == 'POST':
        form = DonationForm(request.POST)
        if form.is_valid():
            donation = form.save(commit=False)
            donation.donor = request.user  # Set the donor to the logged-in user
            donation.save()
            return redirect('donation_success')  # Redirect to a success page
    else:
        form = DonationForm()
    return render(request, 'myapp/donate.html', {'form': form})

def donation_success(request):
    return render(request, 'myapp/donation_success.html')