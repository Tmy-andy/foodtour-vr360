/**
 * UI LAYER - ui.js (V2 - Split Panel Layout)
 * Quản lý UI components: POI drawer, modal, filter, search
 * V2: Thay sidebar bằng FAB + Bottom Drawer
 */

import { POI_LIST, getPOIsByCategory, searchPOIs, findSceneContainingPOI, getCategoryLabel, getAlleyById } from './data.js';
import { setState, getState, subscribe } from './state.js';
import { flyToMarker, filterMarkers, setMapTileLayer, highlightMarker, showMarkerLabel } from './map.js';
import { loadScene, loadAlley } from './panorama.js';
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
    
    // V2: Setup POI Drawer (FAB + Bottom Sheet)
    setupPOIDrawer();
    
    // V2: Setup Fullscreen buttons
    setupFullscreenButtons();
    
    // Setup theme toggle
    setupThemeToggle();
    
    // Subscribe to state changes
    subscribeToState();
    
    console.log('✅ UI initialized (V2)');
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
 * Lấy icon path từ POI icon field
 * @param {string} iconName - Icon name (bunbo, pho, banhmi, coffee, drink)
 * @returns {string} Icon path
 */
function getIconPath(iconName) {
    return `assets/icons/${iconName}.png`;
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
    
    const iconPath = getIconPath(poi.icon);
    
    card.innerHTML = `
        <div class="poi-card__image-wrapper">
            <img src="${escapeHTML(poi.image)}" alt="${escapeHTML(poi.name)}" class="poi-card__image" 
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23333%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2255%22 fill=%22%23666%22 text-anchor=%22middle%22 font-size=%2230%22>📷</text></svg>'">
            <span class="poi-card__category-badge">
                <img src="${iconPath}" alt="${poi.icon}" class="category-badge__icon">
            </span>
        </div>
        <div class="poi-card__info">
            <h3 class="poi-card__name">${escapeHTML(poi.name)}</h3>
            <p class="poi-card__alley">
                <i data-lucide="map-pin" class="alley-icon"></i>
                ${escapeHTML(poi.alleyName)}
            </p>
            <div class="poi-card__rating">${renderStars(poi.rating)}</div>
        </div>
    `;
    
    // Initialize Lucide icons for this card
    if (window.lucide) {
        window.lucide.createIcons({ nodes: [card] });
    }
    
    // Click event
    card.addEventListener('click', () => handlePOICardClick(poi));
    
    return card;
}

/**
 * Xử lý click POI card (V2)
 * @param {Object} poi - POI object
 */
function handlePOICardClick(poi) {
    console.log('POI card clicked (V2):', poi.name, poi.id);
    
    // Update state
    setState('currentPOI', poi);
    
    // Fly to marker on map
    flyToMarker(poi.lat, poi.lng);
    
    // Bounce marker và hiển thị tên
    setTimeout(() => {
        highlightMarker(poi.id);
        showMarkerLabel(poi.id, poi.name);
    }, 800);
    
    // V2: Load đúng scene chứa POI (không phải scene đầu tiên)
    const result = findSceneContainingPOI(poi.id);
    
    if (result) {
        const { alley, scene } = result;
        console.log('🎬 [UI] Found scene containing POI:');
        console.log('   - Alley:', alley.alleyId, alley.alleyName);
        console.log('   - Scene:', scene.sceneId, scene.sceneName);
        
        setState('currentAlley', alley);
        setState('currentScene', scene.sceneId);
        loadAlley(alley.alleyId, scene.sceneId);
    } else {
        // Fallback: load alley với scene đầu tiên nếu không tìm thấy hotspot
        const alley = getAlleyById(poi.alleyId);
        if (alley && alley.scenes.length > 0) {
            console.log('⚠️ [UI] POI hotspot not found, loading first scene of alley');
            setState('currentAlley', alley);
            setState('currentScene', alley.scenes[0].sceneId);
            loadAlley(poi.alleyId, alley.scenes[0].sceneId);
        }
    }
    
    // Đóng drawer sau khi chọn (mobile UX)
    const drawer = document.getElementById('drawer');
    if (drawer && drawer.classList.contains('is-open')) {
        setState('isDrawerOpen', false);
        drawer.classList.remove('is-open');
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

// ===========================================
// POI DRAWER - FAB + Bottom Sheet (V2)
// ===========================================

/**
 * Setup POI Drawer (FAB button + Bottom Sheet)
 * V2: Thay thế sidebar cũ
 */
function setupPOIDrawer() {
    const fab = document.getElementById('fab-toggle');
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('drawer-overlay');
    const closeBtn = document.getElementById('drawer-close');
    
    if (!fab || !drawer) {
        console.warn('POI Drawer elements not found');
        return;
    }
    
    // Toggle drawer khi click FAB
    fab.addEventListener('click', () => {
        const isOpen = drawer.classList.contains('open');
        
        if (isOpen) {
            closeDrawer();
        } else {
            openDrawer();
        }
    });
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeDrawer);
    }
    
    // Click overlay để đóng
    if (overlay) {
        overlay.addEventListener('click', closeDrawer);
    }
    
    // Swipe down to close (mobile)
    let touchStartY = 0;
    let touchCurrentY = 0;
    
    drawer.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    drawer.addEventListener('touchmove', (e) => {
        touchCurrentY = e.touches[0].clientY;
    }, { passive: true });
    
    drawer.addEventListener('touchend', () => {
        const deltaY = touchCurrentY - touchStartY;
        if (deltaY > 100) {
            closeDrawer();
        }
        touchStartY = 0;
        touchCurrentY = 0;
    });
    
    /**
     * Mở drawer
     */
    function openDrawer() {
        drawer.classList.add('is-open');
        fab.classList.add('is-active');
        if (overlay) overlay.classList.add('is-visible');
        setState('isDrawerOpen', true);
        console.log('📋 POI Drawer opened');
    }
    
    /**
     * Đóng drawer
     */
    function closeDrawer() {
        drawer.classList.remove('is-open');
        fab.classList.remove('is-active');
        if (overlay) overlay.classList.remove('is-visible');
        setState('isDrawerOpen', false);
        console.log('📋 POI Drawer closed');
    }
    
    // Subscribe to state
    subscribe('isDrawerOpen', (isOpen) => {
        if (isOpen) {
            drawer.classList.add('is-open');
            fab.classList.add('is-active');
            if (overlay) overlay.classList.add('is-visible');
        } else {
            drawer.classList.remove('is-open');
            fab.classList.remove('is-active');
            if (overlay) overlay.classList.remove('is-visible');
        }
    });
    
    console.log('✅ POI Drawer setup complete');
}

