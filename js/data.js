/**
 * DATA LAYER - data.js
 * Chứa tất cả dữ liệu POI và Alley scenes
 */

// ===========================================
// DEMO IMAGES - Ảnh thumbnail từ Unsplash (miễn phí)
// ===========================================
const DEMO_IMAGES = {
    bunbo: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop",
    cafeHem: "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=400&h=300&fit=crop",
    pho: "https://images.unsplash.com/photo-1503764654157-72d979d9af2f?w=400&h=300&fit=crop",
    artSpace: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&h=300&fit=crop",
    homestay: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
    banhmi: "https://images.unsplash.com/photo-1600688640154-9619e002df30?w=400&h=300&fit=crop"
};

// ===========================================
// POI LIST - Danh sách địa điểm
// ===========================================
export const POI_LIST = [
    {
        id: "poi-001",
        name: "Bún Bò Huế Bà Tuyết",
        alleyName: "Hẻm 47 Phạm Ngũ Lão",
        category: "food",
        lat: 10.7685,
        lng: 106.6935,
        image: DEMO_IMAGES.bunbo,
        description: "Quán bún bò truyền thống 30 năm với công thức gia truyền. Nước dùng đậm đà, thịt bò mềm, chả cua thơm ngon. Là điểm đến yêu thích của người dân địa phương và du khách.",
        openHours: "06:00 – 21:00",
        rating: 4.5,
        website360Link: "https://example.com/bunbo360",
        alleyId: "alley-001"
    },
    {
        id: "poi-002",
        name: "Cafe Hẻm",
        alleyName: "Hẻm 47 Phạm Ngũ Lão",
        category: "cafe",
        lat: 10.7688,
        lng: 106.6938,
        image: DEMO_IMAGES.cafeHem,
        description: "Quán cafe vintage ẩn mình trong hẻm nhỏ. Không gian hoài cổ với đồ nội thất gỗ, đèn dầu và nhạc Trịnh. Cà phê phin truyền thống và bánh flan homemade là đặc sản.",
        openHours: "07:00 – 22:00",
        rating: 4.7,
        website360Link: "https://example.com/cafehem360",
        alleyId: "alley-001"
    },
    {
        id: "poi-003",
        name: "Phở Hà Nội Ông Già",
        alleyName: "Hẻm 84 Bùi Viện",
        category: "food",
        lat: 10.7672,
        lng: 106.6945,
        image: DEMO_IMAGES.pho,
        description: "Phở Bắc chính hiệu giữa lòng Sài Gòn. Nước dùng ninh xương 12 tiếng, bánh phở tươi mỗi sáng. Thịt bò tái, chín, gầu, gân đầy đủ. Quán nhỏ nhưng luôn đông khách từ sáng sớm.",
        openHours: "05:30 – 10:00, 17:00 – 21:00",
        rating: 4.8,
        website360Link: "https://example.com/pho360",
        alleyId: "alley-002"
    },
    {
        id: "poi-004",
        name: "Art Space Sài Gòn",
        alleyName: "Hẻm 84 Bùi Viện",
        category: "art",
        lat: 10.7670,
        lng: 106.6950,
        image: DEMO_IMAGES.artSpace,
        description: "Không gian nghệ thuật đương đại với các buổi triển lãm định kỳ. Nơi hội tụ của các nghệ sĩ trẻ Sài Gòn. Có workshop vẽ tranh và làm gốm vào cuối tuần.",
        openHours: "09:00 – 20:00",
        rating: 4.3,
        website360Link: "https://example.com/artspace360",
        alleyId: "alley-002"
    },
    {
        id: "poi-005",
        name: "Homestay Hẻm Xưa",
        alleyName: "Hẻm 47 Phạm Ngũ Lão",
        category: "hotel",
        lat: 10.7682,
        lng: 106.6932,
        image: DEMO_IMAGES.homestay,
        description: "Homestay phong cách Sài Gòn xưa với kiến trúc nhà ống cổ điển. Phòng nghỉ ấm cúng, sân thượng view thành phố. Chủ nhà thân thiện, am hiểu văn hóa địa phương.",
        openHours: "Check-in 14:00, Check-out 12:00",
        rating: 4.6,
        website360Link: "https://example.com/homestay360",
        alleyId: "alley-001"
    },
    {
        id: "poi-006",
        name: "Bánh Mì Dân Tổ",
        alleyName: "Hẻm 84 Bùi Viện",
        category: "food",
        lat: 10.7675,
        lng: 106.6948,
        image: DEMO_IMAGES.banhmi,
        description: "Xe bánh mì lề đường huyền thoại, hoạt động từ năm 1975. Bánh mì giòn rụm, nhân đầy đặn với thịt nguội, chả lụa, đồ chua và nước sốt đặc biệt.",
        openHours: "06:00 – 11:00, 16:00 – 20:00",
        rating: 4.9,
        website360Link: "https://example.com/banhmi360",
        alleyId: "alley-002"
    }
];

