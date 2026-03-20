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
            
            // Short delay để DOM ready
            setTimeout(() => {
                initPanoramaViewer(firstAlley, firstScene.sceneId);
            }, 500);
        }
    }
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

/**
 * Tạo đường dẫn preview từ đường dẫn panorama gốc
 * Preview nằm trong subfolder "preview/" cùng thư mục
 */
function getPreviewPath(panoramaPath) {
    const parts = panoramaPath.split('/');
    const filename = parts.pop();
    return parts.join('/') + '/preview/' + filename;
}

function buildPannellumConfig(alley, initialSceneId) {
    const scenes = {};
    
    alley.scenes.forEach(scene => {
        // Tìm mũi tên forward để đặt hướng nhìn mặc định
        const forwardLink = scene.links ? scene.links.find(l => l.type === 'forward') : null;
        // Mặc định nhìn về hướng mũi tên tiến lên (forward) để ảnh liền mạch
        const defaultYaw = forwardLink ? forwardLink.yaw : 0;
        
        // Dùng preview nhỏ (~70KB) để load siêu nhanh ban đầu
        const previewPath = getPreviewPath(scene.panorama);
        
        scenes[scene.sceneId] = {
            type: 'equirectangular',
            panorama: previewPath,
            northOffset: scene.northOffset || 0,
            autoLoad: true,
            autoRotate: -2,
            autoRotateInactivityDelay: 5000,
            showControls: false,
            compass: false,
            yaw: defaultYaw,
            hfov: 100,
            minHfov: 50,
            maxHfov: 120,
            hotSpots: buildHotspots(scene),
            // Lưu đường dẫn bản full để swap sau
            _fullPanorama: scene.panorama
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
 * Preload ảnh full-res rồi swap vào viewer thay thế preview
 */
function upgradeToFullRes(sceneId, fullPanoramaPath) {
    const img = new Image();
    img.onload = () => {
        if (viewer && viewer.getScene() === sceneId) {
            // Pannellum không hỗ trợ swap ảnh trực tiếp,
            // nhưng ta preload sẵn để lần load sau (hoặc revisit) dùng cache
            // Cập nhật config để lần tới load scene này sẽ dùng bản full
            try {
                viewer.getConfig().scenes[sceneId].panorama = fullPanoramaPath;
            } catch (e) { /* ignore */ }
        }
    };
    img.src = fullPanoramaPath;
}

/**
 * Preload các scene kế tiếp để chuyển cảnh mượt hơn
 */
function preloadAdjacentScenes(sceneId) {
    const scene = getSceneById(sceneId);
    if (!scene || !scene.links) return;
    
    scene.links.forEach(link => {
        const targetScene = getSceneById(link.targetSceneId);
        if (targetScene) {
            // Preload cả preview và full của scene kế
            const previewImg = new Image();
            previewImg.src = getPreviewPath(targetScene.panorama);
            const fullImg = new Image();
            fullImg.src = targetScene.panorama;
        }
    });
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
    const elements = getElements();
    
    if (!elements.container) {
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
            if (elements.loading) {
                elements.loading.classList.add('hidden');
            }
            
            // Sau khi preview load xong, upgrade lên bản full-res
            const currentId = viewer.getScene();
            const sceneConfig = config.scenes[currentId];
            if (sceneConfig && sceneConfig._fullPanorama) {
                upgradeToFullRes(currentId, sceneConfig._fullPanorama);
            }
            
            // Preload ảnh các scene kế tiếp
            preloadAdjacentScenes(currentId);
        });
        
        viewer.on('scenechange', (newSceneId) => {
            currentSceneData = getSceneById(newSceneId);
            setState('currentScene', currentSceneData);
            updateSceneInfo(newSceneId);
            
            // Upgrade và preload cho scene mới
            const sceneConfig = config.scenes[newSceneId];
            if (sceneConfig && sceneConfig._fullPanorama) {
                upgradeToFullRes(newSceneId, sceneConfig._fullPanorama);
            }
            preloadAdjacentScenes(newSceneId);
        });
        
        // Khi người dùng tương tác (zoom, kéo), tắt auto-rotate để giữ nguyên trạng thái zoom
        viewer.on('mousedown', () => {
            viewer.stopAutoRotate();
        });
        
        viewer.on('touchstart', () => {
            viewer.stopAutoRotate();
        });
        
        // Khi người dùng zoom bằng scroll, tắt auto-rotate luôn
        if (elements.container) {
            elements.container.addEventListener('wheel', () => {
                if (viewer) {
                    viewer.stopAutoRotate();
                }
            }, { passive: true });
        }
        
        viewer.on('error', (err) => {
            console.error('Pannellum error:', err);
        });
        
    } catch (error) {
        console.error('Error creating viewer:', error);
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
    initPanoramaViewer(alley, sceneId);
}

/**
 * Load alley vào panorama panel (V2 API)
 * @param {string} alleyId - ID của alley cần load
 * @param {string} sceneId - ID của scene đầu tiên (optional)
 */
export function loadAlley(alleyId, sceneId = null) {
    const alley = getAlleyById(alleyId);
    if (!alley) {
        return;
    }
    
    const targetSceneId = sceneId || alley.scenes[0]?.sceneId;
    
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
