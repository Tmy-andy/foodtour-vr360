/**
 * SYNC MODULE - sync.js
 * Đồng bộ 2 chiều giữa Panorama 360° và Map 2D
 * - FOV Cone hiển thị hướng nhìn trên map (màu chủ đạo magenta)
 * - Scene Position Marker hiển thị vị trí đang đứng
 * - Realtime sync khi xoay/zoom panorama
 */

import { getMap } from './map.js';
import { getViewer, getCurrentScene, getCurrentAlley } from './panorama.js';
import { getState, setState, subscribe } from './state.js';
import { getSceneById, POI_LIST } from './data.js';

// ===========================================
// MODULE STATE
// ===========================================
let fovCone = null;           // L.polygon - FOV indicator
let sceneMarker = null;       // L.marker - Scene position
let syncAnimationId = null;   // requestAnimationFrame ID
let lastYaw = 0;
let lastHfov = 100;
let currentSceneLatLng = null; // Cache lat/lng của scene hiện tại

// FOV Cone config - Màu chủ đạo gradient (magenta → cyan)
const FOV_CONE_CONFIG = {
    fixedRadius: 53,           // Bán kính CỐ ĐỊNH (không đổi khi zoom) - 2/3 của 80
    fillColor: 'rgba(224, 64, 251, 0.25)',    // Magenta với độ trong suốt
    strokeColor: 'rgba(224, 64, 251, 0.8)',   // Magenta đậm hơn cho viền
    strokeWeight: 2,
    segments: 40               // Số đoạn để vẽ cung tròn mượt
};

// ===========================================
// INITIALIZATION
// ===========================================

/**
 * Khởi tạo sync module
 */
export function initSync() {
    console.log('🔄 Initializing Sync module...');
    
    // Subscribe to scene changes
    subscribe('currentScene', handleSceneChange);
    
    // Start sync loop after a short delay to ensure panorama is ready
    setTimeout(() => {
        startSyncLoop();
    }, 1000);
    
    console.log('✅ Sync module initialized');
}

// ===========================================
// FOV CONE - FIELD OF VIEW INDICATOR
// ===========================================

/**
 * Bán kính FOV Cone CỐ ĐỊNH - không thay đổi theo zoom
 * Chỉ có góc mở (fovDeg) thay đổi theo hfov của viewer
 */
function calculateConeRadius() {
    return FOV_CONE_CONFIG.fixedRadius;
}

/**
 * Tạo hoặc cập nhật FOV Cone trên map
 * @param {number} lat - Latitude tâm
 * @param {number} lng - Longitude tâm
 * @param {number} bearingDeg - Hướng nhìn (0=Bắc, 90=Đông, 180=Nam, 270=Tây)
 * @param {number} fovDeg - Góc mở ngang (horizontal field of view)
 * @param {number} radiusMeters - Bán kính cone (tính từ hfov)
 */
function updateFOVCone(lat, lng, bearingDeg, fovDeg, radiusMeters) {
    const map = getMap();
    if (!map) return;
    
    // Sử dụng radius được truyền vào (đã tính dựa trên hfov)
    const radius = radiusMeters || calculateConeRadius(fovDeg);
    
    // Tính các điểm của polygon hình quạt
    const points = calculateConePoints(lat, lng, bearingDeg, fovDeg, radius);
    
    if (fovCone) {
        // Cập nhật polygon đã tồn tại
        fovCone.setLatLngs(points);
    } else {
        // Tạo polygon mới với màu chủ đạo
        fovCone = window.L.polygon(points, {
            color: FOV_CONE_CONFIG.strokeColor,
            fillColor: FOV_CONE_CONFIG.fillColor,
            fillOpacity: 0.4,
            weight: FOV_CONE_CONFIG.strokeWeight,
            className: 'fov-cone-polygon'
        }).addTo(map);
    }
}

/**
 * Tính toán các điểm của hình quạt (sector)
 */
