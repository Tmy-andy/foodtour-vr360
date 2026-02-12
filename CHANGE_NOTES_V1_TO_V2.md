# LƯU Ý ĐIỀU CHỈNH — V1 → V2

> **Mục đích file này:** Gửi kèm code hiện tại để AI đọc và **chỉnh sửa đúng chỗ**, không viết lại từ đầu.
> Những gì không đề cập ở đây → **giữ nguyên, không đổi**.

---

## 1. BỎ CƠ CHẾ DOUBLE-CLICK → OVERLAY

**Trước:** Double-click marker → mở Panorama full-screen overlay phủ lên map.
**Sau:** Bỏ hoàn toàn. Panorama hiển thị **song song** với Map 2D ngay khi trang load.

**Cần sửa:**
- Xoá logic double-click mở panorama trong `map.js`.
- Xoá `#panorama-overlay` (div overlay full-screen) trong `index.html` và CSS liên quan.
- Xoá `openPanorama()` / `closePanorama()` dạng overlay trong `panorama.js`.
- Xoá nút Close (✕) panorama.
- Bỏ state `isPanoramaOpen` trong `state.js` (panorama luôn mở).

---

## 2. LAYOUT MỚI — SPLIT PANEL (Panorama + Map 2D song song)

**Trước:** Map 2D chiếm toàn bộ, panorama là overlay.
**Sau:** Chia viewport thành 2 panel nằm cạnh nhau.

### Cấu trúc HTML mới:

```html
<header class="header"><!-- Giữ nguyên --></header>

<div class="split-container">
  <div class="panel panel--vr" id="panel-vr">
    <!-- Pannellum viewer init trực tiếp ở đây -->
  </div>
  <div class="divider" id="divider"></div>
  <div class="panel panel--map" id="panel-map">
    <!-- Leaflet map init ở đây -->
  </div>
</div>
```

### CSS cần thêm:

```css
.split-container {
  display: flex;
  flex-direction: row;
  height: calc(100vh - var(--header-height));
}
.panel--vr { flex: 2; min-width: 20%; }    /* 2/3 mặc định */
.panel--map { flex: 1; min-width: 20%; }   /* 1/3 mặc định */
.divider {
  width: 6px;
  cursor: col-resize;
  background: #2A2A3E;
  position: relative;
  /* Thêm grip visual (3 chấm hoặc 3 gạch ngang) */
}

/* Mobile: chuyển dọc */
@media (max-width: 768px) {
  .split-container { flex-direction: column; }
  .divider { width: 100%; height: 6px; cursor: row-resize; }
}
```

### File mới cần tạo: `splitter.js`

Xử lý drag divider để resize 2 panel. Sau khi resize xong **bắt buộc** gọi:
- `map.invalidateSize()` (Leaflet)
- `viewer.resize()` (Pannellum)

---

## 3. PANORAMA INIT NGAY KHI LOAD

**Trước:** Pannellum chỉ init khi user double-click.
**Sau:** Init ngay trong `main.js` khi `DOMContentLoaded`.

```
Mặc định load: scene đầu tiên của alley đầu tiên trong ALLEY_LIST.
Target container: #panel-vr (thay vì #panorama-container cũ).
```

---

## 4. THÊM FOV CONE + SCENE POSITION MARKER TRÊN MAP 2D

Đây là phần **hoàn toàn mới**, thêm vào `map.js` hoặc tạo file `sync.js` riêng.

### 4.1. Scene Position Marker

Marker đặc biệt trên map biểu thị **vị trí đang đứng trong VR**:
- Hình tròn xanh dương, viền trắng, 20×20px.
- Khi chuyển scene → marker nhảy (animateMarker hoặc flyTo) tới `lat`, `lng` của scene mới.

### 4.2. FOV Cone (hình quạt xanh)

Vẽ `L.polygon` hình quạt (sector) trên map:
- **Tâm:** toạ độ `(lat, lng)` của scene hiện tại.
- **Hướng (bearing):** `(viewer.getYaw() + scene.northOffset + 360) % 360`
- **Góc mở:** `viewer.getHfov()` (horizontal field of view từ Pannellum).
- **Bán kính:** ~30–50m (cố định).
- **Màu:** `rgba(58, 134, 255, 0.25)` fill, `rgba(58, 134, 255, 0.6)` stroke.

### 4.3. Đồng bộ realtime

```
User xoay panorama → FOV Cone xoay theo trên map (throttle ~30fps)
User zoom panorama → FOV Cone thay đổi góc mở
User chuyển scene → Scene Marker + FOV Cone nhảy tới vị trí mới, map panTo
```

Dùng `requestAnimationFrame` hoặc `setInterval(33ms)` polling `viewer.getYaw()` + `viewer.getHfov()`.

---

