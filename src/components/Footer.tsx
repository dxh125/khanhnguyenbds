export default function Footer() {
    return (
      <footer className="bg-gray-100 border-t text-sm text-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <h3 className="font-semibold">Liên hệ</h3>
            <p>Hotline miễn phí (24/7): <strong>1800 234 546</strong></p>
            <p>Khiếu nại, phản hồi: <strong>1800 234 560</strong></p>
            <p>Bộ phận kinh doanh: <a href="mailto:Sales@rever.vn">Sales@rever.vn</a></p>
            <p>Phòng dự án: <a href="mailto:phongduan@rever.vn">phongduan@rever.vn</a></p>
            <p>Chăm sóc khách hàng: <a href="mailto:support@rever.vn">support@rever.vn</a></p>
          </div>
  
          <div className="space-y-2">
            <h3 className="font-semibold">Công ty</h3>
            <p>Về Rever</p>
            <p>Tuyển dụng</p>
            <p>Đội ngũ</p>
            <p>Liên hệ</p>
            <p>Chính sách bảo mật</p>
            <p>Điều khoản sử dụng</p>
          </div>
  
          <div className="space-y-2">
            <h3 className="font-semibold">Dịch vụ</h3>
            <p>Ký gửi nhà đất</p>
            <p>Mua với Rever</p>
            <p>Thuê với Rever</p>
            <p>Rever Academy</p>
            <p>Rever Agents</p>
            <p>Quy trình dịch vụ</p>
          </div>
  
          <div className="space-y-2">
            <h3 className="font-semibold">Thông tin & Ứng dụng</h3>
            <p>Tin tức thị trường</p>
            <p>Cập nhật sản phẩm</p>
            <p>Kiến thức cho môi giới</p>
            <p>Rever trên iOS</p>
            <p>Rever trên Android</p>
          </div>
        </div>
  
        <div className="bg-gray-200 text-center text-xs text-gray-600 py-4">
          <p className="mb-1 font-medium">CÔNG TY CỔ PHẦN CÔNG NGHỆ REVER</p>
          <p>MST: 0313817128 - Sở KHĐT TP Hồ Chí Minh cấp ngày 20/05/2016</p>
          <p>Địa chỉ: Số 5-7, Đường B4, Phường An Lợi Đông, TP. Thủ Đức, TP. Hồ Chí Minh</p>
          <p>Điện thoại: 08 6970 2321 - 1800 234 546 | Email: support@rever.vn</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} Công ty Cổ Phần Công Nghệ Rever</p>
        </div>
      </footer>
    );
  }
  