function calculateConePoints(lat, lng, bearingDeg, fovDeg, radiusMeters) {
    const points = [];
    
    // Điểm tâm (đỉnh quạt)
    points.push([lat, lng]);
    
    // Tính các điểm trên cung tròn
    const startAngle = bearingDeg - fovDeg / 2;
    const endAngle = bearingDeg + fovDeg / 2;
    const step = fovDeg / FOV_CONE_CONFIG.segments;
    
    for (let angle = startAngle; angle <= endAngle; angle += step) {
        const point = computeDestination(lat, lng, angle, radiusMeters);
        points.push(point);
    }
    
    // Đóng polygon về tâm
    points.push([lat, lng]);
    
    return points;
}

/**
 * Tính điểm đích từ điểm gốc theo bearing và khoảng cách
 * @param {number} lat - Latitude gốc
 * @param {number} lng - Longitude gốc
 * @param {number} bearingDeg - Hướng (độ)
 * @param {number} distanceMeters - Khoảng cách (mét)
 * @returns {Array} [lat, lng]
 */
function computeDestination(lat, lng, bearingDeg, distanceMeters) {
    const R = 6371000; // Bán kính Trái đất (meters)
    const bearing = bearingDeg * Math.PI / 180;
    const lat1 = lat * Math.PI / 180;
    const lng1 = lng * Math.PI / 180;
    const d = distanceMeters / R;
    
    const lat2 = Math.asin(
        Math.sin(lat1) * Math.cos(d) +
        Math.cos(lat1) * Math.sin(d) * Math.cos(bearing)
    );
    
    const lng2 = lng1 + Math.atan2(
        Math.sin(bearing) * Math.sin(d) * Math.cos(lat1),
        Math.cos(d) - Math.sin(lat1) * Math.sin(lat2)
    );
    
    return [lat2 * 180 / Math.PI, lng2 * 180 / Math.PI];
}

// ===========================================
// SCENE POSITION MARKER
// ===========================================

/**
 * Tạo hoặc cập nhật Scene Position Marker
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {boolean} animate - Có animation hay không
 */
function updateSceneMarker(lat, lng, animate = false) {
    const map = getMap();
    if (!map) return;
    
    if (sceneMarker) {
        if (animate) {
            // Animate marker di chuyển
            animateMarkerMove(sceneMarker, [lat, lng]);
        } else {
            sceneMarker.setLatLng([lat, lng]);
        }
    } else {
        // Tạo custom icon cho scene marker
        const sceneIcon = window.L.divIcon({
            className: 'scene-position-marker pulsing',
            iconSize: [24, 24],
            iconAnchor: [12, 12]  // Tâm icon = tâm FOV cone
        });
        
        sceneMarker = window.L.marker([lat, lng], {
            icon: sceneIcon,
            zIndexOffset: 1000
        }).addTo(map);
    }
}

/**
 * Animate marker di chuyển mượt
 */