// ===========================================
// ALLEY LIST - Danh sách tuyến hẻm với scenes
// ===========================================

// Demo panorama images từ nguồn miễn phí
// Nguồn: https://pannellum.org/documentation/examples/
const DEMO_PANORAMAS = {
    street1: "https://pannellum.org/images/alma.jpg",
    street2: "https://pannellum.org/images/bma-702.jpg", 
    street3: "https://pannellum.org/images/cerro-toco-0.jpg",
    indoor1: "https://pannellum.org/images/jfk.jpg",
    indoor2: "https://pannellum.org/images/bma-702.jpg",
    indoor3: "https://pannellum.org/images/alma.jpg"
};

export const ALLEY_LIST = [
    {
        alleyId: "alley-001",
        alleyName: "Hẻm 47 Phạm Ngũ Lão",
        scenes: [
            {
                sceneId: "scene-001",
                sceneName: "Đầu hẻm 47",
                panorama: DEMO_PANORAMAS.street1,  // Dùng ảnh demo
                northOffset: 0,
                links: [
                    {
                        targetSceneId: "scene-002",
                        yaw: 180,
                        pitch: -15,
                        type: "forward"
                    }
                ],
                hotspots: [
                    {
                        poiId: "poi-005",
                        yaw: 45,
                        pitch: 5
                    }
                ]
            },
            {
                sceneId: "scene-002",
                sceneName: "Giữa hẻm 47",
                panorama: DEMO_PANORAMAS.street2,  // Dùng ảnh demo
                northOffset: 0,
                links: [
                    { targetSceneId: "scene-001", yaw: 0, pitch: -15, type: "back" },
                    { targetSceneId: "scene-003", yaw: 180, pitch: -15, type: "forward" }
                ],
                hotspots: [
                    {
                        poiId: "poi-001",
                        yaw: -60,
                        pitch: 10
                    }
                ]
            },
            {
                sceneId: "scene-003",
                sceneName: "Cuối hẻm 47",
                panorama: DEMO_PANORAMAS.street3,  // Dùng ảnh demo
                northOffset: 0,
                links: [
                    { targetSceneId: "scene-002", yaw: 0, pitch: -15, type: "back" }
                ],
                hotspots: [
                    {
                        poiId: "poi-002",
                        yaw: 30,
                        pitch: 5
                    }
                ]
            }
        ]
    },
    {
        alleyId: "alley-002",
        alleyName: "Hẻm 84 Bùi Viện",
        scenes: [
            {
                sceneId: "scene-004",
                sceneName: "Đầu hẻm 84",
                panorama: DEMO_PANORAMAS.indoor1,  // Dùng ảnh demo
                northOffset: 0,
                links: [
                    {
                        targetSceneId: "scene-005",
                        yaw: 180,
                        pitch: -15,
                        type: "forward"
                    }
                ],
                hotspots: [
                    {
                        poiId: "poi-003",
                        yaw: -30,
                        pitch: 8
                    }
                ]
            },
            {
                sceneId: "scene-005",
                sceneName: "Giữa hẻm 84",
                panorama: DEMO_PANORAMAS.indoor2,  // Dùng ảnh demo
                northOffset: 0,
                links: [
                    { targetSceneId: "scene-004", yaw: 0, pitch: -15, type: "back" },
                    { targetSceneId: "scene-006", yaw: 180, pitch: -15, type: "forward" }
                ],
                hotspots: [
                    {
                        poiId: "poi-006",
                        yaw: 60,
                        pitch: 5
                    }
                ]
            },
            {
                sceneId: "scene-006",
                sceneName: "Cuối hẻm 84",
                panorama: DEMO_PANORAMAS.indoor3,  // Dùng ảnh demo
                northOffset: 0,
                links: [
                    { targetSceneId: "scene-005", yaw: 0, pitch: -15, type: "back" }
                ],
                hotspots: [
                    {
                        poiId: "poi-004",
                        yaw: -45,
                        pitch: 10
                    }
                ]
            }
        ]
    }
];

