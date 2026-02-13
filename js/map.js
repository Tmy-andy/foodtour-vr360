/**
 * MAP ENGINE - map.js (V2 - Split Panel Layout)
 * Quản lý Leaflet map, markers và events
 * V2: Không còn mở panorama từ marker, panorama luôn hiện
 */

import { POI_LIST, getAlleyById, findSceneContainingPOI } from './data.js';
import { setState, getState, subscribe } from './state.js';
import { loadAlley } from './panorama.js';

// ===========================================
// MODULE STATE
// ===========================================
let map = null;
let markerClusterGroup = null;
const markers = new Map(); // Map of poiId -> marker

// ===========================================
// ICON FACTORY
// ===========================================

/**
 * Tạo custom icon từ icon name
 * @param {string} iconName - Icon name (bunbo, pho, banhmi, coffee, drink)
 * @param {boolean} isActive - Active state
 * @returns {L.Icon} Leaflet Icon
 */
function createPOIIcon(iconName, isActive = false) {
    const iconUrl = `assets/icons/${iconName}.png`;
    const iconSize = isActive ? [56, 56] : [48, 48];
    
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

// Tile layers
const TILE_LAYERS = {
    light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
};

let currentTileLayer = null;

/**
 * Khởi tạo Leaflet map
 */
export function initMap() {
    // Tạo map instance - V2: container nằm trong panel--map
    map = window.L.map('map-container', {
        center: [10.7685, 106.6940],  // TP.HCM - khu vực Phạm Ngũ Lão
        zoom: 17,
        zoomControl: true,
        doubleClickZoom: true,        // V2: Bật lại double-click zoom (không dùng cho panorama)
        scrollWheelZoom: true
    });
    
    // Thêm tile layer dựa trên theme hiện tại
    const isDarkMode = !document.body.classList.contains('light-mode');
    setMapTileLayer(isDarkMode ? 'dark' : 'light');
    
    // Tạo markers cho tất cả POI
    createMarkers();
    
    // Subscribe to state changes
    subscribeToState();
}

/**
 * Đổi tile layer của map
 * @param {string} theme - 'light' hoặc 'dark'
 */
export function setMapTileLayer(theme) {
    if (currentTileLayer) {
        map.removeLayer(currentTileLayer);
    }
    
    currentTileLayer = window.L.tileLayer(TILE_LAYERS[theme], {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);
}

/**
 * Tạo markers cho tất cả POI với clustering
 */
function createMarkers() {
    // Tạo marker cluster group với logic đơn giản
    markerClusterGroup = window.L.markerClusterGroup({
        maxClusterRadius: 60,           // Bán kính gom marker (pixels)
        spiderfyOnMaxZoom: false,       // KHÔNG tách marker - chỉ zoom
        showCoverageOnHover: false,     // Không hiện vùng phủ khi hover
        zoomToBoundsOnClick: true,      // Zoom vào khi click cluster
        disableClusteringAtZoom: 19,    // Tắt clustering ở zoom rất cao
        maxZoom: 18,                    // Zoom tối đa khi click cluster
        iconCreateFunction: function(cluster) {
            const count = cluster.getChildCount();
            let size = 'small';
            if (count > 10) size = 'large';
            else if (count > 5) size = 'medium';
            
            return window.L.divIcon({
                html: `<div class="cluster-icon cluster-icon--${size}"><span>${count}</span></div>`,
                className: 'marker-cluster-custom',
                iconSize: window.L.point(44, 44)
            });
        }
    });
    
    POI_LIST.forEach(poi => {
        const marker = window.L.marker([poi.lat, poi.lng], {
            icon: createPOIIcon(poi.icon)
        });
        
        // Lưu marker vào Map
        markers.set(poi.id, marker);
        
        // V2: Single click - active card + load alley vào panorama
        marker.on('click', () => {
            handleMarkerClick(poi);
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
        
        // Thêm marker vào cluster group
        markerClusterGroup.addLayer(marker);
    });
    
    // Thêm cluster group vào map
    map.addLayer(markerClusterGroup);
}

// ===========================================
// EVENT HANDLERS (V2 - Simplified)
// ===========================================

/**
 * V2: Xử lý click marker - active card + load alley vào panorama (luôn hiện)
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
    
    // Active card trong drawer và scroll đến card đó
    activatePOICard(poi.id);
    
    // V2: Load đúng scene chứa POI (không phải scene đầu tiên)
    const result = findSceneContainingPOI(poi.id);
    
    if (result) {
        const { alley, scene } = result;
        setState('currentAlley', alley);
        setState('currentScene', scene.sceneId);
        loadAlley(alley.alleyId, scene.sceneId);
    } else {
        // Fallback: load alley với scene đầu tiên nếu không tìm thấy hotspot
        const alley = getAlleyById(poi.alleyId);
        if (alley && alley.scenes.length > 0) {
            setState('currentAlley', alley);
            setState('currentScene', alley.scenes[0].sceneId);
            loadAlley(poi.alleyId, alley.scenes[0].sceneId);
        }
        }
    }

/**
 * Active POI card trong drawer và scroll đến nó (V2: drawer thay cho sidebar)
 * @param {string} poiId - POI ID
 */
function activatePOICard(poiId) {
    const container = document.getElementById('poi-list');
    if (!container) return;
    
    // Remove existing highlights
    container.querySelectorAll('.poi-card--active').forEach(card => {
        card.classList.remove('poi-card--active');
    });
    
    // Add highlight to current card
    const card = container.querySelector(`[data-poi-id="${poiId}"]`);
    if (card) {
        card.classList.add('poi-card--active');
        
        // Scroll đến card với smooth animation
        card.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
        });
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

// Lưu ID của POI đang được highlight
let activeHighlightId = null;

/**
 * Highlight marker được chọn
 * @param {string} activePoiId - ID của POI đang active
 */
function updateMarkerHighlight(activePoiId) {
    // Bỏ highlight marker cũ
    if (activeHighlightId) {
        const oldMarker = markers.get(activeHighlightId);
        if (oldMarker) {
            const oldIcon = oldMarker.getElement();
            if (oldIcon) {
                oldIcon.classList.remove('marker-icon--active');
            }
        }
    }
    
    // Thêm highlight marker mới
    if (activePoiId) {
        const newMarker = markers.get(activePoiId);
        if (newMarker) {
            const newIcon = newMarker.getElement();
            if (newIcon) {
                newIcon.classList.add('marker-icon--active');
            }
        }
    }
    
    activeHighlightId = activePoiId;
}

/**
 * Cập nhật visibility của markers theo filter
 * @param {Array} filters - Mảng category đang filter
 */
function updateMarkerVisibility(filters) {
    if (!markerClusterGroup) return;
    
    // Nếu filters là null/undefined, coi như không filter
    const activeFilters = filters || [];
    
    markerClusterGroup.clearLayers();
    
    markers.forEach((marker, poiId) => {
        const poi = POI_LIST.find(p => p.id === poiId);
        if (poi) {
            const shouldShow = activeFilters.length === 0 || activeFilters.includes(poi.category);
            if (shouldShow) {
                markerClusterGroup.addLayer(marker);
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
 * Highlight một marker cụ thể với animation mượt mà
 * @param {string} poiId - POI ID
 */
export function highlightMarker(poiId) {
    const marker = markers.get(poiId);
    if (marker) {
        // Đảm bảo marker được hiển thị (không bị cluster)
        if (markerClusterGroup && markerClusterGroup.hasLayer(marker)) {
            markerClusterGroup.zoomToShowLayer(marker, () => {
                setTimeout(() => {
                    const icon = marker.getElement();
                    if (icon) {
                        animateMarkerBounce(icon);
                    }
                }, 100);
            });
        } else {
            const icon = marker.getElement();
            if (icon) {
                animateMarkerBounce(icon);
            }
        }
    }
}

/**
 * Animation bounce đơn giản cho marker
 * @param {HTMLElement} icon - Icon element
 */
function animateMarkerBounce(icon) {
    const originalTransform = icon.style.transform;
    const duration = 300; // ms cho mỗi bounce
    let startTime = null;
    let bouncePhase = 0; // 0: lên, 1: xuống, 2: lên lần 2, 3: xuống cuối
    
    // Easing function (ease-out)
    function easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        let yOffset = 0;
        let scale = 1;
        
        switch(bouncePhase) {
            case 0: // Nhảy lên lần 1
                yOffset = -30 * easeOut(progress);
                scale = 1 + 0.1 * easeOut(progress);
                break;
            case 1: // Hạ xuống lần 1  
                yOffset = -30 * (1 - easeOut(progress));
                scale = 1.1 - 0.1 * easeOut(progress);
                break;
            case 2: // Nhảy lên lần 2 (thấp hơn)
                yOffset = -18 * easeOut(progress);
                scale = 1 + 0.05 * easeOut(progress);
                break;
            case 3: // Hạ xuống cuối
                yOffset = -18 * (1 - easeOut(progress));
                scale = 1.05 - 0.05 * easeOut(progress);
                break;
        }
        
        icon.style.transform = originalTransform + ` translateY(${yOffset}px) scale(${scale})`;
        
        if (progress >= 1) {
            bouncePhase++;
            if (bouncePhase < 4) {
                startTime = timestamp;
                requestAnimationFrame(animate);
            } else {
                // Animation xong, reset về gốc
                icon.style.transform = originalTransform;
            }
        } else {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

/**
 * Hiển thị tên quán dưới marker
 * @param {string} poiId - POI ID
 * @param {string} name - Tên quán
 */
export function showMarkerLabel(poiId, name) {
    const marker = markers.get(poiId);
    if (marker) {
        // Xóa label cũ nếu có
        const existingLabel = document.querySelector('.marker-label');
        if (existingLabel) {
            existingLabel.remove();
        }

        // Tạo label mới
        const label = document.createElement('div');
        label.className = 'marker-label';
        label.textContent = name;
        
        // Thêm vào marker container
        const icon = marker.getElement();
        if (icon) {
            icon.appendChild(label);
            
            // Auto hide sau 3 giây
            setTimeout(() => {
                if (label && label.parentNode) {
                    label.remove();
                }
            }, 3000);
        }
    }
}

/**
 * Reset tất cả markers về trạng thái mặc định
 */
export function resetMarkers() {
    markerClusterGroup.clearLayers();
    
    markers.forEach((marker, poiId) => {
        const poi = POI_LIST.find(p => p.id === poiId);
        if (poi) {
            marker.setIcon(createPOIIcon(poi.icon, false));
            markerClusterGroup.addLayer(marker);
        }
    });
}

/**
 * Filter markers theo danh sách POI
 * @param {Array} filteredPOIs - Danh sách POI đã filter
 */
export function filterMarkers(filteredPOIs) {
    const filteredIds = new Set(filteredPOIs.map(p => p.id));
    
    markerClusterGroup.clearLayers();
    
    markers.forEach((marker, poiId) => {
        if (filteredIds.has(poiId)) {
            markerClusterGroup.addLayer(marker);
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

export { activatePOICard };
