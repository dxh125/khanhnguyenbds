import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 🔥 Xoá dữ liệu cũ
  await prisma.property.deleteMany();
  await prisma.project.deleteMany();

  // ✅ Tạo danh sách dự án
  await prisma.project.createMany({
    data: [
      {
        name: "EcoPark",
        slug: "ecopark",
        description: "Khu đô thị sinh thái xanh tại Hưng Yên.",
        imageUrl: "https://example.com/ecopark.jpg",
      },
      {
        name: "Vinhomes Riverside",
        slug: "vinhomes-riverside",
        description: "Khu biệt thự cao cấp ven sông tại Long Biên, Hà Nội.",
        imageUrl: "https://example.com/vinhomes.jpg",
      },
      {
        name: "Masteri Thảo Điền",
        slug: "masteri-thao-dien",
        description: "Căn hộ cao cấp tại Quận 2, TP.HCM.",
        imageUrl: "https://example.com/masteri.jpg",
      },
    ],
  });

  // ✅ Tạo 12 bất động sản mẫu
  await prisma.property.createMany({
    data: [
      // === Căn hộ ===
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
        images: [],
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
        images: [],
        highlights: ["View Landmark 81", "Căn góc"],
        projectSlug: "masteri-thao-dien",
      },

      // === Nhà riêng ===
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
        images: [],
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
        images: [],
        highlights: ["Gần Metro", "Nhà mới xây"],
        projectSlug: null,
      },

      // === Đất nền ===
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
        images: [],
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
        images: [],
        highlights: ["2 mặt tiền", "Gần cảng"],
        projectSlug: null,
      },

      // === Phòng trọ ===
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
        images: [],
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
        images: [],
        highlights: ["Gần ĐHQG", "Khu an ninh"],
        projectSlug: null,
      },

      // === Nhà xưởng ===
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
        images: [],
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
        images: [],
        highlights: ["2 mặt tiền", "Gần quốc lộ 1K"],
        projectSlug: null,
      },

      // === BĐS không thuộc dự án ===
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
        images: [],
        highlights: ["View sông", "Giá tốt"],
        projectSlug: null,
      },
    ],
  });

  console.log("✅ Seed dữ liệu thành công!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
