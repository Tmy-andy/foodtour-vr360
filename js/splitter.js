/**
 * SPLITTER MODULE - splitter.js
 * Xử lý drag divider để resize 2 panel (Panorama và Map)
 */

import { getMap } from './map.js';
import { getViewer } from './panorama.js';

// ===========================================
// MODULE STATE
// ===========================================
let splitContainer = null;
let divider = null;
let panelVR = null;
let panelMap = null;
let isDragging = false;
let isVertical = false; // true when on mobile (column layout)

// ===========================================
// INITIALIZATION
// ===========================================

/**
 * Khởi tạo splitter
 */
export function initSplitter() {
    splitContainer = document.getElementById('split-container');
    divider = document.getElementById('divider');
    panelVR = document.getElementById('panel-vr');
    panelMap = document.getElementById('panel-map');
    
    if (!splitContainer || !divider || !panelVR || !panelMap) {
        console.error('❌ Splitter: Missing required elements');
        return;
    }
    
    // Check if vertical layout (mobile)
    checkOrientation();
    
    // Add event listeners
    divider.addEventListener('mousedown', startDrag);
    divider.addEventListener('touchstart', startDrag, { passive: false });
    
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('touchmove', onDrag, { passive: false });
    
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
}

// ===========================================
// DRAG HANDLERS
// ===========================================

/**
 * Bắt đầu drag
 */
function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    document.body.classList.add('is-dragging');
}

/**
 * Xử lý khi đang drag
 */
function onDrag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const containerRect = splitContainer.getBoundingClientRect();
    
    if (isVertical) {
        // Vertical layout (mobile) - resize height
        const containerHeight = containerRect.height;
        const offsetY = clientY - containerRect.top;
        
        // Calculate percentage
        const vrPercent = (offsetY / containerHeight) * 100;
        const mapPercent = 100 - vrPercent;
        
        // Apply min constraints (20%)
        if (vrPercent >= 20 && vrPercent <= 80) {
            panelVR.style.flex = `0 0 ${vrPercent}%`;
            panelMap.style.flex = `0 0 ${mapPercent}%`;
        }
    } else {
        // Horizontal layout (desktop) - resize width
        const containerWidth = containerRect.width;
        const offsetX = clientX - containerRect.left;
        
        // Calculate percentage
        const vrPercent = (offsetX / containerWidth) * 100;
        const mapPercent = 100 - vrPercent;
        
        // Apply min constraints (20%)
        if (vrPercent >= 20 && vrPercent <= 80) {
            panelVR.style.flex = `0 0 ${vrPercent}%`;
            panelMap.style.flex = `0 0 ${mapPercent}%`;
        }
    }
}

/**
 * Dừng drag
 */
function stopDrag() {
    if (!isDragging) return;
    
    isDragging = false;
    document.body.classList.remove('is-dragging');
    
    // Notify Leaflet and Pannellum to re-render
    invalidateSizes();
}

// ===========================================
// RESIZE HANDLERS
// ===========================================

/**
 * Kiểm tra orientation (horizontal/vertical)
 */
function checkOrientation() {
    isVertical = window.innerWidth <= 768;
}

/**
 * Xử lý khi window resize
 */
function handleResize() {
    checkOrientation();
    invalidateSizes();
}

/**
 * Thông báo cho Leaflet và Pannellum re-render
 */
function invalidateSizes() {
    // Đợi một chút để CSS apply
    setTimeout(() => {
        // Invalidate Leaflet map
        const map = getMap();
        if (map) {
            map.invalidateSize();
        }
        
        // Resize Pannellum viewer
        const viewer = getViewer();
        if (viewer) {
            viewer.resize();
        }
    }, 100);
}

// ===========================================
// EXPORTS
// ===========================================

export { invalidateSizes };
