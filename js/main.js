/**
 * MAIN ENTRY POINT - main.js
 * Bootstrap tất cả modules
 */

import { initMap } from './map.js';
import { initPanorama } from './panorama.js';
import { initUI } from './ui.js';
import { initNavigation } from './navigation.js';

/**
 * Khởi tạo ứng dụng
 */
function initApp() {
    console.log('🏮 Bản đồ Hẻm Sài Gòn - Initializing...');
    
    try {
        // 1. Initialize map (Leaflet)
        initMap();
        
        // 2. Initialize panorama engine (Pannellum)
        initPanorama();
        
        // 3. Initialize navigation system
        initNavigation();
        
        // 4. Initialize UI components
        initUI();
        
        console.log('✅ Bản đồ Hẻm TP.HCM — Ready!');
        console.log('💡 Double-click vào marker để mở panorama 360°');
        
    } catch (error) {
        console.error('❌ Error initializing app:', error);
    }
}

// Wait for DOM ready
document.addEventListener('DOMContentLoaded', initApp);
