document.addEventListener('DOMContentLoaded', () => {
    // Timer target date: January 1, 2027, 00:00:00 (UTC+1)
	const targetDate = new Date(2027, 0, 1, 0, 0, 0).getTime();
	
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const countdownEl = document.getElementById('countdown');
    const launchMessageEl = document.getElementById('launch-message');

    // Update and format timer every second
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            if (countdownEl) countdownEl.style.display = 'none';
            if (launchMessageEl) launchMessageEl.style.display = 'block';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Email form submission handling
    const notifyForm = document.getElementById('notify-form');
    const feedbackEl = document.getElementById('form-feedback');

    if (notifyForm) {
        notifyForm.addEventListener('submit', async (e) => {
            const action = notifyForm.getAttribute('action') || '';

            // If action is not configured yet
            if (action.includes('jouw-email@gmail.com') || action.trim() === 'https://formsubmit.co/') {
                e.preventDefault();
                if (feedbackEl) {
                    feedbackEl.style.color = '#ff453a';
                    feedbackEl.textContent = "Vul eerst jouw eigen e-mailadres in de action van index.html in!";
                }
                return;
            }

            // Convert to Formsubmit AJAX endpoint
            let fetchUrl = action;
            if (action.includes('formsubmit.co/') && !action.includes('/ajax/')) {
                fetchUrl = action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
            }

            e.preventDefault();
            const formData = new FormData(notifyForm);

            try {
                const response = await fetch(fetchUrl, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                const data = await response.json().catch(() => ({}));

                if (response.ok && data.success !== "false") {
                    if (feedbackEl) {
                        feedbackEl.style.color = '#dea32b';
                        feedbackEl.textContent = "Bedankt! Je staat op de lijst. We laten van ons horen zodra de deuren openen.";
                    }
                    notifyForm.reset();
                } else {
                    if (feedbackEl) {
                        feedbackEl.style.color = '#ff453a';
                        feedbackEl.textContent = data.message || "Er is een fout opgetreden bij het verzenden.";
                    }
                }
            } catch (err) {
                // Fallback to normal form submit if fetch is blocked
                notifyForm.submit();
            }
        });
    }

    // Live year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
