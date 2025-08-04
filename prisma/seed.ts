import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.property.createMany({
    data: [
      {
        title: "Nhà phố Quận 1",
        description: "Nhà phố trung tâm Quận 1, diện tích lớn.",
        price: 5000000000,
        area: 80,
        address: "123 Lê Lợi",
        ward: "Bến Nghé",
        district: "Quận 1",
        city: "TP.HCM",
        propertyType: "Nhà phố",
        purpose: "buy",
        status: "Đang bán",
        images: ["https://images.pexels.com/photos/36762/scarlet-honeyeater-bird-red-feathers.jpg"],
        highlights: ["Hướng Đông Nam", "Gần công viên", "Sổ hồng riêng"]
      },
      {
        title: "Căn hộ cao cấp Quận 7",
        description: "Căn hộ cao cấp view sông tuyệt đẹp.",
        price: 3500000000,
        area: 65,
        address: "456 Nguyễn Văn Linh",
        ward: "Tân Phong",
        district: "Quận 7",
        city: "TP.HCM",
        propertyType: "Căn hộ",
        purpose: "buy",
        status: "Đang bán",
        images: ["https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"],
        highlights: ["View sông", "Full nội thất", "An ninh 24/7"]
      },
      {
        title: "Đất nền Bình Chánh",
        description: "Đất nền khu dân cư đông đúc, gần trường học.",
        price: 1800000000,
        area: 100,
        address: "789 Tân Kiên",
        ward: "Tân Kiên",
        district: "Bình Chánh",
        city: "TP.HCM",
        propertyType: "Đất nền",
        purpose: "buy",
        status: "Đang bán",
        images: ["https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"],
        highlights: ["Gần chợ", "Hạ tầng hoàn chỉnh", "Sổ riêng"]
      },
      {
        title: "Phòng trọ Quận Bình Thạnh",
        description: "Phòng trọ tiện nghi, phù hợp sinh viên.",
        price: 3000000,
        area: 20,
        address: "135 Nơ Trang Long",
        ward: "13",
        district: "Bình Thạnh",
        city: "TP.HCM",
        propertyType: "Phòng trọ",
        purpose: "rent",
        status: "Cho thuê",
        images: ["https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg"],
        highlights: ["Máy lạnh", "Wifi miễn phí", "Gần đại học"]
      },
      {
        title: "Nhà nguyên căn Gò Vấp",
        description: "Nhà mới xây, nội thất cơ bản, hẻm xe hơi.",
        price: 15000000,
        area: 60,
        address: "25 Nguyễn Văn Nghi",
        ward: "7",
        district: "Gò Vấp",
        city: "TP.HCM",
        propertyType: "Nhà riêng",
        purpose: "rent",
        status: "Cho thuê",
        images: ["https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg"],
        highlights: ["Sân thượng", "3 phòng ngủ", "Gần chợ Hạnh Thông Tây"]
      },
      {
        title: "Căn hộ Vinhomes Central Park",
        description: "Căn hộ cao cấp, tiện ích nội khu đầy đủ.",
        price: 2800000000,
        area: 70,
        address: "720A Điện Biên Phủ",
        ward: "22",
        district: "Bình Thạnh",
        city: "TP.HCM",
        propertyType: "Căn hộ",
        purpose: "buy",
        status: "Đang bán",
        images: ["https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg"],
        highlights: ["View Landmark 81", "Tầng cao", "Gym – Hồ bơi miễn phí"]
      },
      {
        title: "Căn hộ dịch vụ Quận 3",
        description: "Căn hộ dịch vụ cho thuê ngắn hạn hoặc dài hạn.",
        price: 10000000,
        area: 40,
        address: "54 Võ Thị Sáu",
        ward: "6",
        district: "Quận 3",
        city: "TP.HCM",
        propertyType: "Căn hộ",
        purpose: "rent",
        status: "Cho thuê",
        images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg"],
        highlights: ["Dọn phòng hàng tuần", "Lễ tân 24/7", "Trang bị đầy đủ"]
      },
      {
        title: "Nhà xưởng KCN Tân Tạo",
        description: "Nhà xưởng rộng, phù hợp sản xuất và kho bãi.",
        price: 12000000000,
        area: 500,
        address: "KCN Tân Tạo",
        ward: "Tân Tạo A",
        district: "Bình Tân",
        city: "TP.HCM",
        propertyType: "Nhà xưởng",
        purpose: "buy",
        status: "Đang bán",
        images: ["https://images.pexels.com/photos/2736834/pexels-photo-2736834.jpeg"],
        highlights: ["Trạm điện 3 pha", "Xe container vào được", "Giấy tờ đầy đủ"]
      }
    ]
  });

  console.log('✅ Seed thành công');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
