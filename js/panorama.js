/**
 * PANORAMA ENGINE - panorama.js
 * Quản lý Pannellum viewer và panorama experience
 */

import { getPOIById, getSceneById, getAlleyBySceneId } from './data.js';
import { setState, getState, subscribe } from './state.js';
import { createNavigationHotspots, setLoadSceneCallback, handleKeyboardNavigation } from './navigation.js';
import { openModal } from './ui.js';

// ===========================================
// MODULE STATE
// ===========================================
let viewer = null;
let currentAlleyConfig = null;

// ===========================================
// DOM ELEMENTS
// ===========================================
const getElements = () => ({
    overlay: document.getElementById('panorama-overlay'),
    container: document.getElementById('panorama-container'),
    loading: document.getElementById('panorama-loading'),
    closeBtn: document.getElementById('panorama-close'),
    sceneInfo: document.getElementById('scene-info'),
    sceneName: document.getElementById('scene-name')
});

// ===========================================
// INITIALIZATION
// ===========================================

/**
 * Khởi tạo panorama engine
 */
export function initPanorama() {
    const elements = getElements();
    
    // Close button event
    if (elements.closeBtn) {
        elements.closeBtn.addEventListener('click', closePanorama);
    }
    
    // Click outside to close (optional)
    if (elements.overlay) {
        elements.overlay.addEventListener('click', (e) => {
            if (e.target === elements.overlay) {
                // Không đóng khi click vào panorama
            }
        });
    }
    
    // Keyboard events
    document.addEventListener('keydown', handleKeydown);
    
    // Set callback cho navigation
    setLoadSceneCallback(loadScene);
    
    console.log('✅ Panorama engine initialized');
}

/**
 * Xử lý keyboard events
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeydown(event) {
    if (!getState('isPanoramaOpen')) return;
    
    // ESC để đóng panorama
    if (event.key === 'Escape') {
        if (getState('isModalOpen')) {
            // Modal đang mở, để ui.js xử lý
            return;
        }
        closePanorama();
        event.preventDefault();
        return;
    }
    
    // Navigation keys
    handleKeyboardNavigation(event);
}

// ===========================================
// PANORAMA CONFIGURATION
// ===========================================

/**
 * Build Pannellum config từ alley data
 * @param {Object} alley - Alley object
 * @param {string} initialSceneId - Scene ID ban đầu
 * @returns {Object} Pannellum config
 */
function buildPannellumConfig(alley, initialSceneId) {
    const scenes = {};
    
    alley.scenes.forEach(scene => {
        scenes[scene.sceneId] = {
            type: 'equirectangular',
            panorama: scene.panorama,
            northOffset: scene.northOffset || 0,
            autoLoad: true,
            autoRotate: -2,
            autoRotateInactivityDelay: 5000,
            showControls: true,
            compass: false,
            hfov: 110,
            minHfov: 50,
            maxHfov: 120,
            hotSpots: buildHotspots(scene)
        };
    });
    
    return {
        default: {
            firstScene: initialSceneId,
            sceneFadeDuration: 1000,
            autoLoad: true
        },
        scenes: scenes
    };
}

/**
 * Build hotspots cho một scene
 * @param {Object} scene - Scene object
 * @returns {Array} Array of hotspot configs
 */
function buildHotspots(scene) {
    const hotspots = [];
    
    // Navigation hotspots (arrows)
    const navHotspots = createNavigationHotspots(scene);
    hotspots.push(...navHotspots);
    
    // POI hotspots
    if (scene.hotspots && scene.hotspots.length > 0) {
        scene.hotspots.forEach(hotspot => {
            const poi = getPOIById(hotspot.poiId);
            if (poi) {
                hotspots.push({
                    pitch: hotspot.pitch,
                    yaw: hotspot.yaw,
                    type: 'custom',
                    cssClass: 'poi-hotspot',
                    createTooltipFunc: createPOITooltip,
                    createTooltipArgs: poi,
                    clickHandlerFunc: () => handlePOIHotspotClick(poi)
                });
            }
        });
    }
    
    return hotspots;
}

/**
 * Tạo tooltip cho POI hotspot
 * @param {HTMLElement} hotSpotDiv - Hotspot container
 * @param {Object} poi - POI object
 */
