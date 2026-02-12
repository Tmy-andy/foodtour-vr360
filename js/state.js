/**
 * STATE MANAGEMENT - state.js
 * Quản lý state tập trung với pub/sub pattern
 */

// ===========================================
// STATE OBJECT - Trạng thái ứng dụng (V2)
// ===========================================
const state = {
    currentPOI: null,           // POI object đang được chọn/highlight
    currentAlley: null,         // Alley object đang xem panorama
    currentScene: null,         // Scene object đang hiển thị trong panorama
    activeFilters: [],          // Mảng category đang filter: ["food", "cafe"]
    searchQuery: "",            // Từ khóa search hiện tại
    isModalOpen: false,         // Modal thông tin có đang mở hay không
    isDrawerOpen: false,        // Drawer (thay thế sidebar) có đang mở hay không
    currentYaw: 0,              // Yaw hiện tại từ panorama (dùng cho FOV Cone)
    currentHfov: 100,           // HFOV hiện tại từ panorama (dùng cho FOV Cone)
    theme: 'dark'               // Theme hiện tại: 'dark' hoặc 'light'
};

// ===========================================
// LISTENERS - Lưu trữ callbacks
// ===========================================
const listeners = {};

// ===========================================
// PUBLIC API
// ===========================================

/**
 * Subscribe: Module đăng ký lắng nghe thay đổi state
 * @param {string} key - State key cần lắng nghe
 * @param {Function} callback - Callback khi state thay đổi
 * @returns {Function} Unsubscribe function
 */
export function subscribe(key, callback) {
    if (!listeners[key]) {
        listeners[key] = [];
    }
    listeners[key].push(callback);
    
    // Trả về unsubscribe function
    return () => {
        const index = listeners[key].indexOf(callback);
        if (index > -1) {
            listeners[key].splice(index, 1);
        }
    };
}

/**
 * Set state và notify tất cả listeners
 * @param {string} key - State key
 * @param {*} value - Giá trị mới
 */
export function setState(key, value) {
    const oldValue = state[key];
    state[key] = value;
    
    // Notify listeners nếu giá trị thay đổi
    if (listeners[key]) {
        listeners[key].forEach(callback => {
            try {
                callback(value, oldValue);
            } catch (error) {
                console.error(`Error in state listener for "${key}":`, error);
            }
        });
    }
}

/**
 * Get state value
 * @param {string} key - State key
 * @returns {*} Giá trị state
 */
export function getState(key) {
    return state[key];
}

/**
 * Get toàn bộ state (read-only copy)
 * @returns {Object} Copy của state object
 */
export function getAllState() {
    return { ...state };
}

/**
 * Reset state về giá trị mặc định (V2)
 */
export function resetState() {
    setState('currentPOI', null);
    setState('currentAlley', null);
    setState('currentScene', null);
    setState('activeFilters', []);
    setState('searchQuery', '');
    setState('isModalOpen', false);
    setState('isDrawerOpen', false);
    setState('currentYaw', 0);
    setState('currentHfov', 100);
}

/**
 * Batch update nhiều state cùng lúc
 * @param {Object} updates - Object chứa các cặp key-value cần update
 */
export function batchSetState(updates) {
    Object.entries(updates).forEach(([key, value]) => {
        setState(key, value);
    });
}
