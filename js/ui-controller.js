let currentPainting = null;

// Show info card with painting data
function showInfoCard(markerId) {
    const data = paintingData[markerId];
    if (!data) {
        console.error('No data found for:', markerId);
        return;
    }
    
    currentPainting = data;
    
    // Update card content - IDs match your HTML
    document.getElementById('title').textContent = data.title;
    document.getElementById('artist').textContent = data.artist;
    document.getElementById('description').textContent = data.description;
    document.getElementById('paintingImage').src = data.image; // FIXED: was 'image'
    
    // Show card
    const card = document.getElementById('infoCard');
    card.classList.remove('hidden');
}

// Close info card
function closeInfoCard() {
    document.getElementById('infoCard').classList.add('hidden');
    currentPainting = null;
}

// Navigate to form
function goToForm() {
    if (currentPainting) {
        window.location.href = currentPainting.formUrl;
    }
}