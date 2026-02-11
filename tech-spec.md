# BẢN ĐỒ DU LỊCH NGÕ HẺM TP.HCM — TECHNICAL SPECIFICATION

> **Phiên bản:** 1.0  
> **Mục đích:** Tài liệu kỹ thuật chi tiết dành cho Developer, phân tích từ prompt gốc, bổ sung giải thích chuyên sâu về từng thành phần, luồng dữ liệu, và các quyết định kiến trúc.

---

## MỤC LỤC

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Kiến trúc & Cấu trúc file](#2-kiến-trúc--cấu-trúc-file)
3. [Thư viện bên ngoài (CDN)](#3-thư-viện-bên-ngoài-cdn)
4. [Data Layer — data.js](#4-data-layer--datajs)
5. [State Management — state.js](#5-state-management--statejs)
6. [Map Engine — map.js](#6-map-engine--mapjs)
7. [Panorama Engine — panorama.js](#7-panorama-engine--panoramajs)
8. [Navigation System — navigation.js](#8-navigation-system--navigationjs)
9. [UI Layer — ui.js](#9-ui-layer--uijs)
10. [Utilities — utils.js](#10-utilities--utilsjs)
11. [Entry Point — main.js](#11-entry-point--mainjs)
12. [CSS Architecture — style.css](#12-css-architecture--stylecss)
13. [User Flow hoàn chỉnh](#13-user-flow-hoàn-chỉnh)
14. [Kế hoạch mở rộng](#14-kế-hoạch-mở-rộng)
15. [Checklist trước khi code](#15-checklist-trước-khi-code)

---

## 1. TỔNG QUAN HỆ THỐNG

### 1.1. Sản phẩm là gì?

Một **web app bản đồ tương tác** cho phép người dùng:

- Xem bản đồ 2D các địa điểm (quán ăn, cafe, nghệ thuật, khách sạn) nằm trong các **con hẻm** tại TP.HCM.
- **Double-click** vào marker trên bản đồ → mở trải nghiệm **Panorama 360°** bên trong con hẻm đó.
- Trong Panorama, di chuyển giữa các **scene** (giống Google Street View) bằng mũi tên điều hướng.
- Click vào **hotspot** trên panorama → xem thông tin chi tiết của doanh nghiệp/quán.

### 1.2. Công nghệ bắt buộc

| Thành phần | Công nghệ | Lý do |
|---|---|---|
| Bản đồ 2D | **Leaflet.js** | Nhẹ, miễn phí, dễ custom marker |
| Panorama 360° | **Pannellum.js** | Hỗ trợ multi-scene, hotspot, lightweight |
| Ngôn ngữ | **HTML + CSS + JS thuần (ES6 modules)** | Không framework, dễ maintain |
| Tile server | **OpenStreetMap** | Miễn phí, không cần API key |

### 1.3. Ràng buộc quan trọng

- **Không dùng React/Vue/Angular** — chỉ vanilla JS với ES6 module (`import/export`).
- **Không cần backend** — mọi dữ liệu hardcode trong `data.js`.
- **Chạy được ngay** khi mở `index.html` (qua local server hoặc Live Server).
- Tách file rõ ràng theo module, mỗi file một trách nhiệm duy nhất.

---

## 2. KIẾN TRÚC & CẤU TRÚC FILE

```
/project-root
├── index.html              ← Entry point, load CSS + JS modules
├── css/
│   └── style.css           ← Toàn bộ styling (không inline style)
├── js/
│   ├── data.js             ← Hardcode JSON: POI + Alley scenes
│   ├── state.js            ← Quản lý state tập trung (pub/sub pattern)
│   ├── map.js              ← Leaflet map: init, marker, events
│   ├── panorama.js         ← Pannellum viewer: init, load scene, destroy
│   ├── navigation.js       ← Mũi tên điều hướng 3D trong panorama
│   ├── ui.js               ← Modal, sidebar list, filter, search
│   ├── utils.js            ← Helper functions dùng chung
│   └── main.js             ← Bootstrap: gọi init() của tất cả module
└── assets/
    ├── icons/              ← Marker icons: food.png, cafe.png, art.png, hotel.png
    ├── panoramas/          ← Ảnh equirectangular cho từng scene
    └── images/             ← Ảnh thumbnail POI
```

### 2.1. Nguyên tắc kiến trúc

| Nguyên tắc | Giải thích |
|---|---|
| **Single Responsibility** | Mỗi file JS chỉ lo 1 việc. `map.js` không biết gì về Pannellum. |
| **State tập trung** | Mọi thay đổi state đi qua `state.js`. Các module subscribe để react. |
| **Event-driven** | Module giao tiếp qua custom events hoặc callback, không gọi trực tiếp nhau. |
| **No global pollution** | Dùng ES6 module (`import/export`), không đặt biến trên `window`. |

### 2.2. Dependency Graph (ai gọi ai)

```
main.js
├── import state.js        ← init state
├── import data.js         ← get data
├── import map.js          ← init map, bindEvents
├── import panorama.js     ← init panorama engine
├── import navigation.js   ← init navigation arrows
└── import ui.js           ← init sidebar, modal, filter, search

map.js
├── import data.js         ← đọc POI list
├── import state.js        ← set currentPOI, currentAlley
└── import utils.js        ← helper

panorama.js
├── import data.js         ← đọc scene config
├── import state.js        ← set currentScene
├── import navigation.js   ← render arrows khi scene load
└── import utils.js

navigation.js
├── import panorama.js     ← gọi loadScene()
└── import state.js        ← đọc currentScene

ui.js
├── import data.js         ← render list từ POI
├── import state.js        ← subscribe to state changes
├── import map.js          ← flyTo khi click list item
└── import panorama.js     ← mở panorama khi cần
```

---

## 3. THƯ VIỆN BÊN NGOÀI (CDN)

Load trong `index.html` qua `<link>` và `<script>`:

```html
<!-- Leaflet CSS + JS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<!-- Pannellum CSS + JS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css" />
<script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
```

> **Lưu ý:** Pannellum load global `pannellum` object. Leaflet load global `L` object. Trong ES6 modules, truy cập qua `window.L` và `window.pannellum`.

---

## 4. DATA LAYER — data.js

### 4.1. Cấu trúc POI (Point of Interest)

```javascript
export const POI_LIST = [
  {
    id: "poi-001",                        // Unique ID — dùng để map với hotspot
    name: "Bún Bò Huế Bà Tuyết",         // Tên hiển thị
    alleyName: "Hẻm 47 Phạm Ngũ Lão",   // Tên hẻm chứa quán
    category: "food",                      // Enum: "food" | "cafe" | "art" | "hotel"
    lat: 10.7685,                          // Latitude (WGS84)
    lng: 106.6935,                         // Longitude (WGS84)
    image: "assets/images/bunbo.jpg",      // Relative path ảnh thumbnail
    description: "Quán bún bò truyền thống 30 năm...",
    openHours: "06:00 – 21:00",
    rating: 4.5,                           // Float 0-5, render thành sao
    website360Link: "https://example.com", // CTA link
    alleyId: "alley-001"                   // Foreign key → liên kết tới tuyến hẻm
  },
  // ... thêm POI
];
```

#### Giải thích từng field:

| Field | Type | Mục đích |
|---|---|---|
| `id` | string | Unique identifier, dùng để hotspot trong panorama tham chiếu tới |
| `category` | enum string | Quyết định icon marker nào hiển thị trên bản đồ |
| `lat`, `lng` | number | Tọa độ GPS, dùng cho Leaflet marker |
| `alleyId` | string | Liên kết POI với tuyến hẻm — khi double-click marker, hệ thống tìm `alleyId` để mở panorama |
| `rating` | number | Số float 0-5. UI render ra sao vàng: `Math.floor(rating)` sao full + nửa sao nếu phần thập phân ≥ 0.5 |
| `website360Link` | string | URL cho nút CTA "Xem Website 360" trong modal |

### 4.2. Cấu trúc Tuyến Hẻm (Alley — Multi-scene Network)

Đây là phần **cốt lõi kỹ thuật** của dự án:

```javascript
export const ALLEY_LIST = [
  {
    alleyId: "alley-001",
    alleyName: "Hẻm 47 Phạm Ngũ Lão",
    scenes: [
      {
        sceneId: "scene-001",
        panorama: "assets/panoramas/hem47_scene1.jpg",  // Ảnh equirectangular
        northOffset: 0,         // Độ xoay ban đầu (degrees) để căn hướng Bắc
        links: [
          {
            targetSceneId: "scene-002",   // Scene tiếp theo
            yaw: 180,                     // Hướng nhìn (degrees) để đặt mũi tên
            pitch: -15,                   // Độ nghiêng: âm = nhìn xuống đất
            type: "forward"               // Enum: "forward" | "back" | "left" | "right"
          }
        ],
        hotspots: [
          {
            poiId: "poi-001",    // Tham chiếu tới POI_LIST[].id
            yaw: 45,             // Vị trí ngang trong panorama (degrees)
            pitch: 5             // Vị trí dọc: dương = nhìn lên, âm = nhìn xuống
          }
        ]
      },
      {
        sceneId: "scene-002",
        panorama: "assets/panoramas/hem47_scene2.jpg",
        northOffset: 0,
        links: [
          { targetSceneId: "scene-001", yaw: 0, pitch: -15, type: "back" },
          { targetSceneId: "scene-003", yaw: 180, pitch: -15, type: "forward" }
        ],
        hotspots: []
      },
      {
        sceneId: "scene-003",
        panorama: "assets/panoramas/hem47_scene3.jpg",
        northOffset: 0,
        links: [
          { targetSceneId: "scene-002", yaw: 0, pitch: -15, type: "back" }
        ],
        hotspots: [
          { poiId: "poi-002", yaw: -30, pitch: 10 }
        ]
      }
    ]
  }
];
```

#### Giải thích chi tiết:

**`scenes[]`** — Mảng các "điểm đứng" trong hẻm. Mỗi scene = 1 vị trí mà người dùng có thể đứng và nhìn quanh 360°.

**`northOffset`** — Pannellum dùng giá trị này để xoay panorama. Nếu ảnh equirectangular không căn đúng hướng Bắc, dùng field này để bù.

**`links[]`** — Mảng kết nối tới các scene khác:
- `yaw`: góc ngang (0° = trước mặt khi load, 180° = sau lưng). Xác định vị trí đặt mũi tên điều hướng.
- `pitch`: góc dọc. Thường đặt **-15 đến -20** vì mũi tên nên nằm ở mặt đất (nhìn xuống).
- `type`: chỉ kiểu hướng — quyết định icon mũi tên nào hiển thị.

**`hotspots[]`** — Các điểm đánh dấu doanh nghiệp/quán trong panorama:
- `poiId`: liên kết với `POI_LIST` để lấy thông tin hiển thị.
- `yaw`, `pitch`: vị trí trong không gian panorama.

### 4.3. Quan hệ dữ liệu

```
POI_LIST[].alleyId ──→ ALLEY_LIST[].alleyId     (N:1)
ALLEY_LIST[].scenes[].hotspots[].poiId ──→ POI_LIST[].id   (N:1)
ALLEY_LIST[].scenes[].links[].targetSceneId ──→ scenes[].sceneId   (N:1)
```

### 4.4. Yêu cầu dữ liệu tối thiểu

| Yêu cầu | Số lượng |
|---|---|
| Tuyến hẻm | ≥ 1 |
| Scene mỗi tuyến | ≥ 3 (liên tiếp, có forward + back) |
| POI | ≥ 3 (ít nhất 2 category khác nhau) |
| Hotspot | ≥ 2 (nằm trong các scene khác nhau) |

### 4.5. Về ảnh Equirectangular

- **Kích thước khuyến nghị:** 4096×2048 px (tỉ lệ 2:1 bắt buộc).
- **Format:** JPEG (nhẹ hơn PNG cho ảnh panorama).
- **Nếu chưa có ảnh thật:** Dùng placeholder image hoặc ảnh panorama miễn phí từ Wikimedia Commons / Poly Haven. Quan trọng là code phải chạy đúng flow.

### 4.6. Helper functions nên có trong data.js

```javascript
// Tìm POI theo id
export function getPOIById(id) { ... }

// Tìm alley theo alleyId
export function getAlleyById(alleyId) { ... }

// Tìm scene theo sceneId (tìm trong tất cả alleys)
export function getSceneById(sceneId) { ... }

// Lấy scene đầu tiên của alley (dùng khi double-click marker)
export function getFirstScene(alleyId) { ... }

// Lấy alley chứa scene cụ thể
export function getAlleyBySceneId(sceneId) { ... }

// Lấy tất cả POI theo category
export function getPOIsByCategory(category) { ... }

// Search POI theo tên (case-insensitive, partial match)
export function searchPOIs(keyword) { ... }
```

---

## 5. STATE MANAGEMENT — state.js

### 5.1. Tại sao cần?

Khi user tương tác, nhiều UI component cần biết trạng thái hiện tại. Ví dụ: khi user di chuyển tới scene 2, cả navigation arrows, sidebar highlight, và mini-map đều cần update. Nếu mỗi module tự quản lý state riêng → rối, không đồng bộ.

### 5.2. State Shape

```javascript
const state = {
  currentPOI: null,           // POI object đang được chọn/highlight
  currentAlley: null,         // Alley object đang xem panorama
  currentScene: null,         // Scene ID đang hiển thị trong panorama
  activeFilters: [],          // Mảng category đang filter: ["food", "cafe"]
  searchQuery: "",            // Từ khóa search hiện tại
  isPanoramaOpen: false,      // Panorama có đang mở hay không
  isModalOpen: false          // Modal thông tin có đang mở hay không
};
```

### 5.3. API Pattern — Simple Pub/Sub

```javascript
// Lưu trữ listeners
const listeners = {};

// Subscribe: module đăng ký lắng nghe thay đổi
export function subscribe(key, callback) {
  if (!listeners[key]) listeners[key] = [];
  listeners[key].push(callback);
}

// Set state + notify
export function setState(key, value) {
  state[key] = value;
  (listeners[key] || []).forEach(cb => cb(value));
}

// Get state
export function getState(key) {
  return state[key];
}
```

### 5.4. Ví dụ sử dụng

```javascript
// Trong map.js — khi user click marker:
import { setState } from './state.js';
setState('currentPOI', poi);          // → tự động notify ui.js để highlight list item

// Trong ui.js — lắng nghe:
import { subscribe } from './state.js';
subscribe('currentPOI', (poi) => {
  highlightListItem(poi.id);          // Tự chạy khi currentPOI thay đổi
});
```

### 5.5. Quy tắc

- **Không** bao giờ đọc/ghi state trực tiếp (`state.currentPOI = x` ← SAI).
- **Luôn** dùng `setState()` / `getState()`.
- Nếu nhiều state thay đổi cùng lúc, gọi `setState()` theo thứ tự logic (ví dụ: set `currentAlley` trước, rồi `currentScene`).

---

## 6. MAP ENGINE — map.js

### 6.1. Khởi tạo

```javascript
// Tạo Leaflet map
const map = L.map('map-container', {
  center: [10.7769, 106.7009],    // TP.HCM trung tâm
  zoom: 15,                        // Zoom gần (cấp hẻm)
  zoomControl: true,
  doubleClickZoom: false           // ⚠️ TẮT double-click zoom mặc định
                                   // vì double-click sẽ dùng để mở panorama
});

// Tile layer — OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);
```

> **Quan trọng:** Phải disable `doubleClickZoom` vì prompt yêu cầu double-click marker → mở panorama. Nếu không tắt, Leaflet sẽ zoom thay vì trigger event.

### 6.2. Custom Marker Icons

```javascript
// Factory function tạo icon theo category
function createCategoryIcon(category) {
  return L.icon({
    iconUrl: `assets/icons/${category}.png`,    // food.png, cafe.png, art.png, hotel.png
    iconSize: [36, 36],
    iconAnchor: [18, 36],      // Anchor tại bottom-center (đỉnh pin)
    popupAnchor: [0, -36]
  });
}
```

**Về icon files:**
- Cần 4 file: `food.png`, `cafe.png`, `art.png`, `hotel.png`
- Kích thước: 36×36 px, nền trong suốt (PNG)
- Phong cách: flat hoặc glyph, phù hợp bảng màu Magenta/Purple

### 6.3. Marker Events

Mỗi POI tạo 1 marker:

```javascript
POI_LIST.forEach(poi => {
  const marker = L.marker([poi.lat, poi.lng], {
    icon: createCategoryIcon(poi.category)
  }).addTo(map);

  // SINGLE CLICK → zoom + highlight trong sidebar
  marker.on('click', () => {
    map.flyTo([poi.lat, poi.lng], 17, { duration: 0.5 });
    setState('currentPOI', poi);
    // ui.js sẽ tự highlight nhờ subscribe
  });

  // DOUBLE CLICK → mở panorama tại scene đầu tiên
  marker.on('dblclick', () => {
    const alley = getAlleyById(poi.alleyId);
    if (alley && alley.scenes.length > 0) {
      setState('currentAlley', alley);
      setState('currentScene', alley.scenes[0].sceneId);
      openPanorama(alley, alley.scenes[0].sceneId);
    }
  });
});
```

### 6.4. Marker Animation

Thực hiện qua **CSS class** toggle:

- **Hover → scale lên:** Thêm CSS `transform: scale(1.3)` khi hover.
- **Click → bounce nhẹ:** Thêm class `.bounce` với keyframe animation, remove sau 500ms.

```css
/* Trong style.css */
.leaflet-marker-icon {
  transition: transform 0.2s ease;
}
.leaflet-marker-icon:hover {
  transform: scale(1.3);
}
.leaflet-marker-icon.bounce {
  animation: markerBounce 0.4s ease;
}
@keyframes markerBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
```

### 6.5. Exported API

```javascript
export function initMap() { ... }           // Gọi 1 lần từ main.js
export function flyToMarker(lat, lng) { ... }  // Dùng khi click list item
export function highlightMarker(poiId) { ... } // Thêm hiệu ứng highlight
export function resetMarkers() { ... }         // Reset tất cả về trạng thái mặc định
```

---

## 7. PANORAMA ENGINE — panorama.js

### 7.1. Tổng quan

Dùng **Pannellum multi-scene mode** — cho phép define nhiều scene trong 1 config, và chuyển scene bằng `loadScene()`.

### 7.2. Pannellum Multi-scene Config

```javascript
function buildPannellumConfig(alley, initialSceneId) {
  const scenes = {};

  alley.scenes.forEach(scene => {
    scenes[scene.sceneId] = {
      type: "equirectangular",
      panorama: scene.panorama,
      northOffset: scene.northOffset || 0,
      autoLoad: true,
      autoRotate: -2,              // Xoay nhẹ 2°/s (âm = xoay phải)
      autoRotateInactivityDelay: 3000,  // Bắt đầu xoay sau 3s không tương tác
      showControls: false,          // Ẩn control mặc định của Pannellum
      compass: false,
      hotSpots: buildHotspots(scene) // Xem mục 7.3
    };
  });

  return {
    default: {
      firstScene: initialSceneId,
      sceneFadeDuration: 1000       // 1s fade giữa các scene
    },
    scenes: scenes
  };
}
```

### 7.3. Hotspot Types

Pannellum hỗ trợ custom hotspot. Ta cần **2 loại**:

#### a) Navigation Hotspot (mũi tên di chuyển) — xử lý trong `navigation.js`

Thêm vào config hotspot với `type: "scene"`:

```javascript
// Pannellum built-in scene hotspot
{
  pitch: link.pitch,
  yaw: link.yaw,
  type: "scene",
  sceneId: link.targetSceneId,
  cssClass: `nav-arrow nav-arrow--${link.type}`,  // CSS class custom
  createTooltipFunc: hotspot => {
    // Tạo DOM element mũi tên custom
  }
}
```

#### b) POI Hotspot (thông tin quán) — xử lý trong `panorama.js`

```javascript
// Custom info hotspot
{
  pitch: hotspot.pitch,
  yaw: hotspot.yaw,
  type: "info",
  cssClass: "poi-hotspot",      // Neon pin + pulse animation
  clickHandlerFunc: () => {
    const poi = getPOIById(hotspot.poiId);
    setState('currentPOI', poi);
    openModal(poi);              // Gọi từ ui.js
  },
  createTooltipFunc: hotspot => {
    // Tạo tooltip hiện tên quán
  }
}
```

### 7.4. Overlay UI

Panorama mở dưới dạng **full-screen overlay** phủ lên map:

```html
<!-- Trong index.html -->
<div id="panorama-overlay" class="panorama-overlay hidden">
  <div id="panorama-loading" class="loading-spinner">
    <div class="spinner"></div>
  </div>
  <button id="panorama-close" class="panorama-close-btn">✕</button>
  <div id="panorama-container"></div>
</div>
```

### 7.5. Open/Close Flow

```
openPanorama(alley, sceneId):
  1. setState('isPanoramaOpen', true)
  2. Show overlay (remove class 'hidden', add class 'fade-in')
  3. Show loading spinner
  4. Build Pannellum config from alley data
  5. Init viewer: pannellum.viewer('panorama-container', config)
  6. On load complete → hide spinner
  7. Render navigation arrows cho scene hiện tại

closePanorama():
  1. Add class 'fade-out' to overlay
  2. After animation (300ms) → destroy viewer: viewer.destroy()
  3. Hide overlay
  4. setState('isPanoramaOpen', false)
  5. setState('currentScene', null)
  6. setState('currentAlley', null)
```

### 7.6. Scene Transition

Khi user click mũi tên hoặc Pannellum tự chuyển scene:

```javascript
viewer.on('scenechange', (sceneId) => {
  setState('currentScene', sceneId);
  // navigation.js sẽ tự re-render arrows nhờ subscribe
});
```

### 7.7. Exported API

```javascript
export function initPanorama() { ... }
export function openPanorama(alley, sceneId) { ... }
export function closePanorama() { ... }
export function loadScene(sceneId) { ... }   // Wrapper quanh viewer.loadScene()
export function getViewer() { ... }           // Trả về Pannellum viewer instance
```

---

## 8. NAVIGATION SYSTEM — navigation.js

### 8.1. Mục tiêu

Tái tạo trải nghiệm **Google Street View**: mũi tên 3D nổi trên mặt đất, user click để di chuyển tới scene tiếp theo.

### 8.2. Cơ chế

Pannellum hỗ trợ **custom hotspot** với `createTooltipFunc` — ta dùng cơ chế này để inject DOM element mũi tên vào vị trí `yaw`, `pitch` trong panorama.

### 8.3. Arrow Element

```javascript
function createArrowElement(link) {
  const el = document.createElement('div');
  el.className = `nav-arrow nav-arrow--${link.type}`;
  el.innerHTML = getArrowSVG(link.type);   // SVG mũi tên theo hướng

  el.addEventListener('click', (e) => {
    e.stopPropagation();
    loadScene(link.targetSceneId);
  });

  return el;
}
```

### 8.4. Arrow Types & SVG

| Type | Hướng | Mô tả |
|---|---|---|
| `forward` | ↑ | Mũi tên hướng tiến, đặt ở phía trước |
| `back` | ↓ | Mũi tên quay lại, đặt ở phía sau |
| `left` | ← | Rẽ trái (nếu có ngã rẽ) |
| `right` | → | Rẽ phải (nếu có ngã rẽ) |

### 8.5. CSS Effects

```css
.nav-arrow {
  width: 50px;
  height: 50px;
  cursor: pointer;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));  /* Phát sáng nhẹ */
  transition: transform 0.2s ease, filter 0.2s ease;
  animation: arrowPulse 2s infinite;
}

.nav-arrow:hover {
  transform: scale(1.3);
  filter: drop-shadow(0 0 15px rgba(255, 200, 0, 0.9));   /* Đổi màu vàng */
}

@keyframes arrowPulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}
```

### 8.6. Transition Animation

Khi click mũi tên, trước khi `loadScene()`:

```javascript
function transitionToScene(targetSceneId) {
  const container = document.getElementById('panorama-container');
  container.classList.add('scene-transition');    // Fade + slight zoom

  setTimeout(() => {
    loadScene(targetSceneId);
    container.classList.remove('scene-transition');
  }, 300);
}
```

```css
.scene-transition {
  animation: sceneTransition 0.3s ease;
}

@keyframes sceneTransition {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
}
```

---

## 9. UI LAYER — ui.js

### 9.1. Thành phần UI

```
┌──────────────────────────────────────────────────────┐
│  HEADER: Logo + Title + Search Bar                   │
├──────────────┬───────────────────────────────────────┤
│  SIDEBAR     │                                       │
│              │                                       │
│  Filter Tabs │          MAP AREA                     │
│  ─────────── │        (Leaflet)                      │
│  POI List    │                                       │
│  (scrollable)│                                       │
│              │                                       │
│              │                                       │
├──────────────┴───────────────────────────────────────┤
│  [PANORAMA OVERLAY - full screen khi mở]             │
│  [MODAL OVERLAY - glassmorphism khi mở]              │
└──────────────────────────────────────────────────────┘
```

### 9.2. Sidebar — POI List

```javascript
export function renderPOIList(pois) {
  const container = document.getElementById('poi-list');
  container.innerHTML = '';

  pois.forEach(poi => {
    const item = document.createElement('div');
    item.className = 'poi-card';
    item.dataset.poiId = poi.id;
    item.innerHTML = `
      <img src="${poi.image}" alt="${poi.name}" class="poi-card__image" />
      <div class="poi-card__info">
        <h3 class="poi-card__name">${poi.name}</h3>
        <span class="poi-card__alley">${poi.alleyName}</span>
        <div class="poi-card__rating">${renderStars(poi.rating)}</div>
      </div>
    `;

    item.addEventListener('click', () => {
      setState('currentPOI', poi);
      flyToMarker(poi.lat, poi.lng);

      // Nếu panorama đang mở → chuyển tới scene chứa hotspot
      if (getState('isPanoramaOpen')) {
        const targetScene = findSceneContainingPOI(poi.id);
        if (targetScene) loadScene(targetScene.sceneId);
      }
    });

    container.appendChild(item);
  });
}
```

### 9.3. Filter Tabs

```html
<div class="filter-tabs">
  <button class="filter-tab active" data-category="all">Tất cả</button>
  <button class="filter-tab" data-category="food">Ẩm thực</button>
  <button class="filter-tab" data-category="cafe">Cafe</button>
  <button class="filter-tab" data-category="art">Nghệ thuật</button>
  <button class="filter-tab" data-category="hotel">Lưu trú</button>
</div>
```

Logic:

```javascript
function handleFilter(category) {
  setState('activeFilters', category === 'all' ? [] : [category]);

  const filtered = category === 'all'
    ? POI_LIST
    : POI_LIST.filter(p => p.category === category);

  renderPOIList(filtered);
  updateMapMarkerVisibility(filtered);  // Ẩn/hiện marker trên map
}
```

### 9.4. Search

```javascript
function handleSearch(query) {
  setState('searchQuery', query);
  const results = searchPOIs(query);          // Từ data.js
  renderPOIList(results);
  updateMapMarkerVisibility(results);
}
```

Tìm kiếm: `name.toLowerCase().includes(query.toLowerCase())` — partial match, case-insensitive.

### 9.5. Đồng bộ 2 chiều (Map ↔ List ↔ Panorama)

| Hành động | Kết quả |
|---|---|
| Click marker trên Map | → Highlight item tương ứng trong List, scroll vào view |
| Click item trong List | → Map flyTo tới marker tương ứng |
| Click item trong List (khi panorama đang mở) | → Chuyển tới scene chứa hotspot của POI đó |
| Click hotspot trong Panorama | → Highlight item trong List + mở Modal |

### 9.6. Modal Thông Tin POI

```html
<div id="poi-modal" class="modal-overlay hidden">
  <div class="modal-card">
    <button class="modal-close">✕</button>
    <img id="modal-image" class="modal-card__image" />
    <div class="modal-card__body">
      <h2 id="modal-name"></h2>
      <p id="modal-alley" class="modal-card__alley"></p>
      <div id="modal-rating" class="modal-card__rating"></div>
      <p id="modal-description"></p>
      <p id="modal-hours" class="modal-card__hours"></p>
      <a id="modal-cta" class="modal-card__cta" target="_blank">
        Xem Website 360 →
      </a>
    </div>
  </div>
</div>
```

**Modal Style — Glassmorphism:**

```css
.modal-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: modalScaleIn 0.3s ease;
  max-width: 420px;
  overflow: hidden;
}

@keyframes modalScaleIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

### 9.7. Rating Stars — Render động

```javascript
export function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = (rating - fullStars) >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return '★'.repeat(fullStars)
       + (hasHalf ? '½' : '')
       + '☆'.repeat(emptyStars);
}
// Hoặc dùng SVG stars cho UI đẹp hơn
```

### 9.8. POI Hotspot trong Panorama

```css
.poi-hotspot {
  width: 30px;
  height: 30px;
  background: radial-gradient(circle, #ff006e, #8338ec);
  border-radius: 50%;
  border: 2px solid white;
  cursor: pointer;
  animation: hotspotPulse 1.5s infinite;
  box-shadow: 0 0 15px rgba(255, 0, 110, 0.6);
}

@keyframes hotspotPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 0, 110, 0.4); }
  50% { transform: scale(1.2); box-shadow: 0 0 25px rgba(255, 0, 110, 0.8); }
}
```

---

## 10. UTILITIES — utils.js

```javascript
// Debounce cho search input
export function debounce(fn, delay = 300) { ... }

// Format rating thành stars HTML
export function renderStars(rating) { ... }

// Tìm scene chứa hotspot của 1 POI
export function findSceneContainingPOI(poiId) { ... }

// Tạo unique ID
export function generateId() { ... }

// Clamp number trong range
export function clamp(value, min, max) { ... }

// Escape HTML (chống XSS khi render dynamic content)
export function escapeHTML(str) { ... }
```

---

## 11. ENTRY POINT — main.js

```javascript
import { initMap } from './map.js';
import { initPanorama } from './panorama.js';
import { initUI } from './ui.js';
import { initNavigation } from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  initMap();          // 1. Tạo bản đồ + markers
  initPanorama();     // 2. Chuẩn bị panorama engine (chưa mở)
  initNavigation();   // 3. Đăng ký event cho navigation
  initUI();           // 4. Render sidebar, bind filter/search

  console.log('✅ Bản đồ Hẻm TP.HCM — Ready');
});
```

**Quan trọng:** `<script type="module" src="js/main.js"></script>` trong HTML. ES6 modules tự defer, không cần `DOMContentLoaded` wrapper nhưng giữ cho rõ ràng.

---

## 12. CSS ARCHITECTURE — style.css

### 12.1. Bảng màu (Design Tokens)

```css
:root {
  /* Primary */
  --color-magenta:    #FF006E;
  --color-purple:     #8338EC;
  --color-deep-blue:  #3A86FF;
  --color-sun-yellow: #FFBE0B;    /* CTA buttons */

  /* Neutral */
  --color-dark:       #1A1A2E;
  --color-darker:     #0F0F23;
  --color-light:      #F8F9FA;
  --color-glass:      rgba(255, 255, 255, 0.1);
  --color-glass-border: rgba(255, 255, 255, 0.18);

  /* Spacing */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;

  /* Shadows */
  --shadow-card: 0 4px 15px rgba(0, 0, 0, 0.2);
  --shadow-elevated: 0 8px 32px rgba(0, 0, 0, 0.3);

  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
}
```

### 12.2. Phong cách chung

- **Vibrant + Modern + Smart City:** gradient backgrounds, glassmorphism, subtle glow effects.
- **Font:** Google Fonts — `Inter` hoặc `Be Vietnam Pro` (Vietnamese support).
- **Dark theme** cho sidebar và overlay, light content area.

### 12.3. Layout

```css
body {
  display: flex;
  height: 100vh;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.sidebar {
  width: 360px;
  flex-shrink: 0;
  background: var(--color-darker);
  overflow-y: auto;
  z-index: 10;
}

.map-container {
  flex: 1;
  position: relative;
}

.panorama-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: black;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;               /* Trên panorama */
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 12.4. Z-index Stack

| Layer | z-index | Component |
|---|---|---|
| Base | 1 | Map |
| Sidebar | 10 | POI List |
| Map controls | 100 | Leaflet zoom buttons |
| Panorama | 1000 | Full-screen overlay |
| Navigation arrows | 1010 | Trong panorama |
| Modal | 1100 | POI info modal |
| Toasts/Alerts | 9999 | Thông báo |

---

## 13. USER FLOW HOÀN CHỈNH

```
[1] User mở trang web
    │
    ├── Map load tại TP.HCM, zoom 15
    ├── Sidebar hiển thị tất cả POI
    └── Markers hiển thị trên map theo category icon

[2] User tìm kiếm hoặc filter
    │
    ├── Gõ "bún bò" → sidebar filter, map chỉ hiện markers phù hợp
    └── Click tab "Cafe" → sidebar + map filter theo category

[3] User SINGLE CLICK marker trên map
    │
    ├── Map fly + zoom tới marker
    ├── Marker bounce nhẹ
    └── Sidebar highlight POI tương ứng, scroll into view

[4] User DOUBLE CLICK marker
    │
    ├── Tìm alleyId của POI
    ├── Mở panorama overlay (fade in)
    ├── Load scene đầu tiên của alley
    ├── Show loading spinner → hide khi load xong
    └── Auto rotate 3s → dừng khi user tương tác

[5] Trong panorama — User click mũi tên FORWARD
    │
    ├── Fade + zoom nhẹ
    ├── loadScene(targetSceneId)
    ├── Update state.currentScene
    └── Re-render navigation arrows cho scene mới

[6] Trong panorama — User click POI HOTSPOT (neon pin)
    │
    ├── Mở modal thông tin (glassmorphism, scale in)
    ├── Hiển thị: ảnh, tên, hẻm, rating ★, mô tả, giờ mở cửa
    └── CTA: "Xem Website 360" → mở link mới

[7] User đóng modal → quay lại panorama
[8] User đóng panorama (nút ✕) → quay lại map 2D
```

---

## 14. KẾ HOẠCH MỞ RỘNG

Kiến trúc được thiết kế để dễ dàng nâng cấp:

| Giai đoạn | Nâng cấp | Thay đổi cần thiết |
|---|---|---|
| Phase 2 | API Backend | Thay `data.js` bằng `fetch()` calls, giữ nguyên interface |
| Phase 2 | Load JSON động | `data.js` export async functions thay vì static arrays |
| Phase 3 | Route visualization | Thêm `L.polyline()` trên map nối các scene, hiển thị tuyến hẻm |
| Phase 3 | GPS tracking | Dùng `navigator.geolocation` + hiển thị vị trí user trên map |
| Phase 4 | Analytics | Thêm event tracking vào `state.js` (mỗi `setState` → log event) |
| Phase 4 | Multi-language | i18n wrapper quanh text hiển thị |

---

## 15. CHECKLIST TRƯỚC KHI CODE

### Tài nguyên cần chuẩn bị

- [ ] 4 icon markers: `food.png`, `cafe.png`, `art.png`, `hotel.png` (36×36, transparent PNG)
- [ ] ≥ 3 ảnh panorama equirectangular (JPEG, 4096×2048 hoặc 2048×1024)
- [ ] ≥ 3 ảnh thumbnail POI (JPEG, ~400×300)
- [ ] Google Fonts: thêm `<link>` cho Inter hoặc Be Vietnam Pro

### Kiểm tra kỹ thuật

- [ ] `doubleClickZoom: false` trên Leaflet map
- [ ] Pannellum config dùng multi-scene mode (`default.firstScene` + `scenes{}`)
- [ ] Mọi state change đi qua `setState()`
- [ ] ESC key đóng modal + panorama
- [ ] Loading spinner hiển thị trong lúc panorama load
- [ ] Ảnh panorama dùng đường dẫn relative (chạy qua local server)
- [ ] `<script type="module">` cho ES6 import/export
- [ ] Không có biến global, không có logic rải rác

### Test scenarios

| # | Test | Expected |
|---|---|---|
| 1 | Mở trang → map load | Map hiện TP.HCM, markers hiện, sidebar có list |
| 2 | Click marker | Map zoom, sidebar highlight |
| 3 | Double-click marker | Panorama overlay mở, scene 1 load |
| 4 | Click forward arrow | Chuyển scene 2, animation mượt |
| 5 | Click back arrow | Quay về scene 1 |
| 6 | Click POI hotspot | Modal mở, thông tin đúng |
| 7 | Click CTA trong modal | Mở link mới |
| 8 | Đóng modal | Quay lại panorama |
| 9 | Đóng panorama | Quay lại map |
| 10 | Filter "food" | Sidebar + map chỉ hiện food POI |
| 11 | Search "bún" | Sidebar + map filter kết quả |
| 12 | Click list item khi panorama mở | Chuyển tới scene chứa POI đó |

---

> **Tài liệu này cover đầy đủ kiến trúc, data schema, behavior specs, UI/UX specs, và test cases. Dev có thể bắt đầu code ngay từ tài liệu này mà không cần hỏi lại prompt gốc.**
