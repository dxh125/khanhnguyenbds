"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Mua", submenu: ["Căn hộ", "Nhà phố", "Biệt thự"] },
  { label: "Thuê", submenu: ["Căn hộ", "Nhà nguyên căn", "Phòng trọ"] },
  { label: "Dự án", submenu: ["Sắp mở bán", "Đã bàn giao", "Chưa xác thực"] },
  { label: "Chuyên viên" },
  { label: "Trang tin" },
  { label: "Về Rever" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [language, setLanguage] = useState("vi");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownTimer, setDropdownTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);

    const storedLang = localStorage.getItem("language");
    if (storedLang) setLanguage(storedLang);
  }, [pathname]); // Cập nhật user mỗi khi route thay đổi

  const changeLanguage = (lang: string) => {
    localStorage.setItem("language", lang);
    setLanguage(lang);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handleMouseEnter = (label: string) => {
    if (dropdownTimer) clearTimeout(dropdownTimer);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    const timer = setTimeout(() => setActiveDropdown(null), 150);
    setDropdownTimer(timer);
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-red-600 font-bold text-xl border border-red-600 px-2 py-1">
          R
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 items-center text-sm font-medium text-gray-800">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
            >
              <button className="hover:text-red-600 flex items-center gap-1">
                {item.label} {item.submenu && <span>▼</span>}
              </button>
              {item.submenu && activeDropdown === item.label && (
                <div className="absolute top-full left-0 w-40 bg-white border shadow rounded mt-2 z-50">
                  {item.submenu.map((sub, i) => (
                    <Link
                      key={i}
                      href={`/search?type=${encodeURIComponent(sub.toLowerCase())}`}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {user ? (
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("user")}
              onMouseLeave={handleMouseLeave}
            >
              <button className="hover:text-red-600">👋 {user.name}</button>
              {activeDropdown === "user" && (
                <div className="absolute right-0 mt-2 w-40 bg-white border shadow rounded z-50">
                  <Link href="/my-properties" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    Tin của tôi
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="hover:text-red-600">Đăng nhập</Link>
              <Link
                href="/register"
                className="text-sm px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ml-2"
              >
                Đăng ký
              </Link>
            </>
          )}

          <Link
            href="/post"
            className="border border-red-600 text-red-600 px-4 py-1 rounded hover:bg-red-50"
          >
            Ký gửi nhà đất
          </Link>

          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === "lang" ? null : "lang")}
              className="border px-2 py-1 rounded flex items-center gap-1"
            >
              {language === "vi" ? "🇻🇳 VI" : "🇺🇸 EN"} ▼
            </button>
            {activeDropdown === "lang" && (
              <div className="absolute right-0 mt-2 w-32 bg-white border shadow rounded z-50">
                <button
                  onClick={() => {
                    changeLanguage("vi");
                    setActiveDropdown(null);
                  }}
                  className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                >
                  🇻🇳 Tiếng Việt
                </button>
                <button
                  onClick={() => {
                    changeLanguage("en");
                    setActiveDropdown(null);
                  }}
                  className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                >
                  🇺🇸 English
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Icon */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-4 py-4 space-y-2 border-t">
          {navItems.map((item) => (
            <div key={item.label}>
              <span className="font-medium block mb-1">{item.label}</span>
              {item.submenu &&
                item.submenu.map((sub, i) => (
                  <Link
                    href={`/search?type=${encodeURIComponent(sub.toLowerCase())}`}
                    key={i}
                    className="block pl-4 py-1 text-sm text-gray-600"
                  >
                    {sub}
                  </Link>
                ))}
            </div>
          ))}
          <hr />
          {user ? (
            <>
              <Link href="/my-properties" className="block py-1 text-sm">Tin của tôi</Link>
              <button onClick={handleLogout} className="block py-1 text-sm text-left">Đăng xuất</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-1 text-sm">Đăng nhập</Link>
              <Link href="/register" className="block py-1 text-sm text-red-600 font-medium">Đăng ký</Link>
            </>
          )}
          <Link href="/post" className="block py-1 text-sm text-red-600 font-medium">Ký gửi nhà đất</Link>
        </div>
      )}
    </header>
  );
}