## 5. DATA SCHEMA — THÊM FIELD MỚI CHO SCENE

Mỗi scene trong `ALLEY_LIST[].scenes[]` cần **thêm 2 field bắt buộc**:

```javascript
{
  sceneId: "scene-001",
  panorama: "assets/panoramas/hem47_s1.jpg",
  lat: 10.7685,          // ⭐ THÊM MỚI — toạ độ GPS của điểm đứng
  lng: 106.6934,         // ⭐ THÊM MỚI
  northOffset: 210,
  // ... links, hotspots giữ nguyên
}
```

Không thêm `lat`, `lng` → FOV Cone và Scene Position Marker không hoạt động.

---

## 6. SIDEBAR → FAB + DRAWER

**Trước:** Sidebar cố định bên trái, luôn hiển thị danh sách POI.
**Sau:** Bỏ sidebar. Thay bằng:

### 6.1. FAB Button (Floating Action Button)

```
- Hình tròn 48px, góc phải dưới (bottom: 24px, right: 24px)
- Icon: danh sách (☰) hoặc map pin
- z-index: 1500
- Background: gradient Magenta → Purple
- Click → toggle mở/đóng Drawer
```

### 6.2. Drawer

- **Desktop:** Side sheet trượt từ phải, width ~360px, overlay lên map panel.
- **Mobile:** Bottom sheet trượt từ dưới lên, ~60% chiều cao.
- Nội dung bên trong giữ nguyên: search bar + filter tabs + POI list.

**Cần sửa trong `ui.js`:**
- Bỏ render sidebar tĩnh.
- Thêm logic toggle drawer (slide in/out animation).
- Thay state `isSidebarOpen` → `isDrawerOpen`.

---

## 7. CLICK MARKER TRÊN MAP → CHUYỂN SCENE VR

**Trước:** Click marker → chỉ zoom + highlight sidebar.
**Sau:** Click marker → **thêm hành vi**: panorama chuyển tới scene chứa POI đó.

```
Click marker:
  1. Map flyTo marker (giữ nguyên)
  2. setState('currentPOI') (giữ nguyên)
  3. ⭐ MỚI: Tìm scene chứa hotspot của POI → viewer.loadScene(sceneId)
  4. ⭐ MỚI: FOV Cone + Scene Marker nhảy theo
```

---

## 8. FILE MỚI CẦN TẠO

| File | Chức năng |
|---|---|
| `js/sync.js` | Đồng bộ 2 chiều Panorama ↔ Map: quản lý FOV Cone, Scene Position Marker, event polling |
| `js/splitter.js` | Drag divider resize 2 panel, gọi invalidateSize/resize |

---

## 9. STATE — THÊM / SỬA

**Thêm mới:**
```javascript
currentYaw: 0,        // Yaw realtime từ panorama (dùng cho FOV Cone)
currentHfov: 100,     // HFOV realtime (dùng cho FOV Cone)
isDrawerOpen: false,   // Thay thế isSidebarOpen
```

**Xoá:**
```javascript
isPanoramaOpen        // Bỏ — panorama luôn hiển thị
```

---

## 10. KHÔNG THAY ĐỔI (GIỮ NGUYÊN)

- ✅ Header — layout, style, nội dung.
- ✅ POI data schema — các field hiện tại không đổi.
- ✅ Marker icons — food.png, cafe.png, art.png, hotel.png.
- ✅ Marker hover/click animation.
- ✅ POI Hotspot trong panorama — neon pin, pulse, click mở modal.
- ✅ Modal thông tin POI — glassmorphism, nội dung, CTA.
- ✅ Navigation arrows — forward/back/left/right trong panorama.
- ✅ Filter + Search logic.
- ✅ Rating stars render.
- ✅ Bảng màu, font, design tokens.
- ✅ Multi-scene Pannellum config (chỉ thêm lat/lng cho scene).

---

## TÓM TẮT NHANH

| # | Hạng mục | Hành động |
|---|---|---|
| 1 | Double-click → overlay | **XOÁ** |
| 2 | Layout split panel | **THÊM MỚI** |
| 3 | Panorama init khi load | **SỬA** (từ on-demand → ngay lập tức) |
| 4 | FOV Cone + Scene Marker | **THÊM MỚI** |
| 5 | Scene data: lat, lng | **THÊM field** |
| 6 | Sidebar → FAB + Drawer | **THAY THẾ** |
| 7 | Click marker → chuyển VR | **THÊM hành vi** |
| 8 | sync.js, splitter.js | **TẠO file mới** |
| 9 | State: thêm yaw/hfov/isDrawerOpen, xoá isPanoramaOpen | **SỬA** |
| 10 | Header, modal, hotspot, arrows, filter, search, colors | **GIỮ NGUYÊN** |
