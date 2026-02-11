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
    banhmi: "https://images.unsplash.com/photo-1600688640154-9619e002df30?w=400&h=300&fit=crop",
    nuong: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400&h=300&fit=crop",
    fastfood: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=300&fit=crop",
    xienban: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
    drink: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop",
    coffee: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop"
};

// ===========================================
// POI LIST - Danh sách địa điểm
// ===========================================
export const POI_LIST = [
    // Quận 1 - Hẻm Phạm Ngũ Lão
    {
        id: "poi-001",
        name: "Bún Bò Huế Bà Tuyết",
        alleyName: "Hẻm 47 Phạm Ngũ Lão",
        category: "food",
        icon: "bunbo",
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
        name: "Cafe Hẻm Xưa",
        alleyName: "Hẻm 47 Phạm Ngũ Lão",
        category: "cafe",
        icon: "coffee",
        lat: 10.7688,
        lng: 106.6938,
        image: DEMO_IMAGES.coffee,
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
        icon: "pho",
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
        name: "Sinh Tố Bà Ba",
        alleyName: "Hẻm 84 Bùi Viện",
        category: "cafe",
        icon: "drink",
        lat: 10.7670,
        lng: 106.6950,
        image: DEMO_IMAGES.drink,
        description: "Quán sinh tố trái cây tươi ngon nhất khu vực. Có sinh tố bơ, mãng cầu, dừa dầm, chè ba màu. Trái cây chọn lọc kỹ càng, pha chế tươi mỗi ly. Không gian thoáng mát, giá cả phải chăng.",
        openHours: "06:00 – 22:00",
        rating: 4.3,
        website360Link: "https://example.com/sinhtobaba360",
        alleyId: "alley-002"
    },
    {
        id: "poi-005",
        name: "Bánh Mì Dân Tổ",
        alleyName: "Hẻm 47 Phạm Ngũ Lão",
        category: "food",
        icon: "banhmi",
        lat: 10.7682,
        lng: 106.6932,
        image: DEMO_IMAGES.banhmi,
        description: "Xe bánh mì lề đường huyền thoại, hoạt động từ năm 1975. Bánh mì giòn rụm, nhân đầy đặn với thịt nguội, chả lụa, đồ chua và nước sốt đặc biệt của gia đình.",
        openHours: "06:00 – 11:00, 16:00 – 20:00",
        rating: 4.9,
        website360Link: "https://example.com/banhmi360",
        alleyId: "alley-001"
    },
    {
        id: "poi-006",
        name: "Nướng Cô Hai",
        alleyName: "Hẻm 12 Nguyễn Thái Học",
        category: "food",
        icon: "nuong",
        lat: 10.7695,
        lng: 106.6925,
        image: DEMO_IMAGES.nuong,
        description: "Quán nướng nổi tiếng với thịt nướng lá lốt, nem nướng, chả cá nướng. Đặc biệt có bánh tráng nướng muối ớt và nước chấm me chua ngọt độc đáo. Mở cửa từ chiều đến khuya.",
        openHours: "16:00 – 23:30",
        rating: 4.6,
        website360Link: "https://example.com/nuongcohai360",
        alleyId: "alley-003"
    },
    {
        id: "poi-007",
        name: "Gà Rán Chú Tám",
        alleyName: "Hẻm 84 Bùi Viện", 
        category: "food",
        icon: "fastfood",
        lat: 10.7668,
        lng: 106.6952,
        image: DEMO_IMAGES.fastfood,
        description: "Quán gà rán gia đình với công thức tẩm bột đặc biệt. Gà giòn rụm bên ngoài, mềm ngọt bên trong. Có kèm khoai tây chiên và salad tươi. Phục vụ nhanh, phù hợp với giới trẻ.",
        openHours: "11:00 – 22:00",
        rating: 4.4,
        website360Link: "https://example.com/garanchutam360",
        alleyId: "alley-002"
    },
    {
        id: "poi-008",
        name: "Xiên Que Miền Tây",
        alleyName: "Hẻm 12 Nguyễn Thái Học",
        category: "food", 
        icon: "xienban",
        lat: 10.7692,
        lng: 106.6928,
        image: DEMO_IMAGES.xienban,
        description: "Quán xiên que đặc sản miền Tây với đủ loại: cá viên, tôm, thịt, nem, chả cá. Nước chấm chua ngọt đậm đà, rau sống tươi mát. Không gian mở, phù hợp ngồi nhâm nhi cùng bạn bè.",
        openHours: "17:00 – 23:00",
        rating: 4.2,
        website360Link: "https://example.com/xienque360",
        alleyId: "alley-003"
    },
    {
        id: "poi-009",
        name: "Cà Phê Sữa Đá Cô Tư",
        alleyName: "Hẻm 29 Lý Tự Trọng",
        category: "cafe",
        icon: "coffee",
        lat: 10.7715,
        lng: 106.6965,
        image: DEMO_IMAGES.coffee,
        description: "Quán cafe sữa đá truyền thống Sài Gòn. Cafe rang xay tại chỗ, sữa đặc ngọt dịu, đá viên trong suốt. Có thêm bánh mì nướng bơ đường và bánh flan caramel thơm ngon.",
        openHours: "05:30 – 11:00, 14:00 – 18:00",
        rating: 4.5,
        website360Link: "https://example.com/cafesuada360",
        alleyId: "alley-004"
    },
    {
        id: "poi-010",
        name: "Bún Bò Huế Chính Gốc",
        alleyName: "Hẻm 29 Lý Tự Trọng", 
        category: "food",
        icon: "bunbo",
        lat: 10.7712,
        lng: 106.6968,
        image: DEMO_IMAGES.bunbo,
        description: "Bún bò Huế do người Huế gốc nấu, giữ nguyên hương vị xứ Huế. Nước lèo trong, vị chua cay đậm đà. Có thịt heo, chả cua, giò heo Huế chính hiệu. Mỗi tô đều có lá chuối non tươi.",
        openHours: "06:30 – 14:00, 17:00 – 20:00",
        rating: 4.7,
        website360Link: "https://example.com/bunbohue360",
        alleyId: "alley-004"
    },
    {
        id: "poi-011",
        name: "Phở Gà Ông Năm",
        alleyName: "Hẻm 12 Nguyễn Thái Học",
        category: "food",
        icon: "pho",
        lat: 10.7698,
        lng: 106.6922,
        image: DEMO_IMAGES.pho,
        description: "Phở gà nấu theo công thức cổ truyền Bắc Bộ. Nước dùng thanh ngọt từ xương gà ta, thịt gà xé phay mềm ngọt. Bánh phở dai, ăn kèm hành lá, ngò gai và chanh tươi.",
        openHours: "06:00 – 10:30, 18:00 – 21:30",
        rating: 4.6,
        website360Link: "https://example.com/phoga360",
        alleyId: "alley-003"
    },
    {
        id: "poi-012", 
        name: "Trà Chanh Tắc Cô Bảy",
        alleyName: "Hẻm 29 Lý Tự Trọng",
        category: "cafe",
        icon: "drink", 
        lat: 10.7718,
        lng: 106.6962,
        image: DEMO_IMAGES.drink,
        description: "Quán trá chanh vỉa hè quen thuộc của giới văn phòng. Trà chanh tắc mát lạnh, trà đào cam sả, nước mía tươi. Có thêm bánh tráng trộn và nem chua rán giòn. Giá rẻ, phục vụ thân thiện.",
        openHours: "07:00 – 22:30",
        rating: 4.1,
        website360Link: "https://example.com/trachanh360",
        alleyId: "alley-004"
    },
    
    // Thêm 88 quán mới để đạt 100 quán
    // Khu vực Bến Thành - Phạm Ngũ Lão
    {
        id: "poi-013",
        name: "Chè Bà Năm",
        alleyName: "Hẻm 32 Đề Thám",
        category: "cafe",
        icon: "drink",
        lat: 10.7696,
        lng: 106.6922,
        image: DEMO_IMAGES.drink,
        description: "Quán chè truyền thống với chè đậu xanh, chè ba màu, chè thái, chè bưởi. Nguyên liệu tươi ngon, pha chế theo công thức gia truyền từ Ba Miền.",
        openHours: "14:00 – 23:00",
        rating: 4.4,
        website360Link: "https://example.com/chebanam360",
        alleyId: "alley-005"
    },
    {
        id: "poi-014", 
        name: "Bánh Căn Vũng Tàu",
        alleyName: "Hẻm 32 Đề Thám",
        category: "food",
        icon: "fastfood",
        lat: 10.7698,
        lng: 106.6925,
        image: DEMO_IMAGES.fastfood,
        description: "Bánh căn Vũng Tàu đặc sản với tôm tươi, trứng cút, thịt băm. Chấm với nước mắm pha chua ngọt và rau sống tươi mát. Nướng trên chảo đặc biệt.",
        openHours: "15:00 – 22:00", 
        rating: 4.6,
        website360Link: "https://example.com/banhcan360",
        alleyId: "alley-005"
    },
    {
        id: "poi-015",
        name: "Cơm Tấm Sài Gòn",
        alleyName: "Hẻm 18 Bùi Viện", 
        category: "food",
        icon: "nuong",
        lat: 10.7665,
        lng: 106.6955,
        image: DEMO_IMAGES.nuong,
        description: "Cơm tấm sườn nướng chuẩn vị Sài Gòn. Có sườn nướng, bì, chả, trứng ốp la. Nước mắm pha đậm đà, cơm tấm dẻo thơm. Quán đông khách từ trưa đến tối.",
        openHours: "11:00 – 21:30",
        rating: 4.7,
        website360Link: "https://example.com/comtam360", 
        alleyId: "alley-002"
    },
    {
        id: "poi-016",
        name: "Kem Tràng Tiền", 
        alleyName: "Hẻm 18 Bùi Viện",
        category: "cafe",
        icon: "drink",
        lat: 10.7667,
        lng: 106.6958,
        image: DEMO_IMAGES.drink,
        description: "Kem que Tràng Tiền nổi tiếng Hà Nội. Có kem dừa, kem đậu xanh, kem chocolate. Làm từ nguyên liệu tự nhiên, không chất bảo quản.",
        openHours: "10:00 – 23:00",
        rating: 4.2,
        website360Link: "https://example.com/kemtrangtien360",
        alleyId: "alley-002"
    },
    {
        id: "poi-017",
        name: "Lẩu Thái Cô Ba",
        alleyName: "Hẻm 67 Nguyễn An Ninh",
        category: "food", 
        icon: "nuong",
        lat: 10.7702,
        lng: 106.6918,
        image: DEMO_IMAGES.nuong,
        description: "Lẩu Thái chua cay đậm đà với tôm, cá, rau muống, nấm. Nước lẩu chua cay từ me, ớt, lá chanh. Ăn kèm bún tươi và rau sống đa dạng.",
        openHours: "17:00 – 23:30",
        rating: 4.5,
        website360Link: "https://example.com/lauthai360",
        alleyId: "alley-006"
    },
    {
        id: "poi-018",
        name: "Trà Sữa Gong Cha",
        alleyName: "Hẻm 67 Nguyễn An Ninh",
        category: "cafe",
        icon: "drink", 
        lat: 10.7704,
        lng: 106.6920,
        image: DEMO_IMAGES.drink,
        description: "Trà sữa Taiwan chính hiệu với trân châu đen, pudding trứng, kem cheese. Trà xanh matcha, trà oolong thơm ngon. Topping đa dạng và tươi mỗi ngày.",
        openHours: "08:00 – 22:00",
        rating: 4.3,
        website360Link: "https://example.com/trasua360",
        alleyId: "alley-006"
    },
    {
        id: "poi-019",
        name: "Bánh Xèo Miền Tây",
        alleyName: "Hẻm 25 Phan Bội Châu",
        category: "food",
        icon: "fastfood",
        lat: 10.7720,
        lng: 106.6978,
        image: DEMO_IMAGES.fastfood,
        description: "Bánh xèo miền Tây giòn rụm với tôm tươi, thịt heo, giá đỗ. Ăn kèm rau sống, dưa leo, cà chua. Nước chấm mắm nêm chua ngọt đặc trưng.",
        openHours: "10:00 – 21:00",
        rating: 4.8,
        website360Link: "https://example.com/banhxeo360",
        alleyId: "alley-007"
    },
    {
        id: "poi-020",
        name: "Cà Phê Đen Đá",
        alleyName: "Hẻm 25 Phan Bội Châu", 
        category: "cafe",
        icon: "coffee",
        lat: 10.7722,
        lng: 106.6980,
        image: DEMO_IMAGES.coffee,
        description: "Cà phê đen đá truyền thống Sài Gòn. Rang xay tại chỗ, pha phin chậm rãi. Có bánh mì nướng bơ đường và bánh bông lan homemade.",
        openHours: "05:30 – 11:00",
        rating: 4.4,
        website360Link: "https://example.com/cafeden360",
        alleyId: "alley-007"
    },
    
    // Tiếp tục thêm 80 quán nữa để đạt 100 quán
    {
        id: "poi-021",
        name: "Nem Nướng Nha Trang", 
        alleyName: "Hẻm 42 Nguyễn Huệ",
        category: "food",
        icon: "xienban",
        lat: 10.7745,
        lng: 106.7015,
        image: DEMO_IMAGES.xienban,
        description: "Nem nướng Nha Trang chính gốc với thịt heo tươi, bánh tráng me, rau sống.",
        openHours: "16:30 – 22:30",
        rating: 4.6,
        website360Link: "https://example.com/nemnuong360", 
        alleyId: "alley-008"
    },
    {
        id: "poi-022",
        name: "Smoothie Bowl Tây",
        alleyName: "Hẻm 42 Nguyễn Huệ",
        category: "cafe", 
        icon: "drink",
        lat: 10.7747,
        lng: 106.7017,
        image: DEMO_IMAGES.drink,
        description: "Smoothie bowl Instagram với acai, dragon fruit, granola, hạt chia.",
        openHours: "07:00 – 21:00",
        rating: 4.3,
        website360Link: "https://example.com/smoothiebowl360",
        alleyId: "alley-008"
    },
    {
        id: "poi-023",
        name: "Mì Quảng Bà Mua",
        alleyName: "Hẻm 15 Đông Khởi",
        category: "food",
        icon: "pho", 
        lat: 10.7751,
        lng: 106.7025,
        image: DEMO_IMAGES.pho,
        description: "Mì Quảng Quảng Nam đặc sản với tôm, thịt heo, trứng cút, bánh tráng nướng.",
        openHours: "06:30 – 14:00",
        rating: 4.7,
        website360Link: "https://example.com/miquang360",
        alleyId: "alley-001"
    },
    {
        id: "poi-024",
        name: "Juice Station",
        alleyName: "Hẻm 15 Đông Khởi", 
        category: "cafe",
        icon: "drink",
        lat: 10.7753,
        lng: 106.7027,
        image: DEMO_IMAGES.drink,
        description: "Nước ép trái cây tươi 100% từ cam, táo, dứa, dưa hấu.",
        openHours: "06:00 – 22:00",
        rating: 4.2,
        website360Link: "https://example.com/juicestation360",
        alleyId: "alley-001"
    },
    {
        id: "poi-025",
        name: "Pizza Hẻm",
        alleyName: "Hẻm 88 Pasteur",
        category: "food",
        icon: "fastfood",
        lat: 10.7780,
        lng: 106.7005,
        image: DEMO_IMAGES.fastfood,
        description: "Pizza thủ công với đế mỏng giòn, phô mai mozzarella nhập khẩu.",
        openHours: "17:00 – 23:00", 
        rating: 4.5,
        website360Link: "https://example.com/pizzahem360",
        alleyId: "alley-010"
    },
    // Thêm 75 POI nữa để đạt 100 quán
    {
        id: "poi-026",
        name: "Trà Đá Chanh Muối",
        alleyName: "Hẻm 88 Pasteur", 
        category: "cafe",
        icon: "drink",
        lat: 10.7782,
        lng: 106.7007,
        image: DEMO_IMAGES.drink,
        description: "Trà đá chanh muối giải nhiệt mùa hè. Trà xanh pha loãng, chanh tươi, muối tiêu rang.",
        openHours: "08:00 – 23:00", 
        rating: 4.0,
        website360Link: "https://example.com/trachanhmuoi360",
        alleyId: "alley-010"
    },
    {
        id: "poi-027", 
        name: "Dê Nướng Tả Pín Lù",
        alleyName: "Hẻm 55 Ký Con",
        category: "food",
        icon: "nuong",
        lat: 10.760786,
        lng: 106.684195,
        image: DEMO_IMAGES.nuong,
        description: "Dê nướng tả pín lù đặc sản Tây Bắc với thịt dê tươi, ướp gia vị đặc biệt.",
        openHours: "17:00 – 23:00",
        rating: 4.3,
        website360Link: "https://example.com/denướngtapinlu360",
        alleyId: "alley-011"
    },
    {
        id: "poi-028",
        name: "Bún Măng Vịt",
        alleyName: "Hẻm 21 Cống Quỳnh", 
        category: "food",
        icon: "pho",
        lat: 10.760283,
        lng: 106.687810,
        image: DEMO_IMAGES.pho,
        description: "Bún măng vịt miền Bắc với nước dùng trong, măng tươi, thịt vịt thơm ngon.",
        openHours: "06:00 – 14:00",
        rating: 4.2,
        website360Link: "https://example.com/bunmangvit360",
        alleyId: "alley-011"
    },
    {
        id: "poi-029",
        name: "Chè Ba Màu Cô Tư",
        alleyName: "Hẻm 90 Pasteur",
        category: "cafe",
        icon: "drink",
        lat: 10.760778,
        lng: 106.689910, 
        image: DEMO_IMAGES.drink,
        description: "Chè ba màu truyền thống với đậu xanh, thạch, nước cốt dừa thơm béo.",
        openHours: "14:00 – 22:00",
        rating: 4.4,
        website360Link: "https://example.com/chebamau360",
        alleyId: "alley-011"
    },
    {
        id: "poi-030",
        name: "Cá Nướng Lá Chuối",
        alleyName: "Hẻm 12 Nguyễn Thị Minh Khai",
        category: "food",
        icon: "nuong",
        lat: 10.760833,
        lng: 106.692959,
        image: DEMO_IMAGES.nuong,
        description: "Cá nướng lá chuối thơm lừng, nướng trên than hoa với gia vị đặc biệt.",
        openHours: "16:00 – 23:00",
        rating: 4.6,
        website360Link: "https://example.com/canuonglachuoi360",
        alleyId: "alley-011"
    },
    // ============ 70 POI bổ sung (031-100) ============
    {
        id: "poi-031",
        name: "Bánh Khọt Vũng Tàu",
        alleyName: "Hẻm 12 Lý Tự Trọng",
        category: "food",
        icon: "nuong",
        lat: 10.773048,
        lng: 106.699039,
        image: DEMO_IMAGES.nuong,
        description: "Quán bánh khọt vũng tàu phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "06:00 – 21:00",
        rating: 4.7,
        website360Link: "https://example.com/bánhkhọtvũngtàu360",
        alleyId: "alley-001"
    },
    {
        id: "poi-032",
        name: "Mì Quảng Đà Nẵng",
        alleyName: "Hẻm 57 Đông Khởi",
        category: "food",
        icon: "pho",
        lat: 10.773126,
        lng: 106.689128,
        image: DEMO_IMAGES.pho,
        description: "Quán mì quảng đà nẵng phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "10:00 – 22:30",
        rating: 4.9,
        website360Link: "https://example.com/mìquảngđànẵng360",
        alleyId: "alley-002"
    },
    {
        id: "poi-033",
        name: "Cao Lầu Hội An",
        alleyName: "Hẻm 14 Pasteur",
        category: "food",
        icon: "bunbo",
        lat: 10.764744,
        lng: 106.687221,
        image: DEMO_IMAGES.bunbo,
        description: "Quán cao lầu hội an phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "15:00 – 24:00",
        rating: 4.8,
        website360Link: "https://example.com/caolầuhộian360",
        alleyId: "alley-002"
    },
    {
        id: "poi-034",
        name: "Juice Bar Tươi",
        alleyName: "Hẻm 46 Hai Bà Trưng",
        category: "cafe",
        icon: "coffee",
        lat: 10.762299,
        lng: 106.694303,
        image: DEMO_IMAGES.coffee,
        description: "Quán juice bar tươi phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "10:00 – 22:30",
        rating: 4.8,
        website360Link: "https://example.com/juicebartươi360",
        alleyId: "alley-002"
    },
    {
        id: "poi-035",
        name: "Phở Bò Tái Lăn",
        alleyName: "Hẻm 43 Trần Hưng Đạo",
        category: "food",
        icon: "pho",
        lat: 10.765715,
        lng: 106.695803,
        image: DEMO_IMAGES.pho,
        description: "Quán phở bò tái lăn phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "15:00 – 24:00",
        rating: 5.0,
        website360Link: "https://example.com/phởbòtáilăn360",
        alleyId: "alley-003"
    },
    {
        id: "poi-036",
        name: "Nước Mía Tươi",
        alleyName: "Hẻm 55 Trần Hưng Đạo",
        category: "food",
        icon: "banhmi",
        lat: 10.771856,
        lng: 106.700894,
        image: DEMO_IMAGES.banhmi,
        description: "Quán nước mía tươi phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "15:00 – 24:00",
        rating: 4.2,
        website360Link: "https://example.com/nướcmíatươi360",
        alleyId: "alley-003"
    },
    {
        id: "poi-037",
        name: "Cà Phê Cộng",
        alleyName: "Hẻm 23 Đông Khởi",
        category: "food",
        icon: "fastfood",
        lat: 10.775371,
        lng: 106.695078,
        image: DEMO_IMAGES.fastfood,
        description: "Quán cà phê cộng phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "06:00 – 21:00",
        rating: 4.8,
        website360Link: "https://example.com/càphêcộng360",
        alleyId: "alley-003"
    },
    {
        id: "poi-038",
        name: "Chả Cá Nướng",
        alleyName: "Hẻm 10 Lý Tự Trọng",
        category: "food",
        icon: "pho",
        lat: 10.765321,
        lng: 106.699313,
        image: DEMO_IMAGES.pho,
        description: "Quán chả cá nướng phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "07:00 – 22:00",
        rating: 4.3,
        website360Link: "https://example.com/chảcánướng360",
        alleyId: "alley-004"
    },
    {
        id: "poi-039",
        name: "Tea House",
        alleyName: "Hẻm 53 Hai Bà Trưng",
        category: "cafe",
        icon: "coffee",
        lat: 10.772943,
        lng: 106.694766,
        image: DEMO_IMAGES.coffee,
        description: "Quán tea house phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "11:00 – 23:00",
        rating: 5.0,
        website360Link: "https://example.com/teahouse360",
        alleyId: "alley-004"
    },
    {
        id: "poi-040",
        name: "Bánh Mì Xíu Mại",
        alleyName: "Hẻm 13 Hai Bà Trưng",
        category: "food",
        icon: "pho",
        lat: 10.774650,
        lng: 106.692215,
        image: DEMO_IMAGES.pho,
        description: "Quán bánh mì xíu mại phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "07:00 – 22:00",
        rating: 4.0,
        website360Link: "https://example.com/bánhmìxíumại360",
        alleyId: "alley-005"
    },
    {
        id: "poi-041",
        name: "Cua Rang Me",
        alleyName: "Hẻm 14 Lý Tự Trọng",
        category: "food",
        icon: "xienban",
        lat: 10.771810,
        lng: 106.700012,
        image: DEMO_IMAGES.xienban,
        description: "Quán cua rang me phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "06:00 – 21:00",
        rating: 4.8,
        website360Link: "https://example.com/cuarangme360",
        alleyId: "alley-005"
    },
    {
        id: "poi-042",
        name: "Bánh Căn Mini",
        alleyName: "Hẻm 52 Hai Bà Trưng",
        category: "food",
        icon: "fastfood",
        lat: 10.766732,
        lng: 106.695374,
        image: DEMO_IMAGES.fastfood,
        description: "Quán bánh căn mini phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "11:00 – 23:00",
        rating: 4.7,
        website360Link: "https://example.com/bánhcănmini360",
        alleyId: "alley-005"
    },
    {
        id: "poi-043",
        name: "Sinh Tố Sapoche",
        alleyName: "Hẻm 37 Lý Tự Trọng",
        category: "food",
        icon: "nuong",
        lat: 10.762438,
        lng: 106.698583,
        image: DEMO_IMAGES.nuong,
        description: "Quán sinh tố sapoche phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "06:00 – 21:00",
        rating: 4.9,
        website360Link: "https://example.com/sinhtốsapoche360",
        alleyId: "alley-005"
    },
    {
        id: "poi-044",
        name: "Mì Xào Hải Sản",
        alleyName: "Hẻm 41 Nguyễn Huệ",
        category: "food",
        icon: "banhmi",
        lat: 10.764392,
        lng: 106.691567,
        image: DEMO_IMAGES.banhmi,
        description: "Quán mì xào hải sản phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "06:00 – 21:00",
        rating: 4.9,
        website360Link: "https://example.com/mìxàohảisản360",
        alleyId: "alley-005"
    },
    {
        id: "poi-045",
        name: "Garden Tea",
        alleyName: "Hẻm 34 Pasteur",
        category: "cafe",
        icon: "coffee",
        lat: 10.769391,
        lng: 106.699871,
        image: DEMO_IMAGES.coffee,
        description: "Quán garden tea phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "06:00 – 21:00",
        rating: 4.9,
        website360Link: "https://example.com/gardentea360",
        alleyId: "alley-005"
    },
    {
        id: "poi-046",
        name: "Bánh Bèo Huế",
        alleyName: "Hẻm 24 Trần Hưng Đạo",
        category: "food",
        icon: "pho",
        lat: 10.770264,
        lng: 106.687141,
        image: DEMO_IMAGES.pho,
        description: "Quán bánh bèo huế phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "10:00 – 22:30",
        rating: 4.4,
        website360Link: "https://example.com/bánhbèohuế360",
        alleyId: "alley-005"
    },
    {
        id: "poi-047",
        name: "Mì Tôm Trứng",
        alleyName: "Hẻm 43 Lý Tự Trọng",
        category: "food",
        icon: "bunbo",
        lat: 10.771104,
        lng: 106.698554,
        image: DEMO_IMAGES.bunbo,
        description: "Quán mì tôm trứng phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "07:00 – 22:00",
        rating: 4.1,
        website360Link: "https://example.com/mìtômtrứng360",
        alleyId: "alley-005"
    },
    {
        id: "poi-048",
        name: "Trà Atiso",
        alleyName: "Hẻm 42 Lê Thánh Tôn",
        category: "food",
        icon: "bunbo",
        lat: 10.771295,
        lng: 106.687765,
        image: DEMO_IMAGES.bunbo,
        description: "Quán trà atiso phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "11:00 – 23:00",
        rating: 4.9,
        website360Link: "https://example.com/tràatiso360",
        alleyId: "alley-005"
    },
    {
        id: "poi-049",
        name: "Bánh Bông Lan",
        alleyName: "Hẻm 15 Đông Khởi",
        category: "food",
        icon: "bunbo",
        lat: 10.762206,
        lng: 106.691396,
        image: DEMO_IMAGES.bunbo,
        description: "Quán bánh bông lan phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "15:00 – 24:00",
        rating: 3.9,
        website360Link: "https://example.com/bánhbônglan360",
        alleyId: "alley-005"
    },
    {
        id: "poi-050",
        name: "Cơm Hến Huế",
        alleyName: "Hẻm 55 Lý Tự Trọng",
        category: "food",
        icon: "pho",
        lat: 10.769704,
        lng: 106.693992,
        image: DEMO_IMAGES.pho,
        description: "Quán cơm hến huế phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "15:00 – 24:00",
        rating: 3.8,
        website360Link: "https://example.com/cơmhếnhuế360",
        alleyId: "alley-006"
    },
    {
        id: "poi-051",
        name: "Mì Tôm Trứng",
        alleyName: "Hẻm 38 Lê Thánh Tôn",
        category: "food",
        icon: "bunbo",
        lat: 10.761404,
        lng: 106.700603,
        image: DEMO_IMAGES.bunbo,
        description: "Quán mì tôm trứng phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "11:00 – 23:00",
        rating: 4.6,
        website360Link: "https://example.com/mìtômtrứng360",
        alleyId: "alley-006"
    },
    {
        id: "poi-052",
        name: "Vintage Cafe",
        alleyName: "Hẻm 41 Trần Hưng Đạo",
        category: "cafe",
        icon: "coffee",
        lat: 10.767849,
        lng: 106.696860,
        image: DEMO_IMAGES.coffee,
        description: "Quán vintage cafe phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "06:00 – 21:00",
        rating: 4.5,
        website360Link: "https://example.com/vintagecafe360",
        alleyId: "alley-006"
    },
    {
        id: "poi-053",
        name: "Smoothie Bowl",
        alleyName: "Hẻm 37 Pasteur",
        category: "cafe",
        icon: "coffee",
        lat: 10.765004,
        lng: 106.697974,
        image: DEMO_IMAGES.coffee,
        description: "Quán smoothie bowl phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "11:00 – 23:00",
        rating: 4.6,
        website360Link: "https://example.com/smoothiebowl360",
        alleyId: "alley-006"
    },
    {
        id: "poi-054",
        name: "Cà Phê Muối",
        alleyName: "Hẻm 49 Pasteur",
        category: "food",
        icon: "xienban",
        lat: 10.762813,
        lng: 106.689469,
        image: DEMO_IMAGES.xienban,
        description: "Quán cà phê muối phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "10:00 – 22:30",
        rating: 4.7,
        website360Link: "https://example.com/càphêmuối360",
        alleyId: "alley-006"
    },
    {
        id: "poi-055",
        name: "Trà Atiso",
        alleyName: "Hẻm 38 Đông Khởi",
        category: "food",
        icon: "nuong",
        lat: 10.773606,
        lng: 106.700001,
        image: DEMO_IMAGES.nuong,
        description: "Quán trà atiso phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "15:00 – 24:00",
        rating: 4.0,
        website360Link: "https://example.com/tràatiso360",
        alleyId: "alley-006"
    },
    {
        id: "poi-056",
        name: "Tea House",
        alleyName: "Hẻm 54 Nguyễn Huệ",
        category: "cafe",
        icon: "drink",
        lat: 10.767318,
        lng: 106.698197,
        image: DEMO_IMAGES.coffee,
        description: "Quán tea house phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "06:00 – 21:00",
        rating: 3.8,
        website360Link: "https://example.com/teahouse360",
        alleyId: "alley-006"
    },
    {
        id: "poi-057",
        name: "Coconut Water",
        alleyName: "Hẻm 23 Pasteur",
        category: "cafe",
        icon: "coffee",
        lat: 10.775388,
        lng: 106.695225,
        image: DEMO_IMAGES.coffee,
        description: "Quán coconut water phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "15:00 – 24:00",
        rating: 4.9,
        website360Link: "https://example.com/coconutwater360",
        alleyId: "alley-006"
    },
    {
        id: "poi-058",
        name: "Sinh Tố Sapoche",
        alleyName: "Hẻm 50 Lý Tự Trọng",
        category: "food",
        icon: "fastfood",
        lat: 10.765953,
        lng: 106.695552,
        image: DEMO_IMAGES.fastfood,
        description: "Quán sinh tố sapoche phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "07:00 – 22:00",
        rating: 4.2,
        website360Link: "https://example.com/sinhtốsapoche360",
        alleyId: "alley-006"
    },
    {
        id: "poi-059",
        name: "Mì Xào Hải Sản",
        alleyName: "Hẻm 54 Lê Thánh Tôn",
        category: "food",
        icon: "pho",
        lat: 10.774849,
        lng: 106.686175,
        image: DEMO_IMAGES.pho,
        description: "Quán mì xào hải sản phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "11:00 – 23:00",
        rating: 3.9,
        website360Link: "https://example.com/mìxàohảisản360",
        alleyId: "alley-006"
    },
    {
        id: "poi-060",
        name: "Xôi Lạp Xưởng",
        alleyName: "Hẻm 32 Lê Thánh Tôn",
        category: "food",
        icon: "fastfood",
        lat: 10.762256,
        lng: 106.699970,
        image: DEMO_IMAGES.fastfood,
        description: "Quán xôi lạp xưởng phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "07:00 – 22:00",
        rating: 4.0,
        website360Link: "https://example.com/xôilạpxưởng360",
        alleyId: "alley-007"
    },
    {
        id: "poi-061",
        name: "Nước Chanh Leo",
        alleyName: "Hẻm 33 Lê Thánh Tôn",
        category: "food",
        icon: "pho",
        lat: 10.763560,
        lng: 106.688913,
        image: DEMO_IMAGES.pho,
        description: "Quán nước chanh leo phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "07:00 – 22:00",
        rating: 4.5,
        website360Link: "https://example.com/nướcchanhleo360",
        alleyId: "alley-007"
    },
    {
        id: "poi-062",
        name: "Sinh Tố Bơ",
        alleyName: "Hẻm 53 Hai Bà Trưng",
        category: "food",
        icon: "banhmi",
        lat: 10.770487,
        lng: 106.698176,
        image: DEMO_IMAGES.banhmi,
        description: "Quán sinh tố bơ phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "10:00 – 22:30",
        rating: 4.9,
        website360Link: "https://example.com/sinhtốbơ360",
        alleyId: "alley-007"
    },
    {
        id: "poi-063",
        name: "Nước Chanh Leo",
        alleyName: "Hẻm 20 Pasteur",
        category: "food",
        icon: "bunbo",
        lat: 10.765823,
        lng: 106.698986,
        image: DEMO_IMAGES.bunbo,
        description: "Quán nước chanh leo phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "06:00 – 21:00",
        rating: 3.9,
        website360Link: "https://example.com/nướcchanhleo360",
        alleyId: "alley-007"
    },
    {
        id: "poi-064",
        name: "Bánh Đa Cua",
        alleyName: "Hẻm 14 Pasteur",
        category: "food",
        icon: "banhmi",
        lat: 10.767403,
        lng: 106.698289,
        image: DEMO_IMAGES.banhmi,
        description: "Quán bánh đa cua phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "06:00 – 21:00",
        rating: 4.4,
        website360Link: "https://example.com/bánhđacua360",
        alleyId: "alley-007"
    },
    {
        id: "poi-065",
        name: "Thịt Nướng Xiên Que",
        alleyName: "Hẻm 34 Đông Khởi",
        category: "food",
        icon: "fastfood",
        lat: 10.775341,
        lng: 106.700042,
        image: DEMO_IMAGES.fastfood,
        description: "Quán thịt nướng xiên que phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "06:00 – 21:00",
        rating: 4.1,
        website360Link: "https://example.com/thịtnướngxiênque360",
        alleyId: "alley-007"
    },
    {
        id: "poi-066",
        name: "Yaourt Dẻo",
        alleyName: "Hẻm 41 Đông Khởi",
        category: "food",
        icon: "bunbo",
        lat: 10.771475,
        lng: 106.693995,
        image: DEMO_IMAGES.bunbo,
        description: "Quán yaourt dẻo phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "06:00 – 21:00",
        rating: 4.9,
        website360Link: "https://example.com/yaourtdẻo360",
        alleyId: "alley-007"
    },
    {
        id: "poi-067",
        name: "Garden Tea",
        alleyName: "Hẻm 45 Đông Khởi",
        category: "cafe",
        icon: "coffee",
        lat: 10.765181,
        lng: 106.698861,
        image: DEMO_IMAGES.coffee,
        description: "Quán garden tea phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "10:00 – 22:30",
        rating: 3.8,
        website360Link: "https://example.com/gardentea360",
        alleyId: "alley-007"
    },
    {
        id: "poi-068",
        name: "Phở Xào Thịt Bò",
        alleyName: "Hẻm 50 Trần Hưng Đạo",
        category: "food",
        icon: "fastfood",
        lat: 10.768344,
        lng: 106.699388,
        image: DEMO_IMAGES.fastfood,
        description: "Quán phở xào thịt bò phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "10:00 – 22:30",
        rating: 4.1,
        website360Link: "https://example.com/phởxàothịtbò360",
        alleyId: "alley-007"
    },
    {
        id: "poi-069",
        name: "Tea House",
        alleyName: "Hẻm 27 Lý Tự Trọng",
        category: "cafe",
        icon: "coffee",
        lat: 10.769552,
        lng: 106.696843,
        image: DEMO_IMAGES.coffee,
        description: "Quán tea house phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "07:00 – 22:00",
        rating: 4.5,
        website360Link: "https://example.com/teahouse360",
        alleyId: "alley-007"
    },
    {
        id: "poi-070",
        name: "Bánh Mì Ốp La",
        alleyName: "Hẻm 48 Hai Bà Trưng",
        category: "food",
        icon: "xienban",
        lat: 10.773585,
        lng: 106.698890,
        image: DEMO_IMAGES.xienban,
        description: "Quán bánh mì ốp la phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "06:00 – 21:00",
        rating: 3.8,
        website360Link: "https://example.com/bánhmìốpla360",
        alleyId: "alley-008"
    },
    {
        id: "poi-071",
        name: "Coffee Bean",
        alleyName: "Hẻm 50 Lý Tự Trọng",
        category: "cafe",
        icon: "drink",
        lat: 10.762655,
        lng: 106.688053,
        image: DEMO_IMAGES.coffee,
        description: "Quán coffee bean phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "15:00 – 24:00",
        rating: 4.5,
        website360Link: "https://example.com/coffeebean360",
        alleyId: "alley-008"
    },
    {
        id: "poi-072",
        name: "Cháo Cá Chép",
        alleyName: "Hẻm 31 Pasteur",
        category: "food",
        icon: "bunbo",
        lat: 10.767391,
        lng: 106.686748,
        image: DEMO_IMAGES.bunbo,
        description: "Quán cháo cá chép phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "07:00 – 22:00",
        rating: 4.2,
        website360Link: "https://example.com/cháocáchép360",
        alleyId: "alley-008"
    },
    {
        id: "poi-073",
        name: "Bún Xào Nam Bộ",
        alleyName: "Hẻm 14 Hai Bà Trưng",
        category: "food",
        icon: "pho",
        lat: 10.765267,
        lng: 106.700434,
        image: DEMO_IMAGES.pho,
        description: "Quán bún xào nam bộ phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "10:00 – 22:30",
        rating: 4.7,
        website360Link: "https://example.com/búnxàonambộ360",
        alleyId: "alley-008"
    },
    {
        id: "poi-074",
        name: "Ghẹ Rang Muối",
        alleyName: "Hẻm 57 Hai Bà Trưng",
        category: "food",
        icon: "bunbo",
        lat: 10.770215,
        lng: 106.687696,
        image: DEMO_IMAGES.bunbo,
        description: "Quán ghẹ rang muối phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "07:00 – 22:00",
        rating: 4.7,
        website360Link: "https://example.com/ghẹrangmuối360",
        alleyId: "alley-008"
    },
    {
        id: "poi-075",
        name: "Thịt Nướng Xiên Que",
        alleyName: "Hẻm 55 Đông Khởi",
        category: "food",
        icon: "nuong",
        lat: 10.770069,
        lng: 106.700420,
        image: DEMO_IMAGES.nuong,
        description: "Quán thịt nướng xiên que phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "10:00 – 22:30",
        rating: 5.0,
        website360Link: "https://example.com/thịtnướngxiênque360",
        alleyId: "alley-008"
    },
    {
        id: "poi-076",
        name: "Ốc Hương Xào Dừa",
        alleyName: "Hẻm 18 Pasteur",
        category: "food",
        icon: "banhmi",
        lat: 10.766903,
        lng: 106.687061,
        image: DEMO_IMAGES.banhmi,
        description: "Quán ốc hương xào dừa phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "06:00 – 21:00",
        rating: 5.0,
        website360Link: "https://example.com/ốchươngxàodừa360",
        alleyId: "alley-008"
    },
    {
        id: "poi-077",
        name: "Cơm Chiên Dương Châu",
        alleyName: "Hẻm 44 Pasteur",
        category: "food",
        icon: "fastfood",
        lat: 10.771075,
        lng: 106.697965,
        image: DEMO_IMAGES.fastfood,
        description: "Quán cơm chiên dương châu phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "15:00 – 24:00",
        rating: 4.8,
        website360Link: "https://example.com/cơmchiêndươngchâu360",
        alleyId: "alley-008"
    },
    {
        id: "poi-078",
        name: "Garden Tea",
        alleyName: "Hẻm 52 Trần Hưng Đạo",
        category: "cafe",
        icon: "coffee",
        lat: 10.774012,
        lng: 106.690498,
        image: DEMO_IMAGES.coffee,
        description: "Quán garden tea phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "11:00 – 23:00",
        rating: 3.9,
        website360Link: "https://example.com/gardentea360",
        alleyId: "alley-008"
    },
    {
        id: "poi-079",
        name: "Garden Tea",
        alleyName: "Hẻm 42 Nguyễn Huệ",
        category: "cafe",
        icon: "coffee",
        lat: 10.775454,
        lng: 106.695138,
        image: DEMO_IMAGES.coffee,
        description: "Quán garden tea phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "11:00 – 23:00",
        rating: 4.7,
        website360Link: "https://example.com/gardentea360",
        alleyId: "alley-008"
    },
    {
        id: "poi-080",
        name: "Cà Phê Cộng",
        alleyName: "Hẻm 43 Trần Hưng Đạo",
        category: "food",
        icon: "xienban",
        lat: 10.767570,
        lng: 106.699757,
        image: DEMO_IMAGES.xienban,
        description: "Quán cà phê cộng phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "15:00 – 24:00",
        rating: 3.9,
        website360Link: "https://example.com/càphêcộng360",
        alleyId: "alley-001"
    },
    {
        id: "poi-081",
        name: "Bánh Canh Chả Cá",
        alleyName: "Hẻm 19 Trần Hưng Đạo",
        category: "food",
        icon: "bunbo",
        lat: 10.766756,
        lng: 106.690657,
        image: DEMO_IMAGES.bunbo,
        description: "Quán bánh canh chả cá phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "06:00 – 21:00",
        rating: 4.3,
        website360Link: "https://example.com/bánhcanhchảcá360",
        alleyId: "alley-001"
    },
    {
        id: "poi-082",
        name: "Cơm Chiên Dương Châu",
        alleyName: "Hẻm 37 Trần Hưng Đạo",
        category: "food",
        icon: "xienban",
        lat: 10.764402,
        lng: 106.688037,
        image: DEMO_IMAGES.xienban,
        description: "Quán cơm chiên dương châu phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "07:00 – 22:00",
        rating: 4.7,
        website360Link: "https://example.com/cơmchiêndươngchâu360",
        alleyId: "alley-001"
    },
    {
        id: "poi-083",
        name: "Bánh Khoái Huế",
        alleyName: "Hẻm 36 Lý Tự Trọng",
        category: "food",
        icon: "nuong",
        lat: 10.771461,
        lng: 106.697727,
        image: DEMO_IMAGES.nuong,
        description: "Quán bánh khoái huế phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "11:00 – 23:00",
        rating: 4.1,
        website360Link: "https://example.com/bánhkhoáihuế360",
        alleyId: "alley-001"
    },
    {
        id: "poi-084",
        name: "Garden Tea",
        alleyName: "Hẻm 28 Lê Thánh Tôn",
        category: "cafe",
        icon: "drink",
        lat: 10.762909,
        lng: 106.689410,
        image: DEMO_IMAGES.coffee,
        description: "Quán garden tea phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "11:00 – 23:00",
        rating: 4.1,
        website360Link: "https://example.com/gardentea360",
        alleyId: "alley-001"
    },
    {
        id: "poi-085",
        name: "Mực Nướng Sa Tế",
        alleyName: "Hẻm 25 Hai Bà Trưng",
        category: "food",
        icon: "pho",
        lat: 10.770120,
        lng: 106.691277,
        image: DEMO_IMAGES.pho,
        description: "Quán mực nướng sa tế phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "07:00 – 22:00",
        rating: 4.0,
        website360Link: "https://example.com/mựcnướngsatế360",
        alleyId: "alley-001"
    },
    {
        id: "poi-086",
        name: "Milk Tea Corner",
        alleyName: "Hẻm 46 Đông Khởi",
        category: "cafe",
        icon: "coffee",
        lat: 10.772772,
        lng: 106.695982,
        image: DEMO_IMAGES.coffee,
        description: "Quán milk tea corner phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "11:00 – 23:00",
        rating: 4.6,
        website360Link: "https://example.com/milkteacorner360",
        alleyId: "alley-001"
    },
    {
        id: "poi-087",
        name: "Bún Chả Cá",
        alleyName: "Hẻm 35 Nguyễn Huệ",
        category: "food",
        icon: "pho",
        lat: 10.774452,
        lng: 106.687057,
        image: DEMO_IMAGES.pho,
        description: "Quán bún chả cá phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "15:00 – 24:00",
        rating: 4.9,
        website360Link: "https://example.com/búnchảcá360",
        alleyId: "alley-001"
    },
    {
        id: "poi-088",
        name: "Matcha Latte",
        alleyName: "Hẻm 30 Lê Thánh Tôn",
        category: "food",
        icon: "pho",
        lat: 10.761976,
        lng: 106.694587,
        image: DEMO_IMAGES.pho,
        description: "Quán matcha latte phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "10:00 – 22:30",
        rating: 4.5,
        website360Link: "https://example.com/matchalatte360",
        alleyId: "alley-001"
    },
    {
        id: "poi-089",
        name: "Bánh Ít Lá Gai",
        alleyName: "Hẻm 53 Lý Tự Trọng",
        category: "food",
        icon: "pho",
        lat: 10.774568,
        lng: 106.690037,
        image: DEMO_IMAGES.pho,
        description: "Quán bánh ít lá gai phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "10:00 – 22:30",
        rating: 4.1,
        website360Link: "https://example.com/bánhítlágai360",
        alleyId: "alley-001"
    },
    {
        id: "poi-090",
        name: "Ghẹ Rang Muối",
        alleyName: "Hẻm 51 Lê Thánh Tôn",
        category: "food",
        icon: "xienban",
        lat: 10.771043,
        lng: 106.690740,
        image: DEMO_IMAGES.xienban,
        description: "Quán ghẹ rang muối phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "06:00 – 21:00",
        rating: 3.8,
        website360Link: "https://example.com/ghẹrangmuối360",
        alleyId: "alley-010"
    },
    {
        id: "poi-091",
        name: "Smoothie Bowl",
        alleyName: "Hẻm 12 Lê Thánh Tôn",
        category: "cafe",
        icon: "drink",
        lat: 10.768371,
        lng: 106.690515,
        image: DEMO_IMAGES.coffee,
        description: "Quán smoothie bowl phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "11:00 – 23:00",
        rating: 4.9,
        website360Link: "https://example.com/smoothiebowl360",
        alleyId: "alley-010"
    },
    {
        id: "poi-092",
        name: "Bánh Xèo Miền Tây",
        alleyName: "Hẻm 41 Trần Hưng Đạo",
        category: "food",
        icon: "xienban",
        lat: 10.761118,
        lng: 106.689379,
        image: DEMO_IMAGES.xienban,
        description: "Quán bánh xèo miền tây phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "10:00 – 22:30",
        rating: 4.6,
        website360Link: "https://example.com/bánhxèomiềntây360",
        alleyId: "alley-010"
    },
    {
        id: "poi-093",
        name: "Fresh Juice Station",
        alleyName: "Hẻm 45 Đông Khởi",
        category: "cafe",
        icon: "coffee",
        lat: 10.764979,
        lng: 106.686333,
        image: DEMO_IMAGES.coffee,
        description: "Quán fresh juice station phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "11:00 – 23:00",
        rating: 4.0,
        website360Link: "https://example.com/freshjuicestation360",
        alleyId: "alley-010"
    },
    {
        id: "poi-094",
        name: "Xôi Lạp Xưởng",
        alleyName: "Hẻm 15 Trần Hưng Đạo",
        category: "food",
        icon: "banhmi",
        lat: 10.769002,
        lng: 106.690990,
        image: DEMO_IMAGES.banhmi,
        description: "Quán xôi lạp xưởng phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "07:00 – 22:00",
        rating: 4.1,
        website360Link: "https://example.com/xôilạpxưởng360",
        alleyId: "alley-010"
    },
    {
        id: "poi-095",
        name: "Bánh Khọt Vũng Tàu",
        alleyName: "Hẻm 52 Hai Bà Trưng",
        category: "food",
        icon: "bunbo",
        lat: 10.763761,
        lng: 106.695740,
        image: DEMO_IMAGES.bunbo,
        description: "Quán bánh khọt vũng tàu phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "06:00 – 21:00",
        rating: 4.0,
        website360Link: "https://example.com/bánhkhọtvũngtàu360",
        alleyId: "alley-010"
    },
    {
        id: "poi-096",
        name: "Garden Tea",
        alleyName: "Hẻm 43 Pasteur",
        category: "cafe",
        icon: "drink",
        lat: 10.769941,
        lng: 106.689730,
        image: DEMO_IMAGES.coffee,
        description: "Quán garden tea phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "11:00 – 23:00",
        rating: 4.6,
        website360Link: "https://example.com/gardentea360",
        alleyId: "alley-010"
    },
    {
        id: "poi-097",
        name: "Bánh Căn Phan Thiết",
        alleyName: "Hẻm 38 Nguyễn Huệ",
        category: "food",
        icon: "fastfood",
        lat: 10.775834,
        lng: 106.694935,
        image: DEMO_IMAGES.fastfood,
        description: "Quán bánh căn phan thiết phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "07:00 – 22:00",
        rating: 5.0,
        website360Link: "https://example.com/bánhcănphanthiết360",
        alleyId: "alley-010"
    },
    {
        id: "poi-098",
        name: "Coffee Bean",
        alleyName: "Hẻm 59 Đông Khởi",
        category: "cafe",
        icon: "drink",
        lat: 10.764144,
        lng: 106.695788,
        image: DEMO_IMAGES.coffee,
        description: "Quán coffee bean phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "11:00 – 23:00",
        rating: 4.7,
        website360Link: "https://example.com/coffeebean360",
        alleyId: "alley-010"
    },
    {
        id: "poi-099",
        name: "Matcha Latte",
        alleyName: "Hẻm 53 Hai Bà Trưng",
        category: "food",
        icon: "xienban",
        lat: 10.768026,
        lng: 106.698713,
        image: DEMO_IMAGES.xienban,
        description: "Quán matcha latte phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "06:00 – 21:00",
        rating: 4.2,
        website360Link: "https://example.com/matchalatte360",
        alleyId: "alley-010"
    },
    {
        id: "poi-100",
        name: "Coffee Bean",
        alleyName: "Hẻm 58 Lý Tự Trọng",
        category: "cafe",
        icon: "coffee",
        lat: 10.767437,
        lng: 106.692286,
        image: DEMO_IMAGES.coffee,
        description: "Quán coffee bean phong cách truyền thống Sài Gòn với hương vị đặc trưng miền Nam.",
        openHours: "11:00 – 23:00",
        rating: 4.4,
        website360Link: "https://example.com/coffeebean360",
        alleyId: "alley-011"
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
                        poiId: "poi-007",
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
    },
    {
        alleyId: "alley-003",
        alleyName: "Hẻm 12 Nguyễn Thái Học",
        scenes: [
            {
                sceneId: "scene-007",
                sceneName: "Đầu hẻm 12 Nguyễn Thái Học",
                panorama: DEMO_PANORAMAS.street1,
                northOffset: 0,
                links: [
                    {
                        targetSceneId: "scene-008",
                        yaw: 180,
                        pitch: -15,
                        type: "forward"
                    }
                ],
                hotspots: [
                    {
                        poiId: "poi-006",
                        yaw: 30,
                        pitch: 5
                    }
                ]
            },
            {
                sceneId: "scene-008",
                sceneName: "Giữa hẻm 12",
                panorama: DEMO_PANORAMAS.street2,
                northOffset: 0,
                links: [
                    { targetSceneId: "scene-007", yaw: 0, pitch: -15, type: "back" },
                    { targetSceneId: "scene-009", yaw: 180, pitch: -15, type: "forward" }
                ],
                hotspots: [
                    {
                        poiId: "poi-008",
                        yaw: -45,
                        pitch: 8
                    }
                ]
            },
            {
                sceneId: "scene-009",
                sceneName: "Cuối hẻm 12",
                panorama: DEMO_PANORAMAS.street3,
                northOffset: 0,
                links: [
                    { targetSceneId: "scene-008", yaw: 0, pitch: -15, type: "back" }
                ],
                hotspots: [
                    {
                        poiId: "poi-011",
                        yaw: 60,
                        pitch: 10
                    }
                ]
            }
        ]
    },
    {
        alleyId: "alley-004",
        alleyName: "Hẻm 29 Lý Tự Trọng",
        scenes: [
            {
                sceneId: "scene-010",
                sceneName: "Đầu hẻm 29 Lý Tự Trọng",
                panorama: DEMO_PANORAMAS.indoor1,
                northOffset: 0,
                links: [
                    {
                        targetSceneId: "scene-011",
                        yaw: 180,
                        pitch: -15,
                        type: "forward"
                    }
                ],
                hotspots: [
                    {
                        poiId: "poi-009",
                        yaw: -30,
                        pitch: 5
                    }
                ]
            },
            {
                sceneId: "scene-011",
                sceneName: "Giữa hẻm 29",
                panorama: DEMO_PANORAMAS.indoor2,
                northOffset: 0,
                links: [
                    { targetSceneId: "scene-010", yaw: 0, pitch: -15, type: "back" },
                    { targetSceneId: "scene-012", yaw: 180, pitch: -15, type: "forward" }
                ],
                hotspots: [
                    {
                        poiId: "poi-010",
                        yaw: 45,
                        pitch: 8
                    }
                ]
            },
            {
                sceneId: "scene-012",
                sceneName: "Cuối hẻm 29",
                panorama: DEMO_PANORAMAS.indoor3,
                northOffset: 0,
                links: [
                    { targetSceneId: "scene-011", yaw: 0, pitch: -15, type: "back" }
                ],
                hotspots: [
                    {
                        poiId: "poi-012",
                        yaw: -60,
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
        cafe: 'Cafe'
    };
    return labels[category] || category;
}
