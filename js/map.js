/**
 * MAP ENGINE - map.js
 * Quản lý Leaflet map, markers và events
 */

import { POI_LIST, getAlleyById } from './data.js';
import { setState, getState, subscribe } from './state.js';
import { openPanorama } from './panorama.js';

// ===========================================
// MODULE STATE
// ===========================================
let map = null;
const markers = new Map(); // Map of poiId -> marker

// ===========================================
// ICON FACTORY
// ===========================================

/**
 * Mapping category -> icon file
 * Sử dụng file PNG từ assets/icons/
 */
const CATEGORY_ICONS = {
    food: 'assets/icons/bunbo.png',
    cafe: 'assets/icons/coffee.png', 
    art: 'assets/icons/drink.png',
    hotel: 'assets/icons/fastfood.png'
};

const CATEGORY_COLORS = {
    food: '#FF006E',
    cafe: '#8338EC',
    art: '#3A86FF',
    hotel: '#FFBE0B'
};

/**
 * Tạo custom icon theo category sử dụng file PNG
 * @param {string} category - Category name
 * @param {boolean} isActive - Active state
 * @returns {L.Icon} Leaflet Icon
 */
function createCategoryIcon(category, isActive = false) {
    const iconUrl = CATEGORY_ICONS[category] || 'assets/icons/bunbo.png';
    const iconSize = isActive ? [44, 44] : [36, 36];
    
    return window.L.icon({
        iconUrl: iconUrl,
        iconSize: iconSize,
        iconAnchor: [iconSize[0] / 2, iconSize[1]],
        popupAnchor: [0, -iconSize[1]],
        className: isActive ? 'marker-icon marker-icon--active' : 'marker-icon'
    });
}

// ===========================================
// MAP INITIALIZATION
// ===========================================

/**
 * Khởi tạo Leaflet map
 */
export function initMap() {
    // Tạo map instance
    map = window.L.map('map-container', {
        center: [10.7685, 106.6940],  // TP.HCM - khu vực Phạm Ngũ Lão
        zoom: 17,
        zoomControl: true,
        doubleClickZoom: false,       // Tắt double-click zoom (dùng cho panorama)
        scrollWheelZoom: true
    });
    
    // Thêm tile layer - OpenStreetMap
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Tạo markers cho tất cả POI
    createMarkers();
    
    // Subscribe to state changes
    subscribeToState();
    
    console.log('✅ Map initialized');
}

/**
 * Tạo markers cho tất cả POI
 */
function createMarkers() {
    POI_LIST.forEach(poi => {
        const marker = window.L.marker([poi.lat, poi.lng], {
            icon: createCategoryIcon(poi.category)
        }).addTo(map);
        
        // Lưu marker vào Map
        markers.set(poi.id, marker);
        
        // Single click → zoom + highlight
        marker.on('click', () => {
            handleMarkerClick(poi);
        });
        
        // Double click → mở panorama
        marker.on('dblclick', () => {
            handleMarkerDoubleClick(poi);
        });
        
        // Hover effects
        marker.on('mouseover', () => {
            const icon = marker.getElement();
            if (icon) icon.classList.add('marker-hover');
        });
        
        marker.on('mouseout', () => {
            const icon = marker.getElement();
            if (icon) icon.classList.remove('marker-hover');
        });
    });
}

// ===========================================
// EVENT HANDLERS
// ===========================================

/**
 * Xử lý single click marker
 * @param {Object} poi - POI object
 */
function handleMarkerClick(poi) {
    // Fly to marker
    map.flyTo([poi.lat, poi.lng], 18, { duration: 0.5 });
    
    // Bounce animation
    const marker = markers.get(poi.id);
    if (marker) {
        const icon = marker.getElement();
        if (icon) {
            icon.classList.add('marker-bounce');
            setTimeout(() => icon.classList.remove('marker-bounce'), 500);
        }
    }
    
    // Update state
    setState('currentPOI', poi);
}

/**
 * Xử lý double click marker → mở panorama
 * @param {Object} poi - POI object
 */
function handleMarkerDoubleClick(poi) {
    const alley = getAlleyById(poi.alleyId);
    
    if (alley && alley.scenes.length > 0) {
        // Update state
        setState('currentAlley', alley);
        setState('currentScene', alley.scenes[0].sceneId);
        
        // Open panorama
        openPanorama(alley, alley.scenes[0].sceneId);
    } else {
        console.warn(`Không tìm thấy alley cho POI: ${poi.id}`);
    }
}

// ===========================================
// STATE SUBSCRIPTIONS
// ===========================================

/**
 * Subscribe to state changes
 */
function subscribeToState() {
    // Khi currentPOI thay đổi → highlight marker
    subscribe('currentPOI', (poi) => {
        updateMarkerHighlight(poi?.id);
    });
    
    // Khi activeFilters thay đổi → show/hide markers
    subscribe('activeFilters', (filters) => {
        updateMarkerVisibility(filters);
    });
}

/**
 * Highlight marker được chọn
 * @param {string} activePoiId - ID của POI đang active
 */
function updateMarkerHighlight(activePoiId) {
    markers.forEach((marker, poiId) => {
        const poi = POI_LIST.find(p => p.id === poiId);
        if (poi) {
            const isActive = poiId === activePoiId;
            marker.setIcon(createCategoryIcon(poi.category, isActive));
        }
    });
}

/**
 * Cập nhật visibility của markers theo filter
 * @param {Array} filters - Mảng category đang filter
 */
function updateMarkerVisibility(filters) {
    markers.forEach((marker, poiId) => {
        const poi = POI_LIST.find(p => p.id === poiId);
        if (poi) {
            const shouldShow = filters.length === 0 || filters.includes(poi.category);
            if (shouldShow) {
                marker.addTo(map);
            } else {
                marker.remove();
            }
        }
    });
}

// ===========================================
// PUBLIC API
// ===========================================

/**
 * Fly map tới vị trí marker
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} zoom - Zoom level (optional)
 */
export function flyToMarker(lat, lng, zoom = 18) {
    if (map) {
        map.flyTo([lat, lng], zoom, { duration: 0.5 });
    }
}

/**
 * Highlight một marker cụ thể
 * @param {string} poiId - POI ID
 */
export function highlightMarker(poiId) {
    const marker = markers.get(poiId);
    if (marker) {
        const icon = marker.getElement();
        if (icon) {
            icon.classList.add('marker-bounce');
            setTimeout(() => icon.classList.remove('marker-bounce'), 500);
        }
    }
}

/**
 * Reset tất cả markers về trạng thái mặc định
 */
export function resetMarkers() {
    markers.forEach((marker, poiId) => {
        const poi = POI_LIST.find(p => p.id === poiId);
        if (poi) {
            marker.setIcon(createCategoryIcon(poi.category, false));
            marker.addTo(map);
        }
    });
}

/**
 * Filter markers theo danh sách POI
 * @param {Array} filteredPOIs - Danh sách POI đã filter
 */
export function filterMarkers(filteredPOIs) {
    const filteredIds = new Set(filteredPOIs.map(p => p.id));
    
    markers.forEach((marker, poiId) => {
        if (filteredIds.has(poiId)) {
            marker.addTo(map);
        } else {
            marker.remove();
        }
    });
}

/**
 * Get map instance
 * @returns {L.Map} Leaflet map instance
 */
export function getMap() {
    return map;
}
