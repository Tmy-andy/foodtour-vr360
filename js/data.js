/**
 * DATA LAYER - data.js
 * 50 quán trong khu vực Quận 1
 */

const DEMO_IMAGES = {
    bunbo: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop",
    pho: "https://images.unsplash.com/photo-1503764654157-72d979d9af2f?w=400&h=300&fit=crop",
    banhmi: "https://images.unsplash.com/photo-1600688640154-9619e002df30?w=400&h=300&fit=crop",
    nuong: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400&h=300&fit=crop",
    coffee: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
    drink: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop",
    dessert: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
    seafood: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop"
};


// Danh sách các ảnh panorama đa dạng
const PANORAMA_IMAGES = [
    "assets/panoramas/01.jpg",
    "assets/panoramas/361 Panorama.jpg",
    "assets/panoramas/62PANO0001 Panorama.jpg",
    "assets/panoramas/k7PANO0001 Panorama.jpg",
    "assets/panoramas/PH1_8057 Panorama.jpg",
    "assets/panoramas/PT1_6709 Panorama.jpg"
];

// Bộ đếm để phân bổ panorama luân phiên, không trùng lặp liên tiếp
let panoramaIndex = 0;
function getNextPanorama() {
    const pano = PANORAMA_IMAGES[panoramaIndex % PANORAMA_IMAGES.length];
    panoramaIndex++;
    return pano;
}

// Bản đồ các offset cho từng panorama (điều chỉnh lệch hướng của ảnh)
// northOffset: xoay toàn bộ panorama (hotspot + mũi tên) để căn chỉnh
// hotspotYawOffset / hotspotPitchOffset: điều chỉnh riêng hotspot quán
// arrowBackYawOffset: điều chỉnh riêng mũi tên quay lại
// swapArrows: đổi vị trí mũi tên forward/back
const PANORAMA_ADJUSTMENTS = {
    "assets/panoramas/361 Panorama.jpg": {
        northOffset: 0,
        hotspotYawOffset: 33,     // dịch hotspot sang phải mạnh (về phía nhà hàng)
        hotspotPitchOffset: -10,  // hạ xuống một chút
        swapArrows: false,
        arrowBackYawOffset: 60   // nhích mũi tên quay lại sang trái cho khớp đường đi
    },
    "assets/panoramas/62PANO0001 Panorama.jpg": {
        northOffset: 0,
        hotspotYawOffset: 80,     // dịch hotspot sang phải thêm nữa
        hotspotPitchOffset: -15,  // hạ xuống
        swapArrows: false,
        arrowBackYawOffset: 40    // nhích mũi tên quay lại sang trái (giảm từ 60 → 40)
    },
    "assets/panoramas/k7PANO0001 Panorama.jpg": {
        northOffset: 0,           // không xoay panorama
        hotspotYawOffset: 180,    // hotspot bị ngược → xoay 180° riêng hotspot
        hotspotPitchOffset: 0,
        swapArrows: true,         // đổi vị trí mũi tên forward/back
        arrowBackYawOffset: 0
    },
    // Các ảnh khác dùng mặc định
};

function getAdjustmentsForPanorama(panoramaPath) {
    return PANORAMA_ADJUSTMENTS[panoramaPath] || {
        northOffset: 0,
        hotspotYawOffset: 0,
        hotspotPitchOffset: 0,
        swapArrows: false,
        arrowBackYawOffset: 0
    };
}

const WEBSITE_360_LINK = "https://88foodgarden.vt360.vn/";