// ===========================================
// HELPER FUNCTIONS
// ===========================================

/**
 * Tìm POI theo id
 * @param {string} id - POI ID
 * @returns {Object|undefined} POI object hoặc undefined
 */
export function getPOIById(id) {
    return POI_LIST.find(poi => poi.id === id);
}

/**
 * Tìm Alley theo alleyId
 * @param {string} alleyId - Alley ID
 * @returns {Object|undefined} Alley object hoặc undefined
 */
export function getAlleyById(alleyId) {
    return ALLEY_LIST.find(alley => alley.alleyId === alleyId);
}

/**
 * Tìm scene theo sceneId (tìm trong tất cả alleys)
 * @param {string} sceneId - Scene ID
 * @returns {Object|undefined} Scene object hoặc undefined
 */
export function getSceneById(sceneId) {
    for (const alley of ALLEY_LIST) {
        const scene = alley.scenes.find(s => s.sceneId === sceneId);
        if (scene) return scene;
    }
    return undefined;
}

/**
 * Lấy scene đầu tiên của alley
 * @param {string} alleyId - Alley ID
 * @returns {Object|undefined} Scene object hoặc undefined
 */
export function getFirstScene(alleyId) {
    const alley = getAlleyById(alleyId);
    if (alley && alley.scenes.length > 0) {
        return alley.scenes[0];
    }
    return undefined;
}

/**
 * Lấy alley chứa scene cụ thể
 * @param {string} sceneId - Scene ID
 * @returns {Object|undefined} Alley object hoặc undefined
 */
export function getAlleyBySceneId(sceneId) {
    return ALLEY_LIST.find(alley => 
        alley.scenes.some(scene => scene.sceneId === sceneId)
    );
}

/**
 * Lấy tất cả POI theo category
 * @param {string} category - Category name
 * @returns {Array} Mảng POI phù hợp
 */
export function getPOIsByCategory(category) {
    if (!category || category === 'all') {
        return POI_LIST;
    }
    return POI_LIST.filter(poi => poi.category === category);
}

/**
 * Tìm kiếm POI theo tên (case-insensitive, partial match)
 * @param {string} keyword - Từ khóa tìm kiếm
 * @returns {Array} Mảng POI phù hợp
 */
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

/**
 * Tìm scene chứa hotspot của một POI
 * @param {string} poiId - POI ID
 * @returns {Object|null} Object chứa alley và scene, hoặc null
 */
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

/**
 * Lấy category label tiếng Việt
 * @param {string} category - Category key
 * @returns {string} Tên category tiếng Việt
 */
export function getCategoryLabel(category) {
    const labels = {
        food: 'Ẩm thực',
        cafe: 'Cafe',
        art: 'Nghệ thuật',
        hotel: 'Lưu trú'
    };
    return labels[category] || category;
}
