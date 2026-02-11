/**
 * UI LAYER - ui.js
 * Quản lý UI components: sidebar, modal, filter, search
 */

import { POI_LIST, getPOIsByCategory, searchPOIs, findSceneContainingPOI, getCategoryLabel } from './data.js';
import { setState, getState, subscribe } from './state.js';
import { flyToMarker, filterMarkers } from './map.js';
import { loadScene, isPanoramaOpen } from './panorama.js';
import { renderStars, debounce, formatCategory, scrollIntoViewSmooth, escapeHTML } from './utils.js';

// ===========================================
// DOM ELEMENTS
// ===========================================
const getElements = () => ({
    poiList: document.getElementById('poi-list'),
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    filterTabs: document.querySelectorAll('.filter-tab'),
    modal: document.getElementById('poi-modal'),
    modalClose: document.getElementById('modal-close'),
    modalImage: document.getElementById('modal-image'),
    modalCategory: document.getElementById('modal-category'),
    modalName: document.getElementById('modal-name'),
    modalAlley: document.getElementById('modal-alley'),
    modalRating: document.getElementById('modal-rating'),
    modalDescription: document.getElementById('modal-description'),
    modalHoursText: document.getElementById('modal-hours-text'),
    modalCTA: document.getElementById('modal-cta')
});

// ===========================================
// INITIALIZATION
// ===========================================

/**
 * Khởi tạo UI components
 */
export function initUI() {
    const elements = getElements();
    
    // Render initial POI list
    renderPOIList(POI_LIST);
    
    // Setup search
    setupSearch(elements);
    
    // Setup filter tabs
    setupFilterTabs(elements);
    
    // Setup modal
    setupModal(elements);
    
    // Subscribe to state changes
    subscribeToState();
    
    console.log('✅ UI initialized');
}

// ===========================================
// POI LIST
// ===========================================

/**
 * Render danh sách POI
 * @param {Array} pois - Danh sách POI
 */
export function renderPOIList(pois) {
    const container = document.getElementById('poi-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (pois.length === 0) {
        container.innerHTML = `
            <div class="poi-list-empty">
                <span class="poi-list-empty__icon">🔍</span>
                <p>Không tìm thấy địa điểm nào</p>
            </div>
        `;
        return;
    }
    
    pois.forEach(poi => {
        const card = createPOICard(poi);
        container.appendChild(card);
    });
}

/**
 * Tạo POI card element
 * @param {Object} poi - POI object
 * @returns {HTMLElement} Card element
 */
function createPOICard(poi) {
    const card = document.createElement('div');
    card.className = 'poi-card';
    card.dataset.poiId = poi.id;
    
    const { emoji } = formatCategory(poi.category);
    
    card.innerHTML = `
        <div class="poi-card__image-wrapper">
            <img src="${escapeHTML(poi.image)}" alt="${escapeHTML(poi.name)}" class="poi-card__image" 
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23333%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2255%22 fill=%22%23666%22 text-anchor=%22middle%22 font-size=%2230%22>📷</text></svg>'">
            <span class="poi-card__category-badge">${emoji}</span>
        </div>
        <div class="poi-card__info">
            <h3 class="poi-card__name">${escapeHTML(poi.name)}</h3>
            <p class="poi-card__alley">
                <span class="alley-icon">📍</span>
                ${escapeHTML(poi.alleyName)}
            </p>
            <div class="poi-card__rating">${renderStars(poi.rating)}</div>
        </div>
    `;
    
    // Click event
    card.addEventListener('click', () => handlePOICardClick(poi));
    
    return card;
}

/**
 * Xử lý click POI card
 * @param {Object} poi - POI object
 */
function handlePOICardClick(poi) {
    // Update state
    setState('currentPOI', poi);
    
    // Fly to marker on map
    flyToMarker(poi.lat, poi.lng);
    
    // Nếu panorama đang mở → chuyển tới scene chứa POI
    if (isPanoramaOpen()) {
        const result = findSceneContainingPOI(poi.id);
        if (result) {
            // Check if same alley
            const currentAlley = getState('currentAlley');
            if (currentAlley && currentAlley.alleyId === result.alley.alleyId) {
                loadScene(result.scene.sceneId);
            }
        }
    }
}

/**
 * Highlight POI card trong list
 * @param {string} poiId - POI ID
 */
function highlightPOICard(poiId) {
    const container = document.getElementById('poi-list');
    if (!container) return;
    
    // Remove existing highlights
    container.querySelectorAll('.poi-card--active').forEach(card => {
        card.classList.remove('poi-card--active');
    });
    
    // Add highlight to current card
    if (poiId) {
        const card = container.querySelector(`[data-poi-id="${poiId}"]`);
        if (card) {
            card.classList.add('poi-card--active');
            scrollIntoViewSmooth(card, container);
        }
    }
}

