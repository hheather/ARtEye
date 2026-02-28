let currentSession = null;
let arStarted = false;

let currentVideoTrack = null;
let zoomLevel = 1;
let zoomMin = 1;
let zoomMax = 1;
let zoomStep = 0.5;

async function startExperience() {
    if (arStarted) return;
    arStarted = true;

    document.getElementById('welcomeScreen').classList.add('hidden');

    try {
        await requestCameraPermission();
        await initAR();
    } catch (error) {
        alert(error.message);
    }
}

async function requestCameraPermission() {
    const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
    tempStream.getTracks().forEach(track => track.stop());
}

async function initAR() {
    currentSession = await startARSession();
    initZoomControl();

    function animate(_time, _frame) {
        currentSession.requestAnimationFrame(animate);
    }
    currentSession.requestAnimationFrame(animate);
}

function initZoomControl() {
    const capabilities = currentVideoTrack?.getCapabilities?.();
    if (!capabilities?.zoom) {
        document.getElementById('zoomControl').hidden = true;
        return;
    }

    zoomMin = capabilities.zoom.min;
    zoomMax = capabilities.zoom.max;
    zoomStep = (zoomMax - zoomMin) / 10;
    zoomLevel = zoomMin;

    document.getElementById('zoomLevel').textContent = `${zoomLevel.toFixed(1)}×`;
}

function adjustZoom(direction) {
    zoomLevel = Math.max(zoomMin, Math.min(zoomMax, zoomLevel + direction * zoomStep));
    currentVideoTrack.applyConstraints({ advanced: [{ zoom: zoomLevel }] }).catch(() => {});
    document.getElementById('zoomLevel').textContent = `${zoomLevel.toFixed(1)}×`;
}

async function startARSession() {
    if (!AR.isSupported()) {
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

    currentVideoTrack = videoStream.getVideoTracks()[0];

    const video = document.createElement('video');
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');
    video.muted = true;
    video.srcObject = videoStream;

    try {
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(
                () => reject(new Error('Camera timed out.')),
                10000
            );
            video.onloadedmetadata = () => {
                clearTimeout(timeout);
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
            gizmos: true,
        });

        return session;
    } catch (error) {
        videoStream.getTracks().forEach(t => t.stop());
        throw error;
    }
}
