/**
 * MAIN ENTRY POINT - main.js (V2 - Split Panel Layout)
 * Bootstrap tất cả modules
 */

import { initMap, setMapTileLayer } from './map.js';
import { initPanorama } from './panorama.js';
import { initUI } from './ui.js';
import { initNavigation } from './navigation.js';
import { initSplitter } from './splitter.js';
import { initSync } from './sync.js';

/**
 * Khởi tạo ứng dụng
 */
function initApp() {
    try {
        // Make setMapTileLayer available globally
        window.setMapTileLayer = setMapTileLayer;
        
        // 1. Initialize map (Leaflet) - phải init trước để splitter có thể resize
        initMap();
        
        // 2. Initialize panorama engine (Pannellum) - V2: auto-load first scene
        initPanorama();
        
        // 3. Initialize splitter (drag divider between panels)
        initSplitter();
        
        // 4. Initialize sync engine (FOV cone + scene position marker)
        initSync();
        
        // 5. Initialize navigation system
        initNavigation();
        
        // 6. Initialize UI components
        initUI();
        
        // 7. Initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        console.log('✅ Hẻm Sài Gòn VR — Ready!');
        
    } catch (error) {
        console.error('❌ Error initializing app:', error);
    }
}

// Wait for DOM ready
document.addEventListener('DOMContentLoaded', initApp);
