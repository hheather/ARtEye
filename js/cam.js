let currentStream = null;

// Enumerate available cameras
async function getCameras() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    
    const select = document.getElementById('cameraSelect');
    select.innerHTML = '';
    
    videoDevices.forEach(device => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Camera ${select.length + 1}`;
        select.appendChild(option);
    });
    
    return videoDevices;
}

// Switch to selected camera
async function switchCamera() {
    const select = document.getElementById('cameraSelect');
    const deviceId = select.value;
    
    // Stop current stream
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
    
    // Get new stream with selected camera
    const constraints = {
        video: {
            deviceId: deviceId ? { exact: deviceId } : undefined,
            facingMode: 'environment'
        }
    };
    
    try {
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Update AR.js video source
        const videoElement = document.querySelector('video');
        if (videoElement) {
            videoElement.srcObject = currentStream;
        }
    } catch (error) {
        console.error('Error switching camera:', error);
    }
}

// Initialize on page load
window.addEventListener('load', async () => {
    // Request camera permission first
    await navigator.mediaDevices.getUserMedia({ video: true });
    
    // Then enumerate cameras
    await getCameras();
});
