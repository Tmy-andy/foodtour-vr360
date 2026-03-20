"""
Nén ảnh panorama để load nhanh hơn.
- Resize chiều rộng về 4096px (đủ đẹp cho VR360)
- Nén JPEG chất lượng 80%
- Lưu đè file gốc (backup trước trong thư mục _backup)
"""

import os
import shutil
from PIL import Image

PANORAMA_DIR = os.path.join(os.path.dirname(__file__), "assets", "panoramas")
BACKUP_DIR = os.path.join(PANORAMA_DIR, "_backup")
TARGET_WIDTH = 4096
JPEG_QUALITY = 80

def compress_panoramas():
    # Tạo thư mục backup
    os.makedirs(BACKUP_DIR, exist_ok=True)
    
    files = [f for f in os.listdir(PANORAMA_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    for filename in files:
        filepath = os.path.join(PANORAMA_DIR, filename)
        
        if not os.path.isfile(filepath):
            continue
        
        original_size = os.path.getsize(filepath) / (1024 * 1024)
        
        # Backup file gốc
        backup_path = os.path.join(BACKUP_DIR, filename)
        if not os.path.exists(backup_path):
            shutil.copy2(filepath, backup_path)
            print(f"  Backup: {filename}")
        
        # Mở và resize
        img = Image.open(filepath)
        w, h = img.size
        
        if w > TARGET_WIDTH:
            ratio = TARGET_WIDTH / w
            new_h = int(h * ratio)
            img = img.resize((TARGET_WIDTH, new_h), Image.LANCZOS)
            print(f"  Resize: {w}x{h} -> {TARGET_WIDTH}x{new_h}")
        else:
            print(f"  Giữ nguyên kích thước: {w}x{h}")
        
        # Lưu JPEG nén
        img.save(filepath, "JPEG", quality=JPEG_QUALITY, optimize=True)
        
        new_size = os.path.getsize(filepath) / (1024 * 1024)
        reduction = ((original_size - new_size) / original_size) * 100 if original_size > 0 else 0
        
        print(f"  {filename}: {original_size:.2f}MB -> {new_size:.2f}MB (giảm {reduction:.0f}%)")
        print()

if __name__ == "__main__":
    print("=== Nén ảnh Panorama ===\n")
    compress_panoramas()
    print("=== Hoàn tất! ===")
