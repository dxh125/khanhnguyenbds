export default function FeatureSection() {
    const features = [
      {
        icon: "/icons/verify.svg",
        title: "Cam kết xác thực",
      },
      {
        icon: "/icons/quantity.svg",
        title: "Dẫn đầu số lượng",
      },
      {
        icon: "/icons/support.svg",
        title: "Trọn hỗ trợ, chi phí thấp",
      },
      {
        icon: "/icons/gift.svg",
        title: "Nhận nhiều ưu đãi",
      },
    ];
  
    return (
      <section className="py-12 bg-white text-center border-t">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {features.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-2">
                <img src={item.icon} alt={item.title} className="h-16 mb-2" />
                <p className="font-medium text-gray-800 text-sm md:text-base">{item.title}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 px-6 py-3 border rounded-lg font-medium hover:bg-gray-100">
            Tìm hiểu thêm
          </button>
        </div>
      </section>
    );
  }
  