"""
Nén ảnh panorama để load nhanh hơn.
- Tạo bản preview nhỏ (1024px) để load nhanh ban đầu
- Resize bản chính về 4096px, nén JPEG chất lượng 75%
- Lưu file gốc trong _backup
"""

import os
import shutil
from PIL import Image

PANORAMA_DIR = os.path.join(os.path.dirname(__file__), "assets", "panoramas")
BACKUP_DIR = os.path.join(PANORAMA_DIR, "_backup")
PREVIEW_DIR = os.path.join(PANORAMA_DIR, "preview")
TARGET_WIDTH = 4096
PREVIEW_WIDTH = 1024
JPEG_QUALITY = 75
PREVIEW_QUALITY = 60

def compress_panoramas():
    os.makedirs(BACKUP_DIR, exist_ok=True)
    os.makedirs(PREVIEW_DIR, exist_ok=True)
    
    files = [f for f in os.listdir(PANORAMA_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png')) and os.path.isfile(os.path.join(PANORAMA_DIR, f))]
    
    for filename in files:
        filepath = os.path.join(PANORAMA_DIR, filename)
        original_size = os.path.getsize(filepath) / (1024 * 1024)
        
        # Backup từ _backup nếu có (file gốc chất lượng cao), nếu không thì dùng file hiện tại
        backup_path = os.path.join(BACKUP_DIR, filename)
        source_path = backup_path if os.path.exists(backup_path) else filepath
        
        if not os.path.exists(backup_path):
            shutil.copy2(filepath, backup_path)
            print(f"  Backup: {filename}")
        
        img = Image.open(source_path)
        w, h = img.size
        
        # === Tạo bản preview nhỏ ===
        preview_path = os.path.join(PREVIEW_DIR, filename)
        ratio_p = PREVIEW_WIDTH / w
        preview_h = int(h * ratio_p)
        preview_img = img.resize((PREVIEW_WIDTH, preview_h), Image.LANCZOS)
        preview_img.save(preview_path, "JPEG", quality=PREVIEW_QUALITY, optimize=True)
        preview_size = os.path.getsize(preview_path) / 1024
        print(f"  Preview: {filename} -> {PREVIEW_WIDTH}x{preview_h} ({preview_size:.0f}KB)")
        
        # === Tạo bản chính nén ===
        if w > TARGET_WIDTH:
            ratio = TARGET_WIDTH / w
            new_h = int(h * ratio)
            img = img.resize((TARGET_WIDTH, new_h), Image.LANCZOS)
            print(f"  Resize: {w}x{h} -> {TARGET_WIDTH}x{new_h}")
        
        img.save(filepath, "JPEG", quality=JPEG_QUALITY, optimize=True)
        new_size = os.path.getsize(filepath) / (1024 * 1024)
        reduction = ((original_size - new_size) / original_size) * 100 if original_size > 0 else 0
        print(f"  Main: {filename}: {original_size:.2f}MB -> {new_size:.2f}MB (giảm {reduction:.0f}%)")
        print()

if __name__ == "__main__":
    print("=== Nén ảnh Panorama + Tạo Preview ===\n")
    compress_panoramas()
    print("=== Hoàn tất! ===")