export const POI_LIST = [
    { id: "poi-001", name: "Bún Bò Huế Bà Tuyết", alleyName: "Hẻm 47 Phạm Ngũ Lão", category: "food", icon: "bunbo", lat: 10.7685, lng: 106.6935, image: DEMO_IMAGES.bunbo, description: "Quán bún bò truyền thống 30 năm.", openHours: "06:00 – 21:00", rating: 4.5, alleyId: "alley-001", website360Link: WEBSITE_360_LINK },
    { id: "poi-002", name: "Cafe Hẻm Xưa", alleyName: "Hẻm 47 Phạm Ngũ Lão", category: "cafe", icon: "coffee", lat: 10.7686, lng: 106.6936, image: DEMO_IMAGES.coffee, description: "Quán cafe vintage ẩn mình trong hẻm.", openHours: "07:00 – 22:00", rating: 4.3, alleyId: "alley-001", website360Link: WEBSITE_360_LINK },
    { id: "poi-003", name: "Phở Gà Tư Lùn", alleyName: "Hẻm 47 Phạm Ngũ Lão", category: "food", icon: "pho", lat: 10.7687, lng: 106.6937, image: DEMO_IMAGES.pho, description: "Phở gà ta thả vườn, nước dùng trong vắt.", openHours: "06:00 – 14:00", rating: 4.6, alleyId: "alley-001", website360Link: WEBSITE_360_LINK },
    { id: "poi-004", name: "Bánh Mì Huỳnh Hoa", alleyName: "Hẻm 47 Phạm Ngũ Lão", category: "food", icon: "banhmi", lat: 10.7688, lng: 106.6938, image: DEMO_IMAGES.banhmi, description: "Bánh mì thịt nguội nổi tiếng.", openHours: "15:00 – 23:00", rating: 4.8, alleyId: "alley-001", website360Link: WEBSITE_360_LINK },
    { id: "poi-005", name: "Cơm Tấm Bụi Sài Gòn", alleyName: "Hẻm 47 Phạm Ngũ Lão", category: "food", icon: "nuong", lat: 10.7689, lng: 106.6939, image: DEMO_IMAGES.nuong, description: "Cơm tấm sườn bì chả chuẩn vị.", openHours: "06:00 – 21:00", rating: 4.4, alleyId: "alley-001", website360Link: WEBSITE_360_LINK },
    { id: "poi-006", name: "Trà Sữa Bobapop", alleyName: "Hẻm 47 Phạm Ngũ Lão", category: "cafe", icon: "drink", lat: 10.7690, lng: 106.6940, image: DEMO_IMAGES.drink, description: "Trà sữa Đài Loan với trân châu tự làm.", openHours: "10:00 – 22:00", rating: 4.2, alleyId: "alley-001", website360Link: WEBSITE_360_LINK },
    { id: "poi-007", name: "Chè Thái Cô Ba", alleyName: "Hẻm 47 Phạm Ngũ Lão", category: "food", icon: "dessert", lat: 10.7691, lng: 106.6941, image: DEMO_IMAGES.dessert, description: "Chè Thái đủ vị với nước cốt dừa.", openHours: "14:00 – 22:00", rating: 4.3, alleyId: "alley-001", website360Link: WEBSITE_360_LINK },
    { id: "poi-008", name: "Hủ Tiếu Nam Vang", alleyName: "Hẻm 47 Phạm Ngũ Lão", category: "food", icon: "pho", lat: 10.7692, lng: 106.6942, image: DEMO_IMAGES.pho, description: "Hủ tiếu Nam Vang với tôm, thịt.", openHours: "06:00 – 14:00", rating: 4.5, alleyId: "alley-001", website360Link: WEBSITE_360_LINK },
    { id: "poi-009", name: "Gỏi Cuốn Cô Út", alleyName: "Hẻm 47 Phạm Ngũ Lão", category: "food", icon: "seafood", lat: 10.7693, lng: 106.6943, image: DEMO_IMAGES.seafood, description: "Gỏi cuốn tôm thịt tươi ngon.", openHours: "10:00 – 20:00", rating: 4.4, alleyId: "alley-001", website360Link: WEBSITE_360_LINK },
    { id: "poi-010", name: "Bò Né 3 Ngon", alleyName: "Hẻm 47 Phạm Ngũ Lão", category: "food", icon: "nuong", lat: 10.7694, lng: 106.6944, image: DEMO_IMAGES.nuong, description: "Bò né sốt tiêu đen kèm bánh mì.", openHours: "06:00 – 10:00", rating: 4.6, alleyId: "alley-001", website360Link: WEBSITE_360_LINK },
    { id: "poi-011", name: "Bia Hơi Corner", alleyName: "Hẻm 84 Bùi Viện", category: "food", icon: "drink", lat: 10.7670, lng: 106.6920, image: DEMO_IMAGES.drink, description: "Bia hơi tươi mát với đồ nhậu.", openHours: "17:00 – 02:00", rating: 4.1, alleyId: "alley-002", website360Link: WEBSITE_360_LINK },
    { id: "poi-012", name: "Nướng BBQ 168", alleyName: "Hẻm 84 Bùi Viện", category: "food", icon: "nuong", lat: 10.7671, lng: 106.6921, image: DEMO_IMAGES.nuong, description: "Thịt nướng Hàn Quốc phong cách Việt.", openHours: "16:00 – 23:00", rating: 4.3, alleyId: "alley-002", website360Link: WEBSITE_360_LINK },
    { id: "poi-013", name: "Bò Lá Lốt Anh Hai", alleyName: "Hẻm 84 Bùi Viện", category: "food", icon: "nuong", lat: 10.7672, lng: 106.6922, image: DEMO_IMAGES.nuong, description: "Bò cuốn lá lốt nướng than hoa.", openHours: "15:00 – 22:00", rating: 4.5, alleyId: "alley-002", website360Link: WEBSITE_360_LINK },
    { id: "poi-014", name: "Cocktail Heaven", alleyName: "Hẻm 84 Bùi Viện", category: "cafe", icon: "drink", lat: 10.7673, lng: 106.6923, image: DEMO_IMAGES.drink, description: "Cocktail sáng tạo giá bình dân.", openHours: "18:00 – 02:00", rating: 4.2, alleyId: "alley-002", website360Link: WEBSITE_360_LINK },
    { id: "poi-015", name: "Bánh Xèo Mười", alleyName: "Hẻm 84 Bùi Viện", category: "food", icon: "seafood", lat: 10.7674, lng: 106.6924, image: DEMO_IMAGES.seafood, description: "Bánh xèo giòn rụm nhân tôm thịt.", openHours: "10:00 – 21:00", rating: 4.4, alleyId: "alley-002", website360Link: WEBSITE_360_LINK },
    { id: "poi-016", name: "Ốc Đào", alleyName: "Hẻm 84 Bùi Viện", category: "food", icon: "seafood", lat: 10.7675, lng: 106.6925, image: DEMO_IMAGES.seafood, description: "Ốc các loại xào sả ớt, hấp gừng.", openHours: "16:00 – 23:00", rating: 4.3, alleyId: "alley-002", website360Link: WEBSITE_360_LINK },
    { id: "poi-017", name: "Lẩu Dê Út Nhỏ", alleyName: "Hẻm 84 Bùi Viện", category: "food", icon: "nuong", lat: 10.7676, lng: 106.6926, image: DEMO_IMAGES.nuong, description: "Lẩu dê nấu tiêu xanh đậm đà.", openHours: "16:00 – 22:00", rating: 4.5, alleyId: "alley-002", website360Link: WEBSITE_360_LINK },
    { id: "poi-018", name: "Cafe Rooftop Sky", alleyName: "Hẻm 84 Bùi Viện", category: "cafe", icon: "coffee", lat: 10.7677, lng: 106.6927, image: DEMO_IMAGES.coffee, description: "Cafe rooftop view đẹp về đêm.", openHours: "08:00 – 23:00", rating: 4.4, alleyId: "alley-002", website360Link: WEBSITE_360_LINK },
    { id: "poi-019", name: "Sushi Mini", alleyName: "Hẻm 84 Bùi Viện", category: "food", icon: "seafood", lat: 10.7678, lng: 106.6928, image: DEMO_IMAGES.seafood, description: "Sushi tươi ngon giá sinh viên.", openHours: "11:00 – 22:00", rating: 4.2, alleyId: "alley-002", website360Link: WEBSITE_360_LINK },
    { id: "poi-020", name: "Bún Đậu Mắm Tôm", alleyName: "Hẻm 84 Bùi Viện", category: "food", icon: "bunbo", lat: 10.7679, lng: 106.6929, image: DEMO_IMAGES.bunbo, description: "Bún đậu mắm tôm chuẩn Hà Nội.", openHours: "10:00 – 21:00", rating: 4.3, alleyId: "alley-002", website360Link: WEBSITE_360_LINK },
    { id: "poi-021", name: "Mì Quảng Bà Mua", alleyName: "Hẻm 12 Nguyễn Thái Học", category: "food", icon: "pho", lat: 10.7700, lng: 106.6950, image: DEMO_IMAGES.pho, description: "Mì Quảng đúng chất miền Trung.", openHours: "06:00 – 14:00", rating: 4.6, alleyId: "alley-003", website360Link: WEBSITE_360_LINK },
    { id: "poi-022", name: "Cháo Lòng Bà Út", alleyName: "Hẻm 12 Nguyễn Thái Học", category: "food", icon: "pho", lat: 10.7701, lng: 106.6951, image: DEMO_IMAGES.pho, description: "Cháo lòng nóng hổi buổi sáng.", openHours: "05:00 – 10:00", rating: 4.4, alleyId: "alley-003", website360Link: WEBSITE_360_LINK },
    { id: "poi-023", name: "Xôi Gà Số 1", alleyName: "Hẻm 12 Nguyễn Thái Học", category: "food", icon: "nuong", lat: 10.7702, lng: 106.6952, image: DEMO_IMAGES.nuong, description: "Xôi gà xé với hành phi thơm.", openHours: "06:00 – 11:00", rating: 4.5, alleyId: "alley-003", website360Link: WEBSITE_360_LINK },
    { id: "poi-024", name: "Bánh Cuốn Thanh Trì", alleyName: "Hẻm 12 Nguyễn Thái Học", category: "food", icon: "banhmi", lat: 10.7703, lng: 106.6953, image: DEMO_IMAGES.banhmi, description: "Bánh cuốn nóng tráng tay.", openHours: "06:00 – 12:00", rating: 4.7, alleyId: "alley-003", website360Link: WEBSITE_360_LINK },
    { id: "poi-025", name: "Cafe Sách Cũ", alleyName: "Hẻm 12 Nguyễn Thái Học", category: "cafe", icon: "coffee", lat: 10.7704, lng: 106.6954, image: DEMO_IMAGES.coffee, description: "Cafe kết hợp không gian đọc sách.", openHours: "08:00 – 22:00", rating: 4.3, alleyId: "alley-003", website360Link: WEBSITE_360_LINK },
    { id: "poi-026", name: "Bánh Tráng Trộn", alleyName: "Hẻm 12 Nguyễn Thái Học", category: "food", icon: "dessert", lat: 10.7705, lng: 106.6955, image: DEMO_IMAGES.dessert, description: "Bánh tráng trộn đủ vị chua cay.", openHours: "14:00 – 21:00", rating: 4.2, alleyId: "alley-003", website360Link: WEBSITE_360_LINK },
    { id: "poi-027", name: "Sinh Tố Bơ", alleyName: "Hẻm 12 Nguyễn Thái Học", category: "cafe", icon: "drink", lat: 10.7706, lng: 106.6956, image: DEMO_IMAGES.drink, description: "Sinh tố bơ sáp Đắk Lắk.", openHours: "09:00 – 21:00", rating: 4.4, alleyId: "alley-003", website360Link: WEBSITE_360_LINK },
    { id: "poi-028", name: "Gà Rán Cô Tám", alleyName: "Hẻm 12 Nguyễn Thái Học", category: "food", icon: "nuong", lat: 10.7707, lng: 106.6957, image: DEMO_IMAGES.nuong, description: "Gà rán giòn tan kiểu miền Nam.", openHours: "10:00 – 21:00", rating: 4.3, alleyId: "alley-003", website360Link: WEBSITE_360_LINK },
    { id: "poi-029", name: "Bún Riêu Cua", alleyName: "Hẻm 12 Nguyễn Thái Học", category: "food", icon: "bunbo", lat: 10.7708, lng: 106.6958, image: DEMO_IMAGES.bunbo, description: "Bún riêu cua đồng đậm đà.", openHours: "06:00 – 13:00", rating: 4.5, alleyId: "alley-003", website360Link: WEBSITE_360_LINK },
    { id: "poi-030", name: "Chả Giò Rế", alleyName: "Hẻm 12 Nguyễn Thái Học", category: "food", icon: "seafood", lat: 10.7709, lng: 106.6959, image: DEMO_IMAGES.seafood, description: "Chả giò rế giòn rụm, nhân tôm cua.", openHours: "10:00 – 20:00", rating: 4.4, alleyId: "alley-003", website360Link: WEBSITE_360_LINK },
    { id: "poi-031", name: "Phở Bò Kobe", alleyName: "Hẻm 29 Lý Tự Trọng", category: "food", icon: "pho", lat: 10.7720, lng: 106.6970, image: DEMO_IMAGES.pho, description: "Phở bò Kobe cao cấp.", openHours: "06:00 – 22:00", rating: 4.8, alleyId: "alley-004", website360Link: WEBSITE_360_LINK },
    { id: "poi-032", name: "Cơm Gà Xối Mỡ", alleyName: "Hẻm 29 Lý Tự Trọng", category: "food", icon: "nuong", lat: 10.7721, lng: 106.6971, image: DEMO_IMAGES.nuong, description: "Cơm gà xối mỡ da giòn.", openHours: "10:00 – 21:00", rating: 4.5, alleyId: "alley-004", website360Link: WEBSITE_360_LINK },
    { id: "poi-033", name: "Cafe The Workshop", alleyName: "Hẻm 29 Lý Tự Trọng", category: "cafe", icon: "coffee", lat: 10.7722, lng: 106.6972, image: DEMO_IMAGES.coffee, description: "Specialty coffee rang xay tại chỗ.", openHours: "07:00 – 22:00", rating: 4.6, alleyId: "alley-004", website360Link: WEBSITE_360_LINK },
    { id: "poi-034", name: "Bánh Canh Cua", alleyName: "Hẻm 29 Lý Tự Trọng", category: "food", icon: "seafood", lat: 10.7723, lng: 106.6973, image: DEMO_IMAGES.seafood, description: "Bánh canh cua đồng nguyên con.", openHours: "07:00 – 14:00", rating: 4.5, alleyId: "alley-004", website360Link: WEBSITE_360_LINK },
    { id: "poi-035", name: "Bò Kho Số 7", alleyName: "Hẻm 29 Lý Tự Trọng", category: "food", icon: "bunbo", lat: 10.7724, lng: 106.6974, image: DEMO_IMAGES.bunbo, description: "Bò kho bánh mì nóng hổi.", openHours: "06:00 – 11:00", rating: 4.4, alleyId: "alley-004", website360Link: WEBSITE_360_LINK },
    { id: "poi-036", name: "Trà Đào Cam Sả", alleyName: "Hẻm 29 Lý Tự Trọng", category: "cafe", icon: "drink", lat: 10.7725, lng: 106.6975, image: DEMO_IMAGES.drink, description: "Trà đào cam sả mát lạnh.", openHours: "09:00 – 22:00", rating: 4.2, alleyId: "alley-004", website360Link: WEBSITE_360_LINK },
    { id: "poi-037", name: "Há Cảo Dimsum", alleyName: "Hẻm 29 Lý Tự Trọng", category: "food", icon: "seafood", lat: 10.7726, lng: 106.6976, image: DEMO_IMAGES.seafood, description: "Dimsum Hồng Kông chính hiệu.", openHours: "07:00 – 14:00", rating: 4.5, alleyId: "alley-004", website360Link: WEBSITE_360_LINK },
    { id: "poi-038", name: "Cháo Ếch Singapore", alleyName: "Hẻm 29 Lý Tự Trọng", category: "food", icon: "pho", lat: 10.7727, lng: 106.6977, image: DEMO_IMAGES.pho, description: "Cháo ếch kiểu Singapore béo ngậy.", openHours: "17:00 – 23:00", rating: 4.3, alleyId: "alley-004", website360Link: WEBSITE_360_LINK },
    { id: "poi-039", name: "Kem Bơ Thanh Long", alleyName: "Hẻm 29 Lý Tự Trọng", category: "food", icon: "dessert", lat: 10.7728, lng: 106.6978, image: DEMO_IMAGES.dessert, description: "Kem bơ thanh long tự làm.", openHours: "10:00 – 22:00", rating: 4.4, alleyId: "alley-004", website360Link: WEBSITE_360_LINK },
    { id: "poi-040", name: "Súp Cua Cô Bảy", alleyName: "Hẻm 29 Lý Tự Trọng", category: "food", icon: "seafood", lat: 10.7729, lng: 106.6979, image: DEMO_IMAGES.seafood, description: "Súp cua trứng bắc thảo.", openHours: "15:00 – 21:00", rating: 4.3, alleyId: "alley-004", website360Link: WEBSITE_360_LINK },
    { id: "poi-041", name: "Cơm Niêu Sài Gòn", alleyName: "Hẻm 32 Đề Thám", category: "food", icon: "nuong", lat: 10.7660, lng: 106.6910, image: DEMO_IMAGES.nuong, description: "Cơm niêu cháy cạnh thơm lừng.", openHours: "10:00 – 22:00", rating: 4.5, alleyId: "alley-005", website360Link: WEBSITE_360_LINK },
    { id: "poi-042", name: "Bún Thịt Nướng Kim", alleyName: "Hẻm 32 Đề Thám", category: "food", icon: "bunbo", lat: 10.7661, lng: 106.6911, image: DEMO_IMAGES.bunbo, description: "Bún thịt nướng chả giò.", openHours: "07:00 – 20:00", rating: 4.4, alleyId: "alley-005", website360Link: WEBSITE_360_LINK },
    { id: "poi-043", name: "Cafe Cóc Nhỏ", alleyName: "Hẻm 32 Đề Thám", category: "cafe", icon: "coffee", lat: 10.7662, lng: 106.6912, image: DEMO_IMAGES.coffee, description: "Cafe cóc bình dân vỉa hè.", openHours: "06:00 – 22:00", rating: 4.1, alleyId: "alley-005", website360Link: WEBSITE_360_LINK },
    { id: "poi-044", name: "Hàu Nướng Phô Mai", alleyName: "Hẻm 32 Đề Thám", category: "food", icon: "seafood", lat: 10.7663, lng: 106.6913, image: DEMO_IMAGES.seafood, description: "Hàu nướng phô mai Phan Rang.", openHours: "16:00 – 23:00", rating: 4.6, alleyId: "alley-005", website360Link: WEBSITE_360_LINK },
    { id: "poi-045", name: "Cơm Chiên Dương Châu", alleyName: "Hẻm 32 Đề Thám", category: "food", icon: "nuong", lat: 10.7664, lng: 106.6914, image: DEMO_IMAGES.nuong, description: "Cơm chiên Dương Châu lửa lớn.", openHours: "11:00 – 21:00", rating: 4.3, alleyId: "alley-005", website360Link: WEBSITE_360_LINK },
    { id: "poi-046", name: "Bánh Bèo Chén", alleyName: "Hẻm 32 Đề Thám", category: "food", icon: "banhmi", lat: 10.7665, lng: 106.6915, image: DEMO_IMAGES.banhmi, description: "Bánh bèo chén kiểu Huế.", openHours: "14:00 – 20:00", rating: 4.2, alleyId: "alley-005", website360Link: WEBSITE_360_LINK },
    { id: "poi-047", name: "Nước Mía Siêu Sạch", alleyName: "Hẻm 32 Đề Thám", category: "cafe", icon: "drink", lat: 10.7666, lng: 106.6916, image: DEMO_IMAGES.drink, description: "Nước mía tươi ép tại chỗ.", openHours: "08:00 – 20:00", rating: 4.0, alleyId: "alley-005", website360Link: WEBSITE_360_LINK },
    { id: "poi-048", name: "Lẩu Thái Tom Yum", alleyName: "Hẻm 32 Đề Thám", category: "food", icon: "seafood", lat: 10.7667, lng: 106.6917, image: DEMO_IMAGES.seafood, description: "Lẩu Thái chua cay đúng vị.", openHours: "16:00 – 23:00", rating: 4.5, alleyId: "alley-005", website360Link: WEBSITE_360_LINK },
    { id: "poi-049", name: "Mì Xào Bò", alleyName: "Hẻm 32 Đề Thám", category: "food", icon: "nuong", lat: 10.7668, lng: 106.6918, image: DEMO_IMAGES.nuong, description: "Mì xào bò lửa hồng.", openHours: "11:00 – 21:00", rating: 4.3, alleyId: "alley-005", website360Link: WEBSITE_360_LINK },
    { id: "poi-050", name: "Chè Khúc Bạch", alleyName: "Hẻm 32 Đề Thám", category: "food", icon: "dessert", lat: 10.7669, lng: 106.6919, image: DEMO_IMAGES.dessert, description: "Chè khúc bạch mát lịm.", openHours: "13:00 – 22:00", rating: 4.4, alleyId: "alley-005", website360Link: WEBSITE_360_LINK }
];