// ===========================================
// SEARCH
// ===========================================

/**
 * Setup search functionality
 * @param {Object} elements - DOM elements
 */
function setupSearch(elements) {
    if (!elements.searchInput) return;
    
    // Debounced search
    const debouncedSearch = debounce((query) => {
        handleSearch(query);
    }, 300);
    
    elements.searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });
    
    // Search button click
    if (elements.searchBtn) {
        elements.searchBtn.addEventListener('click', () => {
            handleSearch(elements.searchInput.value);
        });
    }
    
    // Enter key
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch(elements.searchInput.value);
        }
    });
}

/**
 * Handle search
 * @param {string} query - Search query
 */
function handleSearch(query) {
    setState('searchQuery', query);
    
    // Clear filter if searching
    if (query.trim()) {
        setState('activeFilters', []);
        updateFilterTabsUI('all');
    }
    
    const results = searchPOIs(query);
    renderPOIList(results);
    filterMarkers(results);
}

// ===========================================
// FILTER TABS
// ===========================================

/**
 * Setup filter tabs
 * @param {Object} elements - DOM elements
 */
function setupFilterTabs(elements) {
    elements.filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            handleFilter(category);
            updateFilterTabsUI(category);
        });
    });
}

/**
 * Handle filter
 * @param {string} category - Category to filter
 */
function handleFilter(category) {
    // Clear search when filtering
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
        setState('searchQuery', '');
    }
    
    // Update state
    setState('activeFilters', category === 'all' ? [] : [category]);
    
    // Get filtered POIs
    const filtered = getPOIsByCategory(category);
    renderPOIList(filtered);
    filterMarkers(filtered);
}

/**
 * Update filter tabs UI
 * @param {string} activeCategory - Active category
 */
function updateFilterTabsUI(activeCategory) {
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        const isActive = tab.dataset.category === activeCategory;
        tab.classList.toggle('active', isActive);
    });
}

// ===========================================
// MODAL
// ===========================================

/**
 * Setup modal events
 * @param {Object} elements - DOM elements
 */
function setupModal(elements) {
    // Close button
    if (elements.modalClose) {
        elements.modalClose.addEventListener('click', closeModal);
    }
    
    // Click outside to close
    if (elements.modal) {
        elements.modal.addEventListener('click', (e) => {
            if (e.target === elements.modal) {
                closeModal();
            }
        });
    }
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && getState('isModalOpen')) {
            closeModal();
            e.preventDefault();
        }
    });
}

/**
 * Mở modal với thông tin POI
 * @param {Object} poi - POI object
 */
export function openModal(poi) {
    const elements = getElements();
    
    if (!elements.modal || !poi) return;
    
    // Update state
    setState('isModalOpen', true);
    
    // Populate modal content
    const { emoji, label } = formatCategory(poi.category);
    
    if (elements.modalImage) {
        elements.modalImage.src = poi.image;
        elements.modalImage.alt = poi.name;
    }
    
    if (elements.modalCategory) {
        elements.modalCategory.textContent = `${emoji} ${label}`;
        elements.modalCategory.className = `modal-card__category modal-card__category--${poi.category}`;
    }
    
    if (elements.modalName) {
        elements.modalName.textContent = poi.name;
    }
    
    if (elements.modalAlley) {
        elements.modalAlley.textContent = `📍 ${poi.alleyName}`;
    }
    
    if (elements.modalRating) {
        elements.modalRating.innerHTML = renderStars(poi.rating);
    }
    
    if (elements.modalDescription) {
        elements.modalDescription.textContent = poi.description;
    }
    
    if (elements.modalHoursText) {
        elements.modalHoursText.textContent = poi.openHours;
    }
    
    if (elements.modalCTA) {
        elements.modalCTA.href = poi.website360Link || '#';
        elements.modalCTA.style.display = poi.website360Link ? 'inline-block' : 'none';
    }
    
    // Show modal with animation
    elements.modal.classList.remove('hidden');
    elements.modal.classList.add('fade-in');
}

/**
 * Đóng modal
 */
export function closeModal() {
    const elements = getElements();
    
    if (!elements.modal) return;
    
    // Update state
    setState('isModalOpen', false);
    
    // Hide modal with animation
    elements.modal.classList.remove('fade-in');
    elements.modal.classList.add('fade-out');
    
    setTimeout(() => {
        elements.modal.classList.add('hidden');
        elements.modal.classList.remove('fade-out');
    }, 300);
}

// ===========================================
// STATE SUBSCRIPTIONS
// ===========================================

/**
 * Subscribe to state changes
 */
function subscribeToState() {
    // When currentPOI changes → highlight card
    subscribe('currentPOI', (poi) => {
        highlightPOICard(poi?.id);
    });
}
