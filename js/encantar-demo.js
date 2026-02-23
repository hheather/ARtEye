let currentSession = null;
let selectedDeviceId = null;

window.onload = async function() {
    await populateCameraSelect();
    await initAR();
    
};

async function populateCameraSelect() {
    // Request permission to see device labels
    const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
    
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(d => d.kind === 'videoinput');

    // Try to find your continuity camera by name
    const continuityCam = cameras.find(c => c.label.includes('heather'));
    
    selectedDeviceId = continuityCam 
        ? continuityCam.deviceId 
        : cameras[0]?.deviceId;
    
    console.log(continuityCam);
    console.log('Using camera:', continuityCam?.label ?? 'default');
    
    // CRITICAL: Stop the temporary stream before starting AR
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
        {
            name: 'painting1',
            image: document.getElementById('painting1')
        },
        {
            name: 'painting2',
            image: document.getElementById('painting2')
        },
        {
            name: 'painting3',
            image: document.getElementById('painting3')
        },
        {
            name: 'painting4',
            image: document.getElementById('painting4')
        },
        {
            name: 'painting5',
            image: document.getElementById('painting5')
        },
    ]);

    // Listen for when a painting is detected
    tracker.addEventListener('targetfound', event => {
        const paintingName = event.referenceImage.name;
        console.log('Found painting:', paintingName);
        showInfoCard(paintingName); // Call your existing function
    });

    const viewport = AR.Viewport({
        container: document.getElementById('ar-viewport')
    });

    const videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
            deviceId: { exact: selectedDeviceId },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
        }
    });

    // Create a video element
    const video = document.createElement('video');
    video.setAttribute('playsinline', true);
    video.setAttribute('autoplay', true);
    video.muted = true;
    video.srcObject = videoStream;

    // Wait until metadata is loaded so dimensions are available
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
        stats: true,
        gizmos: true,
    });

    return session;
}