function createSceneForPOI(poiId, poiName, prevPoiId = null, nextPoiId = null) {
    const panoramaPath = getNextPanorama();
    const adj = getAdjustmentsForPanorama(panoramaPath);
    
    const links = [];
    
    // Nếu swapArrows = true (ảnh xoay 180°), đổi yaw forward/back cho nhau
    const forwardYaw = adj.swapArrows ? 90 : -90;
    const backYaw = adj.swapArrows ? -90 : 90;
    
    // Mũi tên lùi về (back)
    if (prevPoiId) {
        links.push({ targetSceneId: `scene-${prevPoiId}`, yaw: backYaw + adj.arrowBackYawOffset, pitch: -30, type: "back" });
    }
    // Mũi tên tiến lên (forward)
    if (nextPoiId) {
        links.push({ targetSceneId: `scene-${nextPoiId}`, yaw: forwardYaw, pitch: -30, type: "forward" });
    }
    
    return {
        sceneId: `scene-${poiId}`,
        sceneName: poiName,
        panorama: panoramaPath,
        northOffset: adj.northOffset,
        links,
        // Hotspot của quán: áp dụng offset điều chỉnh riêng cho từng ảnh panorama
        hotspots: [{ poiId, yaw: 0 + adj.hotspotYawOffset, pitch: 0 + adj.hotspotPitchOffset }]
    };
}