// ===========================================
// FULLSCREEN BUTTONS - Panel Expand/Collapse
// ===========================================

/**
 * Setup fullscreen buttons cho VR và Map panels
 */
function setupFullscreenButtons() {
    const splitContainer = document.getElementById('split-container');
    const vrPanel = document.getElementById('panel-vr');
    const mapPanel = document.getElementById('panel-map');
    const vrBtn = document.getElementById('vr-fullscreen-btn');
    const mapBtn = document.getElementById('map-fullscreen-btn');
    
    if (!splitContainer || !vrPanel || !mapPanel) {
        console.warn('Fullscreen: Missing panel elements');
        return;
    }
    
    // Import invalidateSizes từ splitter để re-render sau khi toggle
    const invalidatePanels = () => {
        // Delay để CSS apply
        setTimeout(() => {
            // Trigger resize event để Leaflet và Pannellum recalculate
            window.dispatchEvent(new Event('resize'));
        }, 100);
    };
    
    /**
     * Toggle fullscreen cho một panel
     * @param {HTMLElement} panel - Panel cần toggle
     */
    function toggleFullscreen(panel) {
        const isCurrentlyFullscreen = panel.classList.contains('is-fullscreen');
        
        if (isCurrentlyFullscreen) {
            // Exit fullscreen
            panel.classList.remove('is-fullscreen');
            splitContainer.classList.remove('has-fullscreen');
            console.log('🔲 Exit fullscreen mode');
        } else {
            // Enter fullscreen - remove other panel's fullscreen first
            vrPanel.classList.remove('is-fullscreen');
            mapPanel.classList.remove('is-fullscreen');
            
            panel.classList.add('is-fullscreen');
            splitContainer.classList.add('has-fullscreen');
            console.log('🔳 Enter fullscreen mode:', panel.id);
        }
        
        invalidatePanels();
    }
    
    // VR Panel fullscreen button
    if (vrBtn) {
        vrBtn.addEventListener('click', () => {
            toggleFullscreen(vrPanel);
        });
    }
    
    // Map Panel fullscreen button
    if (mapBtn) {
        mapBtn.addEventListener('click', () => {
            toggleFullscreen(mapPanel);
        });
    }
    
    // ESC key to exit fullscreen
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && splitContainer.classList.contains('has-fullscreen')) {
            vrPanel.classList.remove('is-fullscreen');
            mapPanel.classList.remove('is-fullscreen');
            splitContainer.classList.remove('has-fullscreen');
            invalidatePanels();
            console.log('🔲 Exit fullscreen via ESC');
        }
    });
    
    console.log('✅ Fullscreen buttons setup complete');
}

// ===========================================
// THEME TOGGLE
// ===========================================

/**
 * Setup theme toggle (Light/Dark mode)
 */
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Check saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply saved theme or system preference
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        document.body.classList.add('light-mode');
    }
    
    // Update map tiles immediately if map exists
    if (window.setMapTileLayer) {
        const isLight = document.body.classList.contains('light-mode');
        window.setMapTileLayer(isLight ? 'light' : 'dark');
    }
    
    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        
        // Save preference
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        // Update map tiles
        if (window.setMapTileLayer) {
            window.setMapTileLayer(isLight ? 'light' : 'dark');
        }
        
        console.log(`🎨 Theme changed to: ${isLight ? 'Light' : 'Dark'}`);
    });
}
