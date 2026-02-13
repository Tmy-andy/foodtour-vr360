/**
 * UTILITIES - utils.js
 * Helper functions dùng chung trong ứng dụng
 */

/**
 * Debounce function - Delay thực thi cho đến khi user ngừng gọi
 * @param {Function} fn - Function cần debounce
 * @param {number} delay - Delay time (ms)
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay = 300) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

/**
 * Throttle function - Giới hạn tần suất gọi function
 * @param {Function} fn - Function cần throttle
 * @param {number} limit - Thời gian tối thiểu giữa các lần gọi (ms)
 * @returns {Function} Throttled function
 */
export function throttle(fn, limit = 100) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Render rating stars từ số điểm
 * @param {number} rating - Số điểm (0-5)
 * @returns {string} HTML string của stars
 */
export function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = (rating - fullStars) >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
    
    let html = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        html += '<span class="star star--full">★</span>';
    }
    
    // Half star
    if (hasHalf) {
        html += '<span class="star star--half">★</span>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        html += '<span class="star star--empty">☆</span>';
    }
    
    html += `<span class="rating-number">(${rating})</span>`;
    
    return html;
}

/**
 * Escape HTML để tránh XSS
 * @param {string} str - String cần escape
 * @returns {string} Escaped string
 */
export function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Clamp số trong khoảng min-max
 * @param {number} value - Giá trị cần clamp
 * @param {number} min - Giá trị tối thiểu
 * @param {number} max - Giá trị tối đa
 * @returns {number} Giá trị đã clamp
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Generate unique ID
 * @param {string} prefix - Prefix cho ID
 * @returns {string} Unique ID
 */
export function generateId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format category thành emoji + text
 * @param {string} category - Category key
 * @returns {Object} Object với emoji và label
 */
export function formatCategory(category) {
    const categories = {
        food: { emoji: '🍜', label: 'Ẩm thực' },
        cafe: { emoji: '☕', label: 'Cafe' },
        art: { emoji: '🎨', label: 'Nghệ thuật' },
        hotel: { emoji: '🏨', label: 'Lưu trú' }
    };
    return categories[category] || { emoji: '📍', label: category };
}

/**
 * Scroll element vào view một cách mượt
 * @param {HTMLElement} element - Element cần scroll tới
 * @param {HTMLElement} container - Container chứa element
 */
export function scrollIntoViewSmooth(element, container) {
    if (!element || !container) return;
    
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    if (elementRect.top < containerRect.top || elementRect.bottom > containerRect.bottom) {
        element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
}

/**
 * Tạo SVG mũi tên điều hướng
 * @param {string} type - Loại mũi tên: forward, back, left, right
 * @returns {string} SVG string
 */
export function getArrowSVG(type) {
    // Tất cả mũi tên đều chỉ lên (forward và back đều rotation = 0)
    const rotations = {
        forward: 0,
        right: 90,
        back: 0,  // Mũi tên quay lại cũng chỉ lên giống forward
        left: 270
    };
    
    const rotation = rotations[type] || 0;
    
    return `
        <svg viewBox="0 0 64 64" width="80" height="80" style="transform: rotate(${rotation}deg)">
            <defs>
                <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#FFBE0B"/>
                    <stop offset="100%" style="stop-color:#FF006E"/>
                </linearGradient>
            </defs>
            <polygon 
                points="32,8 56,48 40,48 40,56 24,56 24,48 8,48" 
                fill="url(#arrowGrad)" 
                stroke="white" 
                stroke-width="2"
            />
        </svg>
    `;
}

/**
 * Wait/delay function
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise resolves after delay
 */
export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if element is visible in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if visible
 */
export function isInViewport(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Add class với animation support
 * @param {HTMLElement} element - Element
 * @param {string} className - Class to add
 */
export function addClass(element, className) {
    if (element) {
        element.classList.add(className);
    }
}

/**
 * Remove class với animation support
 * @param {HTMLElement} element - Element
 * @param {string} className - Class to remove
 */
export function removeClass(element, className) {
    if (element) {
        element.classList.remove(className);
    }
}

/**
 * Toggle class
 * @param {HTMLElement} element - Element
 * @param {string} className - Class to toggle
 * @param {boolean} force - Force add/remove
 */
export function toggleClass(element, className, force) {
    if (element) {
        element.classList.toggle(className, force);
    }
}
