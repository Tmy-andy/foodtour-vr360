# PROMPT — BẢN ĐỒ DU LỊCH NGÕ HẺM TP.HCM (Split-Panel Layout)

> Xây dựng một **production-ready prototype** cho nền tảng bản đồ du lịch ngõ hẻm TP.HCM.
> Giao diện chính hiển thị **Panorama 360° (VR) và Map 2D song song** trên cùng một viewport, đồng bộ realtime về vị trí và hướng nhìn.

---

## CÔNG NGHỆ BẮT BUỘC

| Thành phần | Thư viện | Ghi chú |
|---|---|---|
| Map 2D | Leaflet.js | OpenStreetMap tile, custom markers |
| Panorama 360° | Pannellum.js | Multi-scene, equirectangular projection |
| Ngôn ngữ | HTML + CSS + JavaScript thuần (ES6 modules) | Không dùng React / Vue / Angular |
| Layout | CSS Grid + Flexbox | Responsive, resizable split panel |

---

## CẤU TRÚC FILE

```
/project-root
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── data.js          // Hardcoded JSON: POI + Alley multi-scene
│   ├── state.js         // Centralized state (pub/sub pattern)
│   ├── map.js           // Leaflet: init, markers, FOV cone, position sync
│   ├── panorama.js      // Pannellum: init, multi-scene, hotspots
│   ├── navigation.js    // Forward/back arrow overlay trong panorama
│   ├── sync.js          // Đồng bộ 2 chiều: Panorama ↔ Map 2D
│   ├── ui.js            // Header, POI drawer, modal, filter, search
│   ├── splitter.js      // Resizable split-panel (drag divider)
│   ├── utils.js         // Helpers
│   └── main.js          // Bootstrap
└── assets/
    ├── icons/           // Marker icons theo category
    ├── panoramas/       // Ảnh equirectangular
    └── images/          // Thumbnail POI
```

---

## I. LAYOUT — SPLIT-PANEL (Panorama + Map 2D song song)

### 1.1. Mô tả tổng quan

Viewport chia thành 2 panel hiển thị đồng thời:

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER (fixed top, full width)                              │
├────────────────────────────────┬──┬──────────────────────────┤
│                                │▐▐│                          │
│      PANORAMA 360° (VR)       │▐▐│       MAP 2D             │
│      ~66.6% width             │▐▐│       ~33.3% width       │
│                                │▐▐│                          │
│   [Navigation Arrows]         │▐▐│   [Markers]              │
│                                │▐▐│   [FOV Cone]            │
│                                │▐▐│   [Scene Position Pin]  │
│                                │▐▐│                          │
├────────────────────────────────┴──┴──────────────────────────┤
│  ● POI Drawer Button (bottom-right, floating)                │
└──────────────────────────────────────────────────────────────┘
```

- **Panel trái:** Pannellum panorama viewer (chiếm **2/3** viewport width).
- **Panel phải:** Leaflet map 2D (chiếm **1/3** viewport width).
- **Divider:** Thanh kéo (drag handle) giữa 2 panel, cho phép user resize tỉ lệ. Mặc định 2:1.
- **Header:** Cố định trên cùng, full width, không thay đổi.

### 1.2. Responsive — Mobile Layout

Trên viewport width ≤ 768px, layout chuyển thành **vertical stack**:

```
┌────────────────────────┐
│  HEADER                │
├────────────────────────┤
│                        │
│   PANORAMA 360° (VR)  │
│   ~66.6% height       │
│                        │
├────────────────────────┤  ← Horizontal drag divider
│   MAP 2D              │
│   ~33.3% height       │
├────────────────────────┤
│  ● POI Drawer Button  │
└────────────────────────┘
```

- Panel trên: Panorama (2/3 chiều cao).
- Panel dưới: Map 2D (1/3 chiều cao).
- Divider vẫn kéo được theo chiều dọc.

### 1.3. Kỹ thuật Split-Panel (splitter.js)

```
Cấu trúc HTML:

<div class="split-container" id="split-container">
  <div class="panel panel--vr" id="panel-vr">
    <!-- Pannellum viewer -->
  </div>
  <div class="divider" id="divider">
    <!-- Drag handle visual indicator (3 chấm hoặc grip lines) -->
  </div>
  <div class="panel panel--map" id="panel-map">
    <!-- Leaflet map -->
  </div>
