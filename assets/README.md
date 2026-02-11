# Assets Folder

Thư mục này chứa các tài nguyên hình ảnh cho dự án.

## Cấu trúc

```
assets/
├── icons/          ← Marker icons (36×36 PNG, transparent)
│   ├── food.png
│   ├── cafe.png
│   ├── art.png
│   └── hotel.png
├── panoramas/      ← Ảnh equirectangular (JPEG, 4096×2048 hoặc 2048×1024)
│   ├── hem47_scene1.jpg
│   ├── hem47_scene2.jpg
│   ├── hem47_scene3.jpg
│   ├── hem84_scene1.jpg
│   ├── hem84_scene2.jpg
│   └── hem84_scene3.jpg
└── images/         ← Ảnh thumbnail POI (JPEG, ~400×300)
    ├── bunbo.jpg
    ├── cafe-hem.jpg
    ├── pho.jpg
    ├── art-space.jpg
    ├── homestay.jpg
    └── banhmi.jpg
```

## Yêu cầu ảnh

### Marker Icons
- Kích thước: 36×36 pixels
- Format: PNG với nền trong suốt
- Phong cách: Flat hoặc glyph

### Panorama Images
- Kích thước: 4096×2048 px (hoặc 2048×1024 px cho performance tốt hơn)
- Tỉ lệ: 2:1 (bắt buộc cho equirectangular projection)
- Format: JPEG (nén tốt cho panorama)
- Nguồn miễn phí: [Poly Haven](https://polyhaven.com/hdris), [Wikimedia Commons](https://commons.wikimedia.org/)

### Thumbnail Images  
- Kích thước: ~400×300 pixels
- Format: JPEG
- Nội dung: Ảnh đại diện cho quán ăn/cafe/địa điểm

## Placeholder

Nếu chưa có ảnh thật, bạn có thể:
1. Sử dụng ảnh miễn phí từ Unsplash, Pexels
2. Sử dụng placeholder online: `https://via.placeholder.com/400x300`
3. Dự án sẽ hiển thị placeholder mặc định nếu ảnh không load được
