let currentSession = null;

async function startExperience() {
    document.getElementById('welcomeScreen').classList.add('hidden');
    await requestCameraPermission();
    await initAR();
}

async function requestCameraPermission() {
    // Request permission before starting AR
    const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
    tempStream.getTracks().forEach(track => track.stop());
}

async function initAR() {
    try {
        currentSession = await startARSession();

        function animate(time, frame) {
            currentSession.requestAnimationFrame(animate);
        }
        currentSession.requestAnimationFrame(animate);
    } catch(error) {
        alert(error.message);
    }
}

async function startARSession() {
    if(!AR.isSupported()) {
        throw new Error('This device is not compatible with this AR experience.');
    }

    const tracker = AR.Tracker.Image();
    await tracker.database.add([
        { name: 'painting1', image: document.getElementById('painting1') },
        { name: 'painting2', image: document.getElementById('painting2') },
        { name: 'painting3', image: document.getElementById('painting3') },
        { name: 'painting4', image: document.getElementById('painting4') },
        { name: 'painting5', image: document.getElementById('painting5') },
    ]);

    tracker.addEventListener('targetfound', event => {
        showInfoCard(event.referenceImage.name);
    });

    const viewport = AR.Viewport({
        container: document.getElementById('ar-viewport')
    });

    const videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
        }
    });

    const video = document.createElement('video');
    video.setAttribute('playsinline', true);
    video.setAttribute('autoplay', true);
    video.muted = true;
    video.srcObject = videoStream;

    await new Promise(resolve => {
        video.onloadedmetadata = () => {
            video.play();
            resolve();
        };
    });

    const source = AR.Source.Video(video);

    const session = await AR.startSession({
        mode: 'immersive',
        viewport: viewport,
        trackers: [tracker],
        sources: [source],
        // stats: true,
        gizmos: true,
    });

    return session;
}
