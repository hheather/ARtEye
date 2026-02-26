let currentPainting = null;

// Show info card with painting data
function showInfoCard(markerId) {
    if (currentPainting) return; // targetfound fires every frame — only act once

    const data = paintingData[markerId];
    if (!data) {
        console.error('No data found for:', markerId);
        return;
    }

    currentPainting = data;
    
    document.getElementById('title').textContent = data.title;
    document.getElementById('artist').textContent = data.artist;
    document.getElementById('description').textContent = data.description;
    document.getElementById('paintingImage').src = data.image;

    // Defer reveal to next frame so content is committed before the slide-in begins
    requestAnimationFrame(() => {
        document.getElementById('scanOverlay').classList.add('hidden');
        document.getElementById('infoCard').classList.remove('hidden');
    });
}

// Close info card
function closeInfoCard() {
    document.getElementById('infoCard').classList.add('hidden');
    document.getElementById('scanOverlay').classList.remove('hidden');
    currentPainting = null;
}

// Navigate to form
function goToForm() {
    if (currentPainting) {
        window.location.href = currentPainting.formUrl;
    }
}