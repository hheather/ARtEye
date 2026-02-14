// Register custom A-Frame component for marker events
AFRAME.registerComponent('registerevents', {
    init: function () {
        const marker = this.el;
        const markerId = marker.getAttribute('id');
        
        // Marker found
        marker.addEventListener('markerFound', function() {
            console.log('Marker detected:', markerId);
            showInfoCard(markerId);
        });
        
        // Marker lost
        marker.addEventListener('markerLost', function() {
            console.log('Marker lost:', markerId);
            // Optionally close card when marker is lost
            // closeInfoCard();
        });
    }
});

// Hide loading screen after AR is initialized
window.addEventListener('load', function() {
    setTimeout(function() {
        const arSystem = document.querySelector('a-scene').systems.arjs;
        if (arSystem) {
            console.log('AR.js initialized');
        }
    }, 2000);
});
