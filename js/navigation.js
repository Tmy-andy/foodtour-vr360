/**
 * NAVIGATION SYSTEM - navigation.js
 * Quản lý mũi tên điều hướng trong panorama
 */

import { getState, subscribe } from './state.js';
import { getSceneById, getAlleyBySceneId } from './data.js';
import { getArrowSVG } from './utils.js';

// ===========================================
// MODULE STATE
// ===========================================
let loadSceneCallback = null;

// ===========================================
// INITIALIZATION
// ===========================================

/**
 * Khởi tạo navigation system
 */
export function initNavigation() {
    // Subscribe to scene changes
    subscribe('currentScene', (sceneId) => {
        if (sceneId && getState('isPanoramaOpen')) {
            // Navigation arrows được tạo bởi Pannellum hotspots
            // không cần render riêng ở đây
        }
    });
    
    console.log('✅ Navigation initialized');
}

/**
 * Set callback function để load scene
 * @param {Function} callback - Function loadScene từ panorama.js
 */
export function setLoadSceneCallback(callback) {
    loadSceneCallback = callback;
}

// ===========================================
// ARROW CREATION
// ===========================================

/**
 * Tạo navigation hotspots config cho Pannellum
 * @param {Object} scene - Scene object
 * @returns {Array} Array of hotspot configs
 */
export function createNavigationHotspots(scene) {
    if (!scene.links || scene.links.length === 0) {
        return [];
    }
    
    return scene.links.map(link => ({
        pitch: link.pitch,
        yaw: link.yaw,
        type: 'custom',
        cssClass: `nav-arrow nav-arrow--${link.type}`,
        createTooltipFunc: createArrowTooltip,
        createTooltipArgs: link,
        clickHandlerFunc: () => handleArrowClick(link.targetSceneId)
    }));
}

/**
 * Tạo tooltip element cho navigation arrow
 * @param {HTMLElement} hotSpotDiv - Hotspot container div
 * @param {Object} link - Link object chứa thông tin hướng
 */
function createArrowTooltip(hotSpotDiv, link) {
    // Tạo arrow element
    const arrowEl = document.createElement('div');
    arrowEl.className = `nav-arrow-inner nav-arrow-inner--${link.type}`;
    arrowEl.innerHTML = getArrowSVG(link.type);
    
    // Thêm label hướng
    const labels = {
        forward: 'Đi tiếp',
        back: 'Quay lại',
        left: 'Rẽ trái',
        right: 'Rẽ phải'
    };
    
    const labelEl = document.createElement('span');
    labelEl.className = 'nav-arrow-label';
    labelEl.textContent = labels[link.type] || '';
    
    arrowEl.appendChild(labelEl);
    hotSpotDiv.appendChild(arrowEl);
    
    // Add hover effect
    hotSpotDiv.addEventListener('mouseenter', () => {
        arrowEl.classList.add('nav-arrow-inner--hover');
    });
    
    hotSpotDiv.addEventListener('mouseleave', () => {
        arrowEl.classList.remove('nav-arrow-inner--hover');
    });
}

// ===========================================
// EVENT HANDLERS
// ===========================================

/**
 * Xử lý click vào navigation arrow
 * @param {string} targetSceneId - ID của scene đích
 */
function handleArrowClick(targetSceneId) {
    if (loadSceneCallback) {
        // Add transition effect
        const container = document.getElementById('panorama-container');
        if (container) {
            container.classList.add('scene-transition');
            
            setTimeout(() => {
                loadSceneCallback(targetSceneId);
                container.classList.remove('scene-transition');
            }, 300);
        } else {
            loadSceneCallback(targetSceneId);
        }
    }
}

/**
 * Navigate đến scene tiếp theo (forward)
 */
export function navigateForward() {
    const currentSceneId = getState('currentScene');
    const scene = getSceneById(currentSceneId);
    
    if (scene && scene.links) {
        const forwardLink = scene.links.find(l => l.type === 'forward');
        if (forwardLink) {
            handleArrowClick(forwardLink.targetSceneId);
        }
    }
}

/**
 * Navigate đến scene trước đó (back)
 */
export function navigateBack() {
    const currentSceneId = getState('currentScene');
    const scene = getSceneById(currentSceneId);
    
    if (scene && scene.links) {
        const backLink = scene.links.find(l => l.type === 'back');
        if (backLink) {
            handleArrowClick(backLink.targetSceneId);
        }
    }
}

// ===========================================
// KEYBOARD NAVIGATION
// ===========================================

/**
 * Xử lý keyboard navigation trong panorama
 * @param {KeyboardEvent} event - Keyboard event
 */
export function handleKeyboardNavigation(event) {
    if (!getState('isPanoramaOpen')) return;
    
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            navigateForward();
            event.preventDefault();
            break;
            
        case 'ArrowDown':
        case 's':
        case 'S':
            navigateBack();
            event.preventDefault();
            break;
            
        case 'ArrowLeft':
        case 'a':
        case 'A':
            navigateDirection('left');
            event.preventDefault();
            break;
            
        case 'ArrowRight':
        case 'd':
        case 'D':
            navigateDirection('right');
            event.preventDefault();
            break;
    }
}

/**
 * Navigate theo hướng cụ thể
 * @param {string} direction - Hướng: left, right
 */
function navigateDirection(direction) {
    const currentSceneId = getState('currentScene');
    const scene = getSceneById(currentSceneId);
    
    if (scene && scene.links) {
        const link = scene.links.find(l => l.type === direction);
        if (link) {
            handleArrowClick(link.targetSceneId);
        }
    }
}