function animateMarkerMove(marker, targetLatLng, duration = 500) {
    const start = marker.getLatLng();
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const lat = start.lat + (targetLatLng[0] - start.lat) * easeProgress;
        const lng = start.lng + (targetLatLng[1] - start.lng) * easeProgress;
        
        marker.setLatLng([lat, lng]);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

// ===========================================
// SYNC LOOP - REALTIME SYNC
// ===========================================

/**
 * Bắt đầu sync loop để đồng bộ realtime
 */
function startSyncLoop() {
    function syncFrame() {
        syncPanoramaToMap();
        syncAnimationId = requestAnimationFrame(syncFrame);
    }
    
    syncAnimationId = requestAnimationFrame(syncFrame);
}

/**
 * Dừng sync loop
 */
export function stopSyncLoop() {
    if (syncAnimationId) {
        cancelAnimationFrame(syncAnimationId);
        syncAnimationId = null;
    }
}

/**
 * Đồng bộ trạng thái panorama sang map
 */
function syncPanoramaToMap() {
    const viewer = getViewer();
    if (!viewer) return;
    
    try {
        const currentYaw = viewer.getYaw();
        const currentHfov = viewer.getHfov();
        
        // Chỉ update nếu có thay đổi đáng kể
        if (Math.abs(currentYaw - lastYaw) > 0.5 || Math.abs(currentHfov - lastHfov) > 0.5) {
            lastYaw = currentYaw;
            lastHfov = currentHfov;
            
            // Update state
            setState('currentYaw', currentYaw);
            setState('currentHfov', currentHfov);
            
            // Sử dụng cached lat/lng
            if (currentSceneLatLng) {
                // Lấy scene data để lấy northOffset
                const currentScene = getCurrentScene();
                const northOffset = currentScene?.northOffset || 0;
                
                // Tính bearing cho bản đồ:
                // - Pannellum: yaw=0 là hướng mặc định của ảnh panorama
                // - Map: bearing=0 là hướng Bắc
                // - northOffset: góc lệch giữa hướng mặc định panorama và hướng Bắc thực
                // Công thức: bearing = yaw + northOffset (đã normalize về 0-360)
                const bearing = ((currentYaw + northOffset) % 360 + 360) % 360;
                
                // Bán kính CỐ ĐỊNH, chỉ góc mở thay đổi theo hfov
                const radius = calculateConeRadius();
                
                // Update FOV Cone: góc mở = hfov, bán kính cố định
                updateFOVCone(
                    currentSceneLatLng.lat, 
                    currentSceneLatLng.lng, 
                    bearing, 
                    currentHfov,
                    radius
                );
            }
        }
    } catch (e) {
        // Viewer chưa sẵn sàng
    }
}

// ===========================================
// EVENT HANDLERS
// ===========================================

/**
 * Xử lý khi scene thay đổi
 * @param {Object} scene - Scene object mới
 */
function handleSceneChange(scene) {
    if (!scene) return;
    
    console.log('🔄 Sync: Scene changed to', scene.sceneId || scene);
    
    // Lấy lat/lng: từ scene, hoặc từ currentPOI, hoặc từ POI của alley
    let lat, lng;
    
    // Thử lấy từ scene data trước
    const sceneData = typeof scene === 'string' ? getSceneById(scene) : scene;
    
    if (sceneData && sceneData.lat && sceneData.lng) {
        lat = sceneData.lat;
        lng = sceneData.lng;
    } else {
        // Fallback 1: Lấy từ currentPOI trong state (POI đang được chọn)
        const currentPOI = getState('currentPOI');
        if (currentPOI && currentPOI.lat && currentPOI.lng) {
            lat = currentPOI.lat;
            lng = currentPOI.lng;
            console.log('🔄 Using currentPOI location:', currentPOI.name);
        } else {
            // Fallback 2: Lấy từ POI đầu tiên của alley hiện tại
            const currentAlley = getCurrentAlley();
            if (currentAlley) {
                const alleyPOI = POI_LIST.find(poi => poi.alleyId === currentAlley.alleyId);
                if (alleyPOI) {
                    lat = alleyPOI.lat;
                    lng = alleyPOI.lng;
                    console.log('🔄 Using alley first POI location:', alleyPOI.name);
                }
            }
        }
    }
    
    if (lat && lng) {
        // Cache lat/lng cho sync loop
        currentSceneLatLng = { lat, lng };
        
        // Update scene marker position
        updateSceneMarker(lat, lng, true);
        
        // Pan map to new position
        const map = getMap();
        if (map) {
            map.panTo([lat, lng], { animate: true, duration: 0.5 });
        }
        
        // Reset last values to force FOV update
        lastYaw = -999;
    }
}

/**
 * Đồng bộ từ Map sang Panorama
 * Khi click POI marker → chuyển scene chứa POI đó
 * @param {string} poiId - POI ID
 * @param {string} sceneId - Scene ID chứa POI
 */
export function syncMapToPanorama(poiId, sceneId) {
    const viewer = getViewer();
    if (!viewer || !sceneId) return;
    
    console.log('🔄 Sync: Map → Panorama, loading scene:', sceneId);
    
    try {
        viewer.loadScene(sceneId);
    } catch (e) {
        console.error('Failed to load scene:', e);
    }
}

// ===========================================
// CLEANUP
// ===========================================

/**
 * Dọn dẹp resources
 */
export function cleanup() {
    stopSyncLoop();
    
    const map = getMap();
    if (map) {
        if (fovCone) {
            map.removeLayer(fovCone);
            fovCone = null;
        }
        if (sceneMarker) {
            map.removeLayer(sceneMarker);
            sceneMarker = null;
        }
    }
}
