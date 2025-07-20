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
      status: "Đang bán",
      images: [
        "https://images.pexels.com/photos/36762/scarlet-honeyeater-bird-red-feathers.jpg"
      ],
    },
    {
      title: "Căn hộ Quận 7",
      description: "Căn hộ cao cấp quận 7, view sông.",
      price: 3500000000,
      area: 65,
      address: "456 Nguyễn Văn Linh",
      ward: "Tân Phong",
      district: "Quận 7",
      city: "TP.HCM",
      propertyType: "Căn hộ",
      status: "Đang bán",
      images: [
        "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
      ],
    }
  ],
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
