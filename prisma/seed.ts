import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 🔥 Xoá dữ liệu cũ để seed lại cho sạch
  await prisma.property.deleteMany();
  await prisma.project.deleteMany();

  // ✅ Tạo danh sách dự án
  await prisma.project.createMany({
    data: [
      {
        name: "EcoPark",
        slug: "ecopark",
        description: "Khu đô thị sinh thái xanh tại Hưng Yên.",
        imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=60",
      },
      {
        name: "Vinhomes Riverside",
        slug: "vinhomes-riverside",
        description: "Khu biệt thự cao cấp ven sông tại Long Biên, Hà Nội.",
        imageUrl: "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d55?auto=format&fit=crop&w=1200&q=60",
      },
      {
        name: "Masteri Thảo Điền",
        slug: "masteri-thao-dien",
        description: "Căn hộ cao cấp tại Quận 2, TP.HCM.",
        imageUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=60",
      },
    ],
  });

  // ✅ 12 bất động sản gốc (đã thêm ảnh) + 5 bất động sản mới
  await prisma.property.createMany({
    data: [
      // === Căn hộ (BUY) ===
      {
        title: "Căn hộ 2PN view sông EcoPark",
        description: "Căn hộ tầng 10, full nội thất, view sông.",
        price: 3200000000,
        area: 85,
        address: "EcoPark, Văn Giang, Hưng Yên",
        ward: "Xuân Quan",
        district: "Văn Giang",
        city: "Hưng Yên",
        propertyType: "can-ho",
        purpose: "buy",
        status: "available",
        bedrooms: 2,
        bathrooms: 2,
        floors: 10,
        legal: "Sổ hồng",
        direction: "Đông Nam",
        images: [
          "https://images.unsplash.com/photo-1600607687920-4ce8c559d8df?auto=format&fit=crop&w=1200&q=60",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=60",
        ],
        highlights: ["View sông", "Đầy đủ nội thất"],
        projectSlug: "ecopark",
      },
      {
        title: "Căn hộ Masteri Thảo Điền 3PN",
        description: "Căn góc, view Landmark 81.",
        price: 5500000000,
        area: 100,
        address: "159 Xa lộ Hà Nội, Quận 2",
        ward: "Thảo Điền",
        district: "Quận 2",
        city: "TP.HCM",
        propertyType: "can-ho",
        purpose: "buy",
        status: "available",
        bedrooms: 3,
        bathrooms: 2,
        floors: 22,
        legal: "Sổ hồng",
        direction: "Tây Bắc",
        images: [
          "https://images.unsplash.com/photo-1505692794403-34d4982d1d50?auto=format&fit=crop&w=1200&q=60",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=60",
        ],
        highlights: ["View Landmark 81", "Căn góc"],
        projectSlug: "masteri-thao-dien",
      },

      // === Nhà riêng (BUY) ===
      {
        title: "Nhà phố Vinhomes Riverside 5x20m",
        description: "Nhà 3 tầng, sân vườn, gara ô tô.",
        price: 12500000000,
        area: 100,
        address: "Long Biên, Hà Nội",
        ward: "Việt Hưng",
        district: "Long Biên",
        city: "Hà Nội",
        propertyType: "nha-rieng",
        purpose: "buy",
        status: "available",
        bedrooms: 4,
        bathrooms: 4,
        floors: 3,
        legal: "Sổ đỏ",
        direction: "Nam",
        images: [
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=60",
          "https://images.unsplash.com/photo-1560185127-6ec5d591d07e?auto=format&fit=crop&w=1200&q=60",
        ],
        highlights: ["Gara ô tô", "Sân vườn"],
        projectSlug: "vinhomes-riverside",
      },
      {
        title: "Nhà riêng quận 12, gần Metro",
        description: "Nhà mới xây, hẻm xe hơi, sổ hồng riêng.",
        price: 3900000000,
        area: 75,
        address: "Quận 12, TP.HCM",
        ward: "Tân Thới Hiệp",
        district: "Quận 12",
        city: "TP.HCM",
        propertyType: "nha-rieng",
        purpose: "buy",
        status: "available",
        bedrooms: 3,
        bathrooms: 2,
        floors: 2,
        legal: "Sổ hồng",
        direction: "Đông Bắc",
        images: [
          "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=60",
          "https://images.unsplash.com/photo-1502005229762-cf1b2da7c08e?auto=format&fit=crop&w=1200&q=60",
        ],
        highlights: ["Gần Metro", "Nhà mới xây"],
        projectSlug: null,
      },

      // === Đất nền (BUY) ===
      {
        title: "Đất nền khu công nghiệp Long Hậu",
        description: "Nền vuông đẹp, đường 12m, đã có sổ.",
        price: 2100000000,
        area: 100,
        address: "Long Hậu, Cần Giuộc, Long An",
        ward: "Long Hậu",
        district: "Cần Giuộc",
        city: "Long An",
        propertyType: "dat-nen",
        purpose: "buy",
        status: "available",
        legal: "Sổ đỏ",
        direction: "Tây",
        images: [
          "https://images.unsplash.com/photo-1570126646281-5ec88111777f?auto=format&fit=crop&w=1200&q=60",
          "https://images.unsplash.com/photo-1570126646281-5ec88111777f?auto=format&fit=crop&w=1200&q=60",
        ],
        highlights: ["Đường rộng", "Khu dân cư hiện hữu"],
        projectSlug: null,
      },
      {
        title: "Đất nền khu công nghiệp Nhơn Trạch",
        description: "Lô góc 2 mặt tiền, gần cảng.",
        price: 3300000000,
        area: 120,
        address: "Nhơn Trạch, Đồng Nai",
        propertyType: "dat-nen",
        purpose: "buy",
        status: "available",
        legal: "Sổ đỏ",
        direction: "Bắc",
        images: [
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=60",
          "https://images.unsplash.com/photo-1542315192-1f61a1926a61?auto=format&fit=crop&w=1200&q=60",
        ],
        highlights: ["2 mặt tiền", "Gần cảng"],
        projectSlug: null,
      },

      // === Phòng trọ (RENT) ===
      {
        title: "Phòng trọ sinh viên Quận 10",
        description: "Có gác, máy lạnh, vệ sinh riêng.",
        price: 3500000,
        area: 18,
        address: "Đường 3/2, Quận 10",
        propertyType: "phong-tro",
        purpose: "rent",
        status: "available",
        bedrooms: 1,
        bathrooms: 1,
        floors: 1,
        direction: "Nam",
        images: [
          "https://images.unsplash.com/photo-1616594039964-a6b8c2db9253?auto=format&fit=crop&w=1200&q=60",
          "https://images.unsplash.com/photo-1616594039974-c2ff1d6b1c5d?auto=format&fit=crop&w=1200&q=60",
        ],
        highlights: ["Có máy lạnh", "Vệ sinh riêng"],
        projectSlug: null,
      },
      {
        title: "Phòng trọ giá rẻ Thủ Đức",
        description: "Khu an ninh, gần ĐH Quốc Gia.",
        price: 2800000,
        area: 16,
        address: "Linh Trung, Thủ Đức",
        propertyType: "phong-tro",
        purpose: "rent",
        status: "available",
        direction: "Đông",
        images: [
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=60",
          "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=60",
        ],
        highlights: ["Gần ĐHQG", "Khu an ninh"],
        projectSlug: null,
      },

      // === Nhà xưởng (RENT/BUY) ===
      {
        title: "Cho thuê nhà xưởng KCN Tân Bình",
        description: "Diện tích 1000m², trần cao, container vào được.",
        price: 120000000,
        area: 1000,
        address: "Tân Bình, TP.HCM",
        propertyType: "nha-xuong",
        purpose: "rent",
        status: "available",
        floors: 1,
        legal: "Hợp đồng thuê",
        direction: "Tây Bắc",
        images: [
          "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1200&q=60",
          "https://images.unsplash.com/photo-1581091870622-7b9b4d9e8a0e?auto=format&fit=crop&w=1200&q=60",
        ],
        highlights: ["Xe container vào", "KCN Tân Bình"],
        projectSlug: null,
      },
      {
        title: "Bán nhà xưởng tại KCN Sóng Thần",
        description: "Sổ đỏ, 2 mặt tiền, DT 2000m²",
        price: 15000000000,
        area: 2000,
        address: "Dĩ An, Bình Dương",
        propertyType: "nha-xuong",
        purpose: "buy",
        status: "available",
        direction: "Đông Nam",
        legal: "Sổ đỏ",
        images: [
          "https://images.unsplash.com/photo-1564959123886-7f63b9fbf2b3?auto=format&fit=crop&w=1200&q=60",
          "https://images.unsplash.com/photo-1581091215367-59ab36cd7c86?auto=format&fit=crop&w=1200&q=60",
        ],
        highlights: ["2 mặt tiền", "Gần quốc lộ 1K"],
        projectSlug: null,
      },

      // === BĐS không thuộc dự án (BUY) ===
      {
        title: "Căn hộ mini Quận 7, view sông",
        description: "Full nội thất, ban công thoáng, lầu 3",
        price: 2100000000,
        area: 50,
        address: "Tân Thuận Tây, Quận 7",
        propertyType: "can-ho",
        purpose: "buy",
        status: "available",
        bedrooms: 2,
        bathrooms: 1,
        direction: "Nam",
        images: [
          "https://images.unsplash.com/photo-1600585154154-1e7485dff56b?auto=format&fit=crop&w=1200&q=60",
          "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=60",
        ],
        highlights: ["View sông", "Giá tốt"],
        projectSlug: null,
      },

      // ======================
      // 5 BẤT ĐỘNG SẢN MỚI BỔ SUNG
      // ======================

      // 1) Căn hộ cho thuê (RENT)
      {
        title: "Căn hộ studio Quận 1 cho thuê",
        description: "Full nội thất, trung tâm, dọn vào ở ngay.",
        price: 12000000,
        area: 32,
        address: "Nguyễn Thị Minh Khai, Quận 1",
        propertyType: "can-ho",
        purpose: "rent",
        status: "available",
        bedrooms: 1,
        bathrooms: 1,
        direction: "Đông Nam",
        images: [
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb2?auto=format&fit=crop&w=1200&q=60",
          "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=60",
        ],
        highlights: ["Ngay trung tâm", "Full nội thất"],
        projectSlug: null,
      },

      // 2) Nhà riêng cho thuê (RENT)
      {
        title: "Nhà nguyên căn Gò Vấp cho thuê",
        description: "1 trệt 1 lầu, hẻm xe hơi, gần trường học.",
        price: 17000000,
        area: 80,
        address: "Phan Huy Ích, Gò Vấp",
        propertyType: "nha-rieng",
        purpose: "rent",
        status: "available",
        bedrooms: 3,
        bathrooms: 2,
        direction: "Tây",
        images: [
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=60",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=60",
        ],
        highlights: ["Hẻm xe hơi", "Khu dân cư an ninh"],
        projectSlug: null,
      },

      // 3) Đất nền (BUY) – thêm mẫu khác
      {
        title: "Đất nền khu dân cư Long Thành",
        description: "Lô đẹp, gần cao tốc, tiềm năng tăng giá.",
        price: 1900000000,
        area: 95,
        address: "Long Thành, Đồng Nai",
        propertyType: "dat-nen",
        purpose: "buy",
        status: "available",
        legal: "Sổ đỏ",
        direction: "Đông Bắc",
        images: [
          "https://images.unsplash.com/photo-1523419409543-018a9f1d940b?auto=format&fit=crop&w=1200&q=60",
          "https://images.unsplash.com/photo-1542315192-1f61a1926a61?auto=format&fit=crop&w=1200&q=60",
        ],
        highlights: ["Gần cao tốc", "Khu dân cư hiện hữu"],
        projectSlug: null,
      },

      // 4) Nhà xưởng cho thuê (RENT) – bổ sung
      {
        title: "Cho thuê kho xưởng Bình Chánh",
        description: "DT 1500m², PCCC chuẩn, xe container ra vào 24/7.",
        price: 180000000,
        area: 1500,
        address: "Bình Chánh, TP.HCM",
        propertyType: "nha-xuong",
        purpose: "rent",
        status: "available",
        floors: 1,
        direction: "Bắc",
        images: [
          "https://images.unsplash.com/photo-1581090123130-5a9d3f1d7bdf?auto=format&fit=crop&w=1200&q=60",
          "https://images.unsplash.com/photo-1581091216770-5d1b5c2e9b2c?auto=format&fit=crop&w=1200&q=60",
        ],
        highlights: ["PCCC chuẩn", "Container 24/7"],
        projectSlug: null,
      },

      // 5) Căn hộ thuộc dự án (BUY) – liên kết Project
      {
        title: "Căn hộ EcoPark 1PN giá tốt",
        description: "Nội thất cơ bản, ban công thoáng, tiện ích đầy đủ.",
        price: 2100000000,
        area: 48,
        address: "EcoPark, Văn Giang, Hưng Yên",
        ward: "Xuân Quan",
        district: "Văn Giang",
        city: "Hưng Yên",
        propertyType: "can-ho",
        purpose: "buy",
        status: "available",
        bedrooms: 1,
        bathrooms: 1,
        direction: "Nam",
        images: [
          "https://images.unsplash.com/photo-1582582621958-cdb66f1b1b03?auto=format&fit=crop&w=1200&q=60",
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=60",
        ],
        highlights: ["Tiện ích đầy đủ", "Ban công thoáng"],
        projectSlug: "ecopark",
      },
    ],
  });

  console.log("✅ Seed dữ liệu thành công! (17 bất động sản + 3 dự án)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