function createPOITooltip(hotSpotDiv, poi) {
    const tooltipEl = document.createElement('div');
    tooltipEl.className = 'poi-hotspot-inner';
    tooltipEl.innerHTML = `
        <div class="poi-hotspot-pin"></div>
        <div class="poi-hotspot-tooltip">
            <span class="poi-hotspot-name">${poi.name}</span>
        </div>
    `;
    
    hotSpotDiv.appendChild(tooltipEl);
    
    // Hover effect
    hotSpotDiv.addEventListener('mouseenter', () => {
        tooltipEl.classList.add('poi-hotspot-inner--hover');
    });
    
    hotSpotDiv.addEventListener('mouseleave', () => {
        tooltipEl.classList.remove('poi-hotspot-inner--hover');
    });
}

/**
 * Xử lý click POI hotspot
 * @param {Object} poi - POI object
 */
function handlePOIHotspotClick(poi) {
    setState('currentPOI', poi);
    openModal(poi);
}

// ===========================================
// PANORAMA CONTROLS
// ===========================================

/**
 * Mở panorama viewer
 * @param {Object} alley - Alley object
 * @param {string} sceneId - Scene ID to start
 */
export function openPanorama(alley, sceneId) {
    const elements = getElements();
    
    if (!elements.overlay || !elements.container) {
        console.error('Panorama elements not found');
        return;
    }
    
    // Update state
    setState('isPanoramaOpen', true);
    setState('currentAlley', alley);
    setState('currentScene', sceneId);
    
    // Store config
    currentAlleyConfig = alley;
    
    // Show overlay
    elements.overlay.classList.remove('hidden');
    elements.overlay.classList.add('fade-in');
    
    // Show loading
    if (elements.loading) {
        elements.loading.classList.remove('hidden');
    }
    
    // Update scene info
    updateSceneInfo(sceneId);
    
    // Build config
    const config = buildPannellumConfig(alley, sceneId);
    
    // Destroy existing viewer if any
    if (viewer) {
        viewer.destroy();
        viewer = null;
    }
    
    // Create new viewer
    try {
        viewer = window.pannellum.viewer(elements.container, config);
        
        // Events
        viewer.on('load', () => {
            // Hide loading
            if (elements.loading) {
                elements.loading.classList.add('hidden');
            }
        });
        
        viewer.on('scenechange', (newSceneId) => {
            setState('currentScene', newSceneId);
            updateSceneInfo(newSceneId);
        });
        
        viewer.on('error', (err) => {
            console.error('Pannellum error:', err);
            // Show error message
            if (elements.loading) {
                elements.loading.innerHTML = `
                    <div class="error-message">
                        <p>⚠️ Không thể tải panorama</p>
                        <p>Vui lòng thử lại sau</p>
                    </div>
                `;
            }
        });
        
    } catch (error) {
        console.error('Error creating panorama viewer:', error);
    }
}

/**
 * Đóng panorama viewer
 */
export function closePanorama() {
    const elements = getElements();
    
    if (!elements.overlay) return;
    
    // Fade out animation
    elements.overlay.classList.remove('fade-in');
    elements.overlay.classList.add('fade-out');
    
    setTimeout(() => {
        // Destroy viewer
        if (viewer) {
            viewer.destroy();
            viewer = null;
        }
        
        // Hide overlay
        elements.overlay.classList.add('hidden');
        elements.overlay.classList.remove('fade-out');
        
        // Reset loading
        if (elements.loading) {
            elements.loading.classList.remove('hidden');
            elements.loading.innerHTML = `
                <div class="spinner"></div>
                <p>Đang tải panorama...</p>
            `;
        }
        
        // Update state
        setState('isPanoramaOpen', false);
        setState('currentScene', null);
        setState('currentAlley', null);
        
        currentAlleyConfig = null;
        
    }, 300);
}

/**
 * Load một scene cụ thể
 * @param {string} sceneId - Scene ID
 */
export function loadScene(sceneId) {
    if (viewer) {
        viewer.loadScene(sceneId);
        setState('currentScene', sceneId);
        updateSceneInfo(sceneId);
    }
}

/**
 * Update scene info display
 * @param {string} sceneId - Scene ID
 */
function updateSceneInfo(sceneId) {
    const elements = getElements();
    const scene = getSceneById(sceneId);
    
    if (elements.sceneName && scene) {
        elements.sceneName.textContent = scene.sceneName || '';
    }
}

// ===========================================
// PUBLIC API
// ===========================================

/**
 * Get Pannellum viewer instance
 * @returns {Object} Pannellum viewer
 */
export function getViewer() {
    return viewer;
}

/**
 * Check if panorama is open
 * @returns {boolean} True if open
 */
export function isPanoramaOpen() {
    return getState('isPanoramaOpen');
}

/**
 * Get current scene ID
 * @returns {string} Current scene ID
 */
export function getCurrentSceneId() {
    return getState('currentScene');
}
