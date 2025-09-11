export default function Footer() {
    return (
      <footer className="bg-gray-100 border-t text-sm text-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <h3 className="font-semibold">Liên hệ</h3>
            <p>Hotline miễn phí (24/7): <strong>0983694869</strong></p>
            <p>Khiếu nại, phản hồi: <strong>0983694869</strong></p>
            <p>Bộ phận kinh doanh: <a href="mailto:Sales@rever.vn">dxh125@gmail.com</a></p>
            <p>Phòng dự án: <a href="mailto:phongduan@rever.vn">dxh125@gmail.com</a></p>
            <p>Chăm sóc khách hàng: <a href="mailto:support@rever.vn">dxh125@gmail.com</a></p>
          </div>
  
          <div className="space-y-2">
            <h3 className="font-semibold">Công ty</h3>
            <p>Về chúng tôi</p>
            <p>Tuyển dụng</p>
            <p>Đội ngũ</p>
            <p>Liên hệ</p>
            <p>Chính sách bảo mật</p>
            <p>Điều khoản sử dụng</p>
          </div>
  
          <div className="space-y-2">
            <h3 className="font-semibold">Dịch vụ</h3>
            <p>Ký gửi nhà đất</p>
            <p>Mua nhà</p>
            <p>Thuê nhà</p>
            <p>Kiến thức bds</p>
            <p>Đối tác</p>
            <p>Quy trình dịch vụ</p>
          </div>
  
          <div className="space-y-2">
            <h3 className="font-semibold">Thông tin & Ứng dụng</h3>
            <p>Tin tức thị trường</p>
            <p>Cập nhật sản phẩm</p>
            <p>Kiến thức cho môi giới</p>
            <p>App trên iOS</p>
            <p>App trên Android</p>
          </div>
        </div>
  
        <div className="bg-gray-200 text-center text-xs text-gray-600 py-4">
          <p className="mb-1 font-medium">CÔNG TY CỔ PHẦN ĐTSXTM KHÁNH NGUYÊN</p>
          <p>MST: 0110300172, Sở kế hoạch đầu tư TP Hà nội, cấp ngày:</p>
          <p>Địa chỉ: Phù yên, Phú Nghĩa, Hà Nội</p>
          <p>Điện thoại: | Email: </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} KHÁNH NGUYÊN</p>
        </div>
      </footer>
    );
  }
  