export const ALLEY_LIST = [
    {
        alleyId: "alley-001",
        alleyName: "Hẻm 47 Phạm Ngũ Lão",
        scenes: [
            createSceneForPOI("poi-001", "Bún Bò Huế Bà Tuyết", null, "poi-002"),
            createSceneForPOI("poi-002", "Cafe Hẻm Xưa", "poi-001", "poi-003"),
            createSceneForPOI("poi-003", "Phở Gà Tư Lùn", "poi-002", "poi-004"),
            createSceneForPOI("poi-004", "Bánh Mì Huỳnh Hoa", "poi-003", "poi-005"),
            createSceneForPOI("poi-005", "Cơm Tấm Bụi Sài Gòn", "poi-004", "poi-006"),
            createSceneForPOI("poi-006", "Trà Sữa Bobapop", "poi-005", "poi-007"),
            createSceneForPOI("poi-007", "Chè Thái Cô Ba", "poi-006", "poi-008"),
            createSceneForPOI("poi-008", "Hủ Tiếu Nam Vang", "poi-007", "poi-009"),
            createSceneForPOI("poi-009", "Gỏi Cuốn Cô Út", "poi-008", "poi-010"),
            createSceneForPOI("poi-010", "Bò Né 3 Ngon", "poi-009", null)
        ]
    },
    {
        alleyId: "alley-002",
        alleyName: "Hẻm 84 Bùi Viện",
        scenes: [
            createSceneForPOI("poi-011", "Bia Hơi Corner", null, "poi-012"),
            createSceneForPOI("poi-012", "Nướng BBQ 168", "poi-011", "poi-013"),
            createSceneForPOI("poi-013", "Bò Lá Lốt Anh Hai", "poi-012", "poi-014"),
            createSceneForPOI("poi-014", "Cocktail Heaven", "poi-013", "poi-015"),
            createSceneForPOI("poi-015", "Bánh Xèo Mười", "poi-014", "poi-016"),
            createSceneForPOI("poi-016", "Ốc Đào", "poi-015", "poi-017"),
            createSceneForPOI("poi-017", "Lẩu Dê Út Nhỏ", "poi-016", "poi-018"),
            createSceneForPOI("poi-018", "Cafe Rooftop Sky", "poi-017", "poi-019"),
            createSceneForPOI("poi-019", "Sushi Mini", "poi-018", "poi-020"),
            createSceneForPOI("poi-020", "Bún Đậu Mắm Tôm", "poi-019", null)
        ]
    },
    {
        alleyId: "alley-003",
        alleyName: "Hẻm 12 Nguyễn Thái Học",
        scenes: [
            createSceneForPOI("poi-021", "Mì Quảng Bà Mua", null, "poi-022"),
            createSceneForPOI("poi-022", "Cháo Lòng Bà Út", "poi-021", "poi-023"),
            createSceneForPOI("poi-023", "Xôi Gà Số 1", "poi-022", "poi-024"),
            createSceneForPOI("poi-024", "Bánh Cuốn Thanh Trì", "poi-023", "poi-025"),
            createSceneForPOI("poi-025", "Cafe Sách Cũ", "poi-024", "poi-026"),
            createSceneForPOI("poi-026", "Bánh Tráng Trộn", "poi-025", "poi-027"),
            createSceneForPOI("poi-027", "Sinh Tố Bơ", "poi-026", "poi-028"),
            createSceneForPOI("poi-028", "Gà Rán Cô Tám", "poi-027", "poi-029"),
            createSceneForPOI("poi-029", "Bún Riêu Cua", "poi-028", "poi-030"),
            createSceneForPOI("poi-030", "Chả Giò Rế", "poi-029", null)
        ]
    },
    {
        alleyId: "alley-004",
        alleyName: "Hẻm 29 Lý Tự Trọng",
        scenes: [
            createSceneForPOI("poi-031", "Phở Bò Kobe", null, "poi-032"),
            createSceneForPOI("poi-032", "Cơm Gà Xối Mỡ", "poi-031", "poi-033"),
            createSceneForPOI("poi-033", "Cafe The Workshop", "poi-032", "poi-034"),
            createSceneForPOI("poi-034", "Bánh Canh Cua", "poi-033", "poi-035"),
            createSceneForPOI("poi-035", "Bò Kho Số 7", "poi-034", "poi-036"),
            createSceneForPOI("poi-036", "Trà Đào Cam Sả", "poi-035", "poi-037"),
            createSceneForPOI("poi-037", "Há Cảo Dimsum", "poi-036", "poi-038"),
            createSceneForPOI("poi-038", "Cháo Ếch Singapore", "poi-037", "poi-039"),
            createSceneForPOI("poi-039", "Kem Bơ Thanh Long", "poi-038", "poi-040"),
            createSceneForPOI("poi-040", "Súp Cua Cô Bảy", "poi-039", null)
        ]
    },
    {
        alleyId: "alley-005",
        alleyName: "Hẻm 32 Đề Thám",
        scenes: [
            createSceneForPOI("poi-041", "Cơm Niêu Sài Gòn", null, "poi-042"),
            createSceneForPOI("poi-042", "Bún Thịt Nướng Kim", "poi-041", "poi-043"),
            createSceneForPOI("poi-043", "Cafe Cóc Nhỏ", "poi-042", "poi-044"),
            createSceneForPOI("poi-044", "Hàu Nướng Phô Mai", "poi-043", "poi-045"),
            createSceneForPOI("poi-045", "Cơm Chiên Dương Châu", "poi-044", "poi-046"),
            createSceneForPOI("poi-046", "Bánh Bèo Chén", "poi-045", "poi-047"),
            createSceneForPOI("poi-047", "Nước Mía Siêu Sạch", "poi-046", "poi-048"),
            createSceneForPOI("poi-048", "Lẩu Thái Tom Yum", "poi-047", "poi-049"),
            createSceneForPOI("poi-049", "Mì Xào Bò", "poi-048", "poi-050"),
            createSceneForPOI("poi-050", "Chè Khúc Bạch", "poi-049", null)
        ]
    }
];