</div>
```

**Hành vi Divider:**

- Desktop: kéo ngang (horizontal resize), cursor `col-resize`.
- Mobile: kéo dọc (vertical resize), cursor `row-resize`.
- Khi đang drag: thêm class `is-dragging` lên body để tắt pointer-events trên cả 2 panel (tránh iframe/canvas bắt event).
- Sau khi resize xong: gọi `map.invalidateSize()` trên Leaflet và `viewer.resize()` trên Pannellum để 2 engine re-render đúng kích thước mới.
- Giới hạn min-width/min-height cho mỗi panel (ví dụ: min 20% viewport).

**CSS cốt lõi:**

```css
/* Desktop: horizontal split */
.split-container {
  display: flex;
  flex-direction: row;
  height: calc(100vh - var(--header-height));
}
.panel--vr { flex: 2; }    /* 2/3 */
.panel--map { flex: 1; }   /* 1/3 */
.divider {
  width: 6px;
  cursor: col-resize;
  background: var(--color-divider);
  /* Visual grip indicator */
}

/* Mobile: vertical split */
@media (max-width: 768px) {
  .split-container { flex-direction: column; }
  .panel--vr { flex: 2; }
  .panel--map { flex: 1; }
  .divider {
    height: 6px;
    width: 100%;
    cursor: row-resize;
  }
}
```

---

## II. HEADER (Giữ nguyên, không thay đổi)

Header cố định trên cùng, bao gồm:

- Logo + tên ứng dụng (bên trái).
- Tiêu đề tuyến hẻm đang xem / scene hiện tại (giữa).
- Các action icons: layers toggle, fullscreen, settings (bên phải).

Kỹ thuật:

```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);  /* ~56px */
  z-index: 2000;
  background: var(--color-header-bg);
}
```

---

## III. PANORAMA 360° — PANEL TRÁI (panorama.js)

### 3.1. Khởi tạo

Pannellum viewer được init ngay khi trang load (không cần double-click trigger nữa). Mặc định load scene đầu tiên của tuyến hẻm đầu tiên.

```
Pannellum config:
- type: "equirectangular"
- Multi-scene mode: default.firstScene + scenes{}
- autoLoad: true
- autoRotate: -2 (xoay nhẹ 2°/s, dừng khi user tương tác)
- autoRotateInactivityDelay: 5000
- showControls: false (ẩn UI mặc định của Pannellum)
- compass: false
- sceneFadeDuration: 1000 (1s fade khi chuyển scene)
```

### 3.2. POI Hotspots trong Panorama

Mỗi scene có thể chứa hotspot gắn với POI:

```
Hotspot config:
- yaw, pitch: vị trí trong không gian panorama
- type: "info"
- cssClass: "poi-hotspot" (neon pin + pulse animation)
- Tooltip: hiện tên POI khi hover
- Click: mở modal thông tin POI (xem mục VII)
```

**Visual hotspot:**

```css
.poi-hotspot {
  width: 28px; height: 28px;
  background: radial-gradient(circle, #FF006E, #8338EC);
  border: 2px solid white;
  border-radius: 50%;
  cursor: pointer;
  animation: pulse 1.5s infinite;
  box-shadow: 0 0 12px rgba(255, 0, 110, 0.5);
}
```

### 3.3. Sự kiện cần emit

Panorama phải emit 2 sự kiện quan trọng để `sync.js` đồng bộ với Map 2D:

| Sự kiện | Khi nào | Data truyền đi |
|---|---|---|
| `viewchange` | User xoay/zoom panorama (mỗi frame) | `{ yaw, pitch, hfov }` |
| `scenechange` | User chuyển scene (click arrow) | `{ sceneId }` |

Pannellum có sẵn event listener:

```javascript
viewer.on('mouseup', () => emitViewChange());
viewer.on('touchend', () => emitViewChange());
// Hoặc dùng requestAnimationFrame polling cho smooth sync
```

---

## IV. NAVIGATION ARROWS — DI CHUYỂN TUYẾN TÍNH (navigation.js)

### 4.1. Mô tả

Trong panorama, hiển thị **mũi tên 3D nổi** trên mặt đất (overlay), cho phép user di chuyển tuyến tính giữa các scene liên tiếp (giống Google Street View).

### 4.2. Loại mũi tên

| Type | Icon | Vị trí (yaw/pitch) | Mô tả |
|---|---|---|---|
| `forward` | ↑ | Phía trước, pitch ~ -15° | Tiến tới scene tiếp theo |
| `back` | ↓ | Phía sau, pitch ~ -15° | Quay lại scene trước |
| `left` | ← | Bên trái, pitch ~ -15° | Rẽ trái (nếu có ngã ba) |
| `right` | → | Bên phải, pitch ~ -15° | Rẽ phải (nếu có ngã ba) |

### 4.3. Kỹ thuật

Mỗi arrow là 1 Pannellum custom hotspot (type: "custom") với `createTooltipFunc` inject DOM element SVG.

```
Click arrow:
  1. Fade + slight zoom transition (300ms CSS animation)
  2. Gọi viewer.loadScene(targetSceneId)
  3. Pannellum xử lý sceneFadeDuration (1s)
  4. State update → sync.js cập nhật Map 2D
```

### 4.4. Visual

```css
.nav-arrow {
  width: 48px; height: 48px;
  cursor: pointer;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
  transition: transform 0.2s, filter 0.2s;
  animation: arrowGlow 2s infinite alternate;
}
.nav-arrow:hover {
  transform: scale(1.3);
  filter: drop-shadow(0 0 16px rgba(255, 190, 11, 0.8));
}
```

---

## V. MAP 2D — PANEL PHẢI (map.js)

### 5.1. Khởi tạo

```
Leaflet config:
- center: [10.7769, 106.7009] (TP.HCM)
- zoom: 17 (cấp ngõ hẻm)
- zoomControl: true (góc phải trên của panel map)
- doubleClickZoom: true (giữ mặc định vì không dùng double-click mở VR nữa)
- Tile: OpenStreetMap
```

### 5.2. Custom Markers (POI)

Mỗi POI trong data tạo 1 marker trên map:

```
Icon theo category:
- food.png, cafe.png, art.png, hotel.png
- Kích thước: 36×36px, transparent PNG
- iconAnchor: [18, 36] (bottom-center)
```

**Marker events:**

| Event | Hành vi |
|---|---|
| Hover | Scale marker lên 1.3x (CSS transition) |
| Click | Map flyTo marker + bounce animation + setState('currentPOI') → highlight trong POI drawer nếu đang mở |

> **Lưu ý:** Markers luôn hiển thị trên map, không bị ẩn khi panorama đang chạy (vì 2 panel luôn song song).

### 5.3. Scene Position Marker (vị trí đang đứng trong VR)

Trên map 2D, hiển thị 1 **marker đặc biệt** biểu thị vị trí tương ứng của scene đang xem trong panorama:

```
- Icon: hình tròn xanh dương với viền trắng, hoặc icon "person standing"
- Kích thước: 20×20px
- Luôn nằm trên cùng (z-index cao hơn POI markers)
- Khi chuyển scene → marker này nhảy (flyTo) tới toạ độ của scene mới
```

Mỗi scene trong data cần có `lat`, `lng` (xem mục IX - Data).

### 5.4. Field-of-View Cone (FOV Indicator)

Đây là **yếu tố đồng bộ trực quan** quan trọng nhất: trên map 2D vẽ một hình **quạt (sector/cone)** xuất phát từ vị trí scene hiện tại, biểu thị **hướng nhìn và góc nhìn** tương ứng với panorama.

```
Hình dạng: Sector (hình quạt tròn)
- Tâm: toạ độ (lat, lng) của scene hiện tại
- Hướng (bearing): tương ứng với yaw hiện tại trong panorama + northOffset
- Góc mở (angle): tương ứng với hfov (horizontal field of view) của panorama
- Bán kính: cố định (ví dụ 40-60 px trên map, hoặc ~30m thực tế)
- Màu: xanh dương bán trong suốt (rgba(58, 134, 255, 0.25))
- Viền: xanh dương đậm hơn (rgba(58, 134, 255, 0.6))
```

**Kỹ thuật vẽ FOV Cone:**

Dùng `L.polygon` hoặc `L.semiCircle` (plugin) hoặc tự tính toán polygon bằng trigonometry:

```javascript
function createFOVCone(lat, lng, bearingDeg, fovDeg, radiusMeters) {
  // bearingDeg: hướng nhìn (0° = Bắc, 90° = Đông, 180° = Nam, 270° = Tây)
  // fovDeg: góc mở ngang (thường 70°-120° tuỳ zoom trong panorama)
  // radiusMeters: bán kính cone trên map

  const points = [];
  points.push([lat, lng]);  // Tâm (đỉnh quạt)

  const startAngle = bearingDeg - fovDeg / 2;
  const endAngle = bearingDeg + fovDeg / 2;

  for (let angle = startAngle; angle <= endAngle; angle += 2) {
    const point = computeDestination(lat, lng, angle, radiusMeters);
    points.push(point);
  }

  points.push([lat, lng]);  // Đóng polygon
  return L.polygon(points, {
    color: 'rgba(58, 134, 255, 0.6)',
    fillColor: 'rgba(58, 134, 255, 0.25)',
    fillOpacity: 0.25,
    weight: 2
  });
}
```

**Cập nhật realtime:**

Mỗi khi panorama emit `viewchange` (user xoay/zoom), `sync.js` nhận `{ yaw, hfov }` → tính lại bearing → update polygon trên map. Cần dùng `requestAnimationFrame` hoặc throttle ~30fps để mượt.

### 5.5. Khi chuyển Scene → Map 2D di chuyển theo

Khi user click navigation arrow trong panorama → scene thay đổi:

```
1. panorama.js emit 'scenechange' với sceneId mới
2. sync.js nhận event:
   a. Lấy (lat, lng) của scene mới từ data
   b. Di chuyển Scene Position Marker tới vị trí mới (flyTo animation)
   c. Di chuyển FOV Cone tới vị trí mới
   d. Map flyTo nếu scene mới nằm ngoài viewport hiện tại
```

---

## VI. ĐỒNG BỘ 2 CHIỀU — REALTIME SYNC (sync.js)

Đây là module trung tâm kết nối Panorama và Map 2D.

### 6.1. Panorama → Map 2D (hướng nhìn)

```
Trigger: User xoay panorama (drag, swipe, gyroscope)
Data flow:
  Pannellum viewer → getYaw(), getPitch(), getHfov()
  → Tính bearing: bearing = (yaw + scene.northOffset + 360) % 360
  → Tính fov: hfov từ viewer
  → Update FOV Cone polygon trên Leaflet map
  → Update rotation của Scene Position Marker (nếu marker có hướng)

Tần suất: throttle 30fps (requestAnimationFrame)
```

### 6.2. Panorama → Map 2D (vị trí)

```
Trigger: User click navigation arrow → scene thay đổi
Data flow:
  Pannellum 'scenechange' event
  → setState('currentScene', newSceneId)
  → Lấy (lat, lng) từ data cho scene mới
  → Map: di chuyển Scene Position Marker
  → Map: di chuyển FOV Cone tới vị trí mới
  → Map: flyTo nếu cần (panInside)
```

### 6.3. Map 2D → Panorama (click marker / click scene position)

```
Trigger: User click POI marker trên map
Data flow:
  → Tìm scene chứa hotspot của POI đó
  → Nếu tìm thấy: panorama loadScene(sceneId)
  → Panorama chuyển tới scene tương ứng
  → FOV Cone di chuyển theo
```

### 6.4. Bảng tổng hợp đồng bộ

| Hành động | Panorama phản ứng | Map 2D phản ứng |
|---|---|---|
| Xoay panorama | — | FOV Cone xoay theo |
| Zoom panorama | — | FOV Cone thay đổi góc mở |
| Click nav arrow (chuyển scene) | Load scene mới | Marker + Cone nhảy tới vị trí scene mới |
| Click POI hotspot trong panorama | — | Highlight marker trên map |
| Click POI marker trên map | Load scene chứa POI đó | FlyTo marker |

---

## VII. POI DRAWER — THAY THẾ SIDEBAR (ui.js)

### 7.1. Trigger Button

Thay vì sidebar cố định, dùng **Floating Action Button (FAB)** góc phải dưới:

```
- Hình tròn, đường kính 48px
- Icon: danh sách (☰) hoặc pin (📍)
- Vị trí: fixed, bottom-right (bottom: 24px, right: 24px)
- z-index: 1500 (trên cả 2 panel)
- Background: gradient Magenta → Purple
- Box-shadow nổi
- Click → mở/đóng POI Drawer
```

### 7.2. POI Drawer (Bottom Sheet / Side Sheet)

Khi FAB được click:

**Desktop:** Drawer trượt vào từ phải (side sheet), width ~360px, overlay lên Map 2D panel.
**Mobile:** Drawer trượt lên từ dưới (bottom sheet), chiếm ~60% chiều cao.

```
Drawer chứa:
1. Search bar (input text, debounce 300ms)
2. Filter tabs: Tất cả | Ẩm thực | Cafe | Nghệ thuật | Lưu trú
3. POI List (scrollable):
   - Thumbnail nhỏ
   - Tên POI
   - Tên hẻm
   - Rating (★ sao)
   - Category badge

Click item trong Drawer:
  → setState('currentPOI')
  → Map flyTo marker tương ứng
  → Panorama loadScene() tới scene chứa POI
  → Đóng drawer (hoặc giữ mở tuỳ preference)
```

### 7.3. Đồng bộ Drawer với State

```
- Filter thay đổi → setState('activeFilters') → Map markers ẩn/hiện theo
- Search thay đổi → setState('searchQuery') → POI list + Map markers filter
- Click POI hotspot trong panorama → Drawer highlight item tương ứng (nếu đang mở)
```

---

## VIII. MODAL THÔNG TIN POI (ui.js)

Khi user click hotspot trong panorama HOẶC click nút "Xem chi tiết" trong Drawer:

### 8.1. Nội dung Modal

```
- Ảnh thumbnail (full-width top)
- Tên POI
- Tên hẻm
- Rating: render sao động (★★★★☆ cho 4.0, ★★★★½ cho 4.5)
- Mô tả
- Giờ mở cửa
- CTA Button: "Xem Website 360 →" (link ngoài)
- Close button (✕)
```

### 8.2. Style

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;             /* Trên tất cả */
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 420px;
  width: 90%;
  animation: scaleIn 0.3s ease;
}
```

---

## IX. DATA SCHEMA (data.js)

### 9.1. POI (Point of Interest)

```javascript
export const POI_LIST = [
  {
    id: "poi-001",                        // Unique ID
    name: "Bún Bò Huế Bà Tuyết",
    alleyName: "Hẻm 47 Phạm Ngũ Lão",
    category: "food",                      // "food" | "cafe" | "art" | "hotel"
    lat: 10.7685,
    lng: 106.6935,
    image: "assets/images/bunbo.jpg",
    description: "Quán bún bò truyền thống 30 năm...",
    openHours: "06:00 – 21:00",
    rating: 4.5,                           // 0–5, float
    website360Link: "https://example.com",
    alleyId: "alley-001"                   // FK → ALLEY_LIST
  }
];
```

### 9.2. Alley (Tuyến hẻm + Multi-scene Network)

```javascript
export const ALLEY_LIST = [
  {
    alleyId: "alley-001",
    alleyName: "Hẻm 47 Phạm Ngũ Lão",
    scenes: [
      {
        sceneId: "scene-001",
        panorama: "assets/panoramas/hem47_s1.jpg",   // Equirectangular image
        lat: 10.7685,            // ⭐ MỚI: toạ độ GPS của scene
        lng: 106.6934,           // ⭐ Dùng cho Scene Position Marker + FOV Cone
        northOffset: 210,        // Degrees: xoay panorama để căn hướng Bắc thực tế
        defaultYaw: 0,           // Hướng nhìn mặc định khi load scene
        defaultPitch: 0,
        links: [
          {
            targetSceneId: "scene-002",
            yaw: 180,            // Vị trí đặt mũi tên trong panorama
            pitch: -15,          // Âm = nhìn xuống mặt đất
            type: "forward"      // "forward" | "back" | "left" | "right"
          }
        ],
        hotspots: [
          {
            poiId: "poi-001",    // FK → POI_LIST
            yaw: 45,
            pitch: 5
          }
        ]
      },
      {
        sceneId: "scene-002",
        panorama: "assets/panoramas/hem47_s2.jpg",
        lat: 10.7686,
        lng: 106.6936,
        northOffset: 210,
        defaultYaw: 0,
        defaultPitch: 0,
        links: [
          { targetSceneId: "scene-001", yaw: 0, pitch: -15, type: "back" },
          { targetSceneId: "scene-003", yaw: 180, pitch: -15, type: "forward" }
        ],
        hotspots: []
      },
      {
        sceneId: "scene-003",
        panorama: "assets/panoramas/hem47_s3.jpg",
        lat: 10.7688,
        lng: 106.6938,
        northOffset: 210,
        defaultYaw: 0,
        defaultPitch: 0,
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

### 9.3. Thay đổi so với phiên bản cũ

| Field | Trước | Sau | Lý do |
|---|---|---|---|
| `scene.lat` | Không có | **Bắt buộc** | Cần để đặt Scene Position Marker + FOV Cone trên map |
| `scene.lng` | Không có | **Bắt buộc** | Như trên |
| `scene.defaultYaw` | Không có | Thêm mới | Hướng nhìn mặc định khi load scene |
| `scene.defaultPitch` | Không có | Thêm mới | Góc nhìn dọc mặc định |

### 9.4. Quan hệ dữ liệu

```
POI_LIST[].alleyId ─────────────→ ALLEY_LIST[].alleyId          (N:1)
ALLEY_LIST[].scenes[].hotspots[].poiId ──→ POI_LIST[].id        (N:1)
ALLEY_LIST[].scenes[].links[].targetSceneId ──→ scenes[].sceneId (N:1)
```

### 9.5. Yêu cầu dữ liệu tối thiểu

| Item | Số lượng tối thiểu |
|---|---|
| Tuyến hẻm | 1 |
| Scene / tuyến | 3 (liên tiếp, có forward + back) |
| POI | 3 (ít nhất 2 category khác nhau) |
| Hotspot | 2 (trong các scene khác nhau) |

---

## X. STATE MANAGEMENT (state.js)

### 10.1. State Shape

```javascript
const state = {
  currentPOI: null,          // POI object đang chọn
  currentAlley: null,        // Alley object đang xem
  currentScene: null,        // Scene ID đang hiển thị trong panorama
  currentYaw: 0,             // Yaw hiện tại của panorama (realtime)
  currentHfov: 100,          // Horizontal FOV hiện tại
  activeFilters: [],         // Category đang filter
  searchQuery: "",           // Từ khoá search
  isDrawerOpen: false,       // POI Drawer đang mở?
  isModalOpen: false         // Modal đang mở?
};
```

### 10.2. API

```javascript
export function getState(key) { ... }
export function setState(key, value) { ... }     // Set + notify subscribers
export function subscribe(key, callback) { ... } // Đăng ký lắng nghe
```

Mọi thay đổi state phải đi qua `setState()`. Không có module nào được đọc/ghi `state` trực tiếp.

---

## XI. DESIGN SYSTEM

### 11.1. Bảng màu

```css
:root {
  --color-magenta:     #FF006E;
  --color-purple:      #8338EC;
  --color-deep-blue:   #3A86FF;
  --color-sun-yellow:  #FFBE0B;     /* CTA */

  --color-dark:        #1A1A2E;
  --color-darker:      #0F0F23;
  --color-light:       #F8F9FA;

  --color-glass:       rgba(255, 255, 255, 0.1);
  --color-glass-border: rgba(255, 255, 255, 0.18);

  --color-fov-fill:    rgba(58, 134, 255, 0.25);
  --color-fov-stroke:  rgba(58, 134, 255, 0.6);

  --color-divider:     #2A2A3E;
  --color-divider-hover: var(--color-deep-blue);
}
```

### 11.2. Phong cách

- Vibrant, Modern, Smart City.
- Glassmorphism cho modal và drawer.
- Gradient cho FAB button và header.
- Font: Inter hoặc Be Vietnam Pro (Google Fonts).

### 11.3. Z-index Stack

| z-index | Component |
|---|---|
| 1 | Map tiles |
| 10 | Map markers, FOV Cone |
| 100 | Leaflet controls |
| 500 | Panorama viewer |
| 510 | Navigation arrows |
| 1000 | Divider (drag handle) |
| 1500 | FAB Button |
| 2000 | Header |
| 2500 | POI Drawer |
| 3000 | Modal overlay |

---

## XII. USER FLOW

```
[1] Trang load xong
    ├── Panorama load scene 1 của alley mặc định (panel trái)
    ├── Map 2D hiển thị khu vực tương ứng (panel phải)
    ├── Scene Position Marker + FOV Cone xuất hiện trên map
    └── POI markers hiển thị trên map

[2] User xoay panorama
    └── FOV Cone trên map xoay theo realtime

[3] User click forward arrow trong panorama
    ├── Panorama chuyển sang scene 2 (fade transition)
    ├── Scene Position Marker nhảy tới vị trí scene 2 trên map
    ├── FOV Cone di chuyển theo
    └── Map auto-pan nếu scene mới ngoài viewport

[4] User click POI hotspot trong panorama
    ├── Modal thông tin mở (glassmorphism, scale-in animation)
    └── Marker tương ứng trên map highlight

[5] User click FAB button (góc phải dưới)
    ├── POI Drawer trượt vào
    ├── Hiển thị search + filter + list POI
    └── Click item → panorama chuyển scene + map flyTo

[6] User kéo divider
    ├── Resize 2 panel
    ├── Leaflet: map.invalidateSize()
    └── Pannellum: viewer.resize()

[7] User click POI marker trên map
    ├── Map flyTo + bounce
    ├── Panorama loadScene() tới scene chứa POI
    └── FOV Cone di chuyển tới scene mới
```

---

## XIII. CHECKLIST TRƯỚC KHI CODE

### Tài nguyên

- [ ] 4 marker icons: food.png, cafe.png, art.png, hotel.png (36×36px)
- [ ] 1 scene position icon (20×20px, hình tròn xanh)
- [ ] ≥ 3 ảnh equirectangular (JPEG, 4096×2048 hoặc 2048×1024)
- [ ] ≥ 3 ảnh thumbnail POI
- [ ] Navigation arrow SVGs (4 hướng)
- [ ] Google Fonts: Inter hoặc Be Vietnam Pro

### Kỹ thuật

- [ ] Pannellum init ngay khi load (không cần trigger)
- [ ] Mỗi scene phải có `lat`, `lng` (cho FOV Cone + Scene Position Marker)
- [ ] Mỗi scene phải có `northOffset` chính xác (cho FOV Cone hướng đúng)
- [ ] `map.invalidateSize()` sau mỗi lần resize panel
- [ ] `viewer.resize()` sau mỗi lần resize panel
- [ ] FOV Cone update throttle ~30fps
- [ ] Divider drag: disable pointer-events trên panels khi đang drag
- [ ] ESC key: đóng modal → đóng drawer
- [ ] FAB button z-index cao hơn cả 2 panel

### Test Scenarios

| # | Test | Expected |
|---|---|---|
| 1 | Page load | Panorama scene 1 hiện bên trái, Map 2D bên phải, FOV Cone trên map |
| 2 | Xoay panorama | FOV Cone xoay realtime trên map |
| 3 | Zoom panorama | FOV Cone thay đổi góc mở |
| 4 | Click forward arrow | Panorama chuyển scene, marker+cone nhảy trên map |
| 5 | Click back arrow | Panorama quay scene trước, marker+cone nhảy ngược |
| 6 | Click POI hotspot | Modal mở, marker highlight trên map |
| 7 | Click POI marker trên map | Panorama chuyển tới scene chứa POI đó |
| 8 | Kéo divider | Cả 2 panel resize mượt, không vỡ layout |
| 9 | Click FAB | Drawer mở, hiện list POI |
| 10 | Filter / Search trong drawer | List + map markers filter |
| 11 | Resize window < 768px | Layout chuyển vertical stack |
| 12 | Click CTA trong modal | Mở link ngoài |

---

## XIV. TỔNG KẾT THAY ĐỔI SO VỚI PHIÊN BẢN CŨ

| Thay đổi | Trước (v1) | Sau (v2) |
|---|---|---|
| Mở panorama | Double-click marker → overlay full-screen | **Panorama luôn hiển thị** bên trái (split panel) |
| Layout | Map full + panorama overlay | **Split panel 2:1** (VR : Map) |
| Sidebar | Sidebar cố định bên trái | **FAB button** → Drawer overlay |
| Đồng bộ hướng nhìn | Không có | **FOV Cone** xoay realtime trên map |
| Đồng bộ vị trí | Không có | **Scene Position Marker** nhảy khi chuyển scene |
| Data: scene.lat/lng | Không có | **Bắt buộc** cho mỗi scene |
| File mới | — | `sync.js`, `splitter.js` |
| File bỏ | — | Không bỏ file, chỉ refactor |
| Mobile | Chung layout | **Vertical stack** (VR trên, Map dưới) |
| Resizable | Không | **Drag divider** giữa 2 panel |
