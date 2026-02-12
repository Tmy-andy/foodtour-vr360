/**
 * PANORAMA ENGINE V2 - panorama.js
 * Quản lý Pannellum viewer cho Split Panel Layout
 * - Panorama init ngay khi trang load (không cần trigger)
 * - Hiển thị trong panel-vr thay vì overlay
 * - Export getViewer() và getCurrentScene() cho sync.js
 */

import { getPOIById, getSceneById, getAlleyBySceneId, getAlleyById, ALLEY_LIST } from './data.js';
import { setState, getState, subscribe } from './state.js';
import { createNavigationHotspots, setLoadSceneCallback, handleKeyboardNavigation } from './navigation.js';
import { openModal } from './ui.js';

// ===========================================
// MODULE STATE
// ===========================================
let viewer = null;
let currentAlleyConfig = null;
let currentSceneData = null;

// ===========================================
// DOM ELEMENTS
// ===========================================
const getElements = () => ({
    container: document.getElementById('panorama-container'),
    loading: document.getElementById('panorama-loading'),
    sceneInfo: document.getElementById('scene-info'),
    sceneName: document.getElementById('scene-name'),
    poiInfo: document.getElementById('current-poi-info'),
    poiName: document.getElementById('current-poi-name')
});

// ===========================================
// INITIALIZATION
// ===========================================

/**
 * Khởi tạo panorama engine - Init ngay khi trang load
 */
export function initPanorama() {
    console.log('🎥 Initializing Panorama engine (V2 Split Panel)...');
    
    // Keyboard events
    document.addEventListener('keydown', handleKeydown);
    
    // Set callback cho navigation
    setLoadSceneCallback(loadScene);
    
    // Subscribe to currentPOI changes để hiển thị POI info
    subscribe('currentPOI', updateCurrentPOIInfo);
    
    // Auto-load scene đầu tiên của alley đầu tiên
    if (ALLEY_LIST && ALLEY_LIST.length > 0) {
        const firstAlley = ALLEY_LIST[0];
        if (firstAlley.scenes && firstAlley.scenes.length > 0) {
            const firstScene = firstAlley.scenes[0];
            console.log('📍 Auto-loading first scene:', firstScene.sceneId);
            
            // Short delay để DOM ready
            setTimeout(() => {
                initPanoramaViewer(firstAlley, firstScene.sceneId);
            }, 500);
        }
    }
    
    console.log('✅ Panorama engine initialized');
}

/**
 * Cập nhật POI info overlay khi chọn POI
 * @param {Object} poi - POI object
 */
function updateCurrentPOIInfo(poi) {
    const elements = getElements();
    
    if (!elements.poiInfo || !elements.poiName) return;
    
    if (poi && poi.name) {
        elements.poiName.textContent = poi.name;
        elements.poiInfo.classList.remove('hidden');
    } else {
        elements.poiInfo.classList.add('hidden');
    }
}

/**
 * Xử lý keyboard events
 */
function handleKeydown(event) {
    if (viewer) {
        handleKeyboardNavigation(event);
    }
}

// ===========================================
// PANORAMA CONFIGURATION
// ===========================================

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
            showControls: false,
            compass: false,
            hfov: 100,
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

function buildHotspots(scene) {
    const hotspots = [];
    
    const navHotspots = createNavigationHotspots(scene);
    hotspots.push(...navHotspots);
    
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

function createPOITooltip(hotSpotDiv, poi) {
    const tooltipEl = document.createElement('div');
    tooltipEl.className = 'poi-hotspot-inner';
    tooltipEl.innerHTML = '<div class="poi-hotspot-pin"></div><div class="poi-hotspot-tooltip"><span class="poi-hotspot-name">' + poi.name + '</span></div>';
    hotSpotDiv.appendChild(tooltipEl);
    
    hotSpotDiv.addEventListener('mouseenter', () => tooltipEl.classList.add('poi-hotspot-inner--hover'));
    hotSpotDiv.addEventListener('mouseleave', () => tooltipEl.classList.remove('poi-hotspot-inner--hover'));
}

function handlePOIHotspotClick(poi) {
    setState('currentPOI', poi);
    openModal(poi);
}

// ===========================================
// PANORAMA VIEWER INIT (V2)
// ===========================================

function initPanoramaViewer(alley, sceneId) {
    console.log('═══════════════════════════════════════════');
    console.log('🎥 [PANORAMA] LOADING VR:');
    console.log('   - Alley ID:', alley.alleyId);
    console.log('   - Alley Name:', alley.alleyName);
    console.log('   - Scene ID:', sceneId);
    console.log('   - Total scenes in alley:', alley.scenes.length);
    console.log('═══════════════════════════════════════════');
    
    const elements = getElements();
    
    if (!elements.container) {
        console.error('❌ Panorama container not found');
        return;
    }
    
    setState('currentAlley', alley);
    currentSceneData = alley.scenes.find(s => s.sceneId === sceneId);
    setState('currentScene', currentSceneData);
    currentAlleyConfig = alley;
    
    if (elements.loading) {
        elements.loading.classList.remove('hidden');
    }
    
    updateSceneInfo(sceneId);
    
    const config = buildPannellumConfig(alley, sceneId);
    
    if (viewer) {
        viewer.destroy();
        viewer = null;
    }
    
    try {
        viewer = window.pannellum.viewer(elements.container, config);
        
        viewer.on('load', () => {
            console.log('✅ [PANORAMA] VR Loaded successfully!');
            console.log('   - Current scene:', viewer.getScene());
            if (elements.loading) {
                elements.loading.classList.add('hidden');
            }
        });
        
        viewer.on('scenechange', (newSceneId) => {
            console.log('🔄 [PANORAMA] Scene changed to:', newSceneId);
            currentSceneData = getSceneById(newSceneId);
            setState('currentScene', currentSceneData);
            updateSceneInfo(newSceneId);
        });
        
        viewer.on('error', (err) => {
            console.error('❌ [PANORAMA] Pannellum error:', err);
        });
        
    } catch (error) {
        console.error('❌ [PANORAMA] Error creating viewer:', error);
    }
}

export function loadScene(sceneId) {
    if (viewer) {
        viewer.loadScene(sceneId);
        currentSceneData = getSceneById(sceneId);
        setState('currentScene', currentSceneData);
        updateSceneInfo(sceneId);
    }
}

export function switchToAlleyScene(alley, sceneId) {
    console.log('🔄 Switching to alley:', alley.alleyName, 'scene:', sceneId);
    initPanoramaViewer(alley, sceneId);
}

/**
 * Load alley vào panorama panel (V2 API)
 * @param {string} alleyId - ID của alley cần load
 * @param {string} sceneId - ID của scene đầu tiên (optional)
 */
export function loadAlley(alleyId, sceneId = null) {
    console.log('📥 [PANORAMA] loadAlley called with:', alleyId);
    
    const alley = getAlleyById(alleyId);
    if (!alley) {
        console.error('❌ [PANORAMA] Alley NOT FOUND in ALLEY_LIST:', alleyId);
        return;
    }
    
    const targetSceneId = sceneId || alley.scenes[0]?.sceneId;
    console.log('📍 [PANORAMA] Found alley:', alley.alleyName, '| Target scene:', targetSceneId);
    
    initPanoramaViewer(alley, targetSceneId);
}

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

export function getViewer() {
    return viewer;
}

export function getCurrentScene() {
    return currentSceneData;
}

export function getCurrentSceneId() {
    return currentSceneData ? currentSceneData.sceneId : null;
}

export function getCurrentAlley() {
    return currentAlleyConfig;
}
