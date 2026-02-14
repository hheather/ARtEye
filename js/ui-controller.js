let currentPainting = null;

// Show info card with painting data
function showInfoCard(markerId) {
    const data = paintingData[markerId];
    if (!data) return;
    
    currentPainting = data;
    
    // Update card content
    document.getElementById('paintingTitle').textContent = data.title;
    document.getElementById('paintingArtist').textContent = data.artist;
    document.getElementById('paintingDescription').textContent = data.description;
    document.getElementById('paintingImage').src = data.image;
    
    // Show card
    const card = document.getElementById('infoCard');
    card.classList.remove('hidden');
    
    // Hide loading screen
    document.getElementById('loadingScreen').style.display = 'none';
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