export function getPOIById(id) {
    return POI_LIST.find(poi => poi.id === id);
}

export function getAlleyById(alleyId) {
    return ALLEY_LIST.find(alley => alley.alleyId === alleyId);
}

export function getSceneById(sceneId) {
    for (const alley of ALLEY_LIST) {
        const scene = alley.scenes.find(s => s.sceneId === sceneId);
        if (scene) return scene;
    }
    return undefined;
}

export function getFirstScene(alleyId) {
    const alley = getAlleyById(alleyId);
    if (alley && alley.scenes.length > 0) {
        return alley.scenes[0];
    }
    return undefined;
}

export function getAlleyBySceneId(sceneId) {
    return ALLEY_LIST.find(alley => 
        alley.scenes.some(scene => scene.sceneId === sceneId)
    );
}

export function getPOIsByCategory(category) {
    if (!category || category === 'all') {
        return POI_LIST;
    }
    return POI_LIST.filter(poi => poi.category === category);
}

export function searchPOIs(keyword) {
    if (!keyword || keyword.trim() === '') {
        return POI_LIST;
    }
    const lowerKeyword = keyword.toLowerCase().trim();
    return POI_LIST.filter(poi => 
        poi.name.toLowerCase().includes(lowerKeyword) ||
        poi.alleyName.toLowerCase().includes(lowerKeyword) ||
        poi.description.toLowerCase().includes(lowerKeyword)
    );
}

export function findSceneContainingPOI(poiId) {
    for (const alley of ALLEY_LIST) {
        for (const scene of alley.scenes) {
            const hasHotspot = scene.hotspots?.some(h => h.poiId === poiId);
            if (hasHotspot) {
                return { alley, scene };
            }
        }
    }
    return null;
}

export function getCategoryLabel(category) {
    const labels = {
        food: 'Ẩm thực',
        cafe: 'Cafe'
    };
    return labels[category] || category;
}
