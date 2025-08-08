"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";

const navItems = [
  {
    key: "buy",
    submenu: [
      { label: "Căn hộ", slug: "can-ho" },
      { label: "Nhà riêng", slug: "nha-rieng" },
      { label: "Đất nền", slug: "dat-nen" },
    ],
  },
  {
    key: "rent",
    submenu: [
      { label: "Căn hộ", slug: "can-ho" },
      { label: "Nhà riêng", slug: "nha-rieng" },
      { label: "Phòng trọ", slug: "phong-tro" },
    ],
  },
  {
    key: "project",
    submenu: [
      { label: "Vinhomes Riverside", slug: "vinhomes-riverside" },
      { label: "EcoPark", slug: "ecopark" },
      { label: "Masteri Thảo Điền", slug: "masteri-thao-dien" },
    ],
  },
  {
    key: "industry",
    submenu: [
      { label: "Đất nền", slug: "dat-nen" },
      { label: "Nhà xưởng", slug: "nha-xuong" },
      { label: "Khu công nghiệp", slug: "khu-cong-nghiep" },
    ],
  },
  { key: "agent" },
  { key: "about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("navbar");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownTimer, setDropdownTimer] = useState<NodeJS.Timeout | null>(null);

  const currentLocale = pathname.split("/")[1] || "vi";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [pathname]);

  const changeLanguage = (lang: string) => {
    const segments = pathname.split("/");
    segments[1] = lang;
    const newPath = segments.join("/") || "/";
    router.push(newPath);
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

  const handleNavClick = (mainKey: string, slug: string) => {
    const base = `/${currentLocale}`;
    if (mainKey === "buy") {
      router.push(`${base}/buy/${slug}`);
    } else if (mainKey === "rent") {
      router.push(`${base}/rent/${slug}`);
    } else if (mainKey === "industry") {
      router.push(`${base}/industrials/${slug}`);
    } else if (mainKey === "project") {
      router.push(`${base}/projects/${slug}`); // ✅ cập nhật đường dẫn mới
    }
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={`/${currentLocale}`} className="text-red-600 font-bold text-xl border border-red-600 px-2 py-1">
          R
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 items-center text-sm font-medium text-gray-800">
          {navItems.map((item) => (
            <div
              key={item.key}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.key)}
              onMouseLeave={handleMouseLeave}
            >
              <button className="hover:text-red-600 flex items-center gap-1">
                {t(item.key)} {item.submenu && <span>▼</span>}
              </button>
              {item.submenu && activeDropdown === item.key && (
                <div className="absolute top-full left-0 w-48 bg-white border shadow rounded mt-2 z-50">
                  {item.submenu.map((subItem, i) => (
                    <button
                      key={i}
                      onClick={() => handleNavClick(item.key, subItem.slug)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {subItem.label}
                    </button>
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
                  <Link href={`/${currentLocale}/my-properties`} className="block px-4 py-2 text-sm hover:bg-gray-100">
                    {t("myPosts")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href={`/${currentLocale}/login`} className="hover:text-red-600">{t("login")}</Link>
              <Link
                href={`/${currentLocale}/register`}
                className="text-sm px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ml-2"
              >
                {t("register")}
              </Link>
            </>
          )}

          <Link
            href={`/${currentLocale}/post`}
            className="border border-red-600 text-red-600 px-4 py-1 rounded hover:bg-red-50"
          >
            {t("post")}
          </Link>

          {/* Language switch */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === "lang" ? null : "lang")}
              className="border px-2 py-1 rounded flex items-center gap-1"
            >
              {currentLocale === "vi" ? "🇻🇳 VI" : "🇺🇸 EN"} ▼
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
                  🇻🇳 {t("vi")}
                </button>
                <button
                  onClick={() => {
                    changeLanguage("en");
                    setActiveDropdown(null);
                  }}
                  className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                >
                  🇺🇸 {t("en")}
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-4 py-4 space-y-2 border-t">
          {navItems.map((item) => (
            <div key={item.key}>
              <span className="font-medium block mb-1">{t(item.key)}</span>
              {item.submenu &&
                item.submenu.map((subItem, i) => (
                  <button
                    key={i}
                    onClick={() => handleNavClick(item.key, subItem.slug)}
                    className="block w-full text-left pl-4 py-1 text-sm text-gray-600"
                  >
                    {subItem.label}
                  </button>
                ))}
            </div>
          ))}
          <hr />
          {user ? (
            <>
              <Link href={`/${currentLocale}/my-properties`} className="block py-1 text-sm">{t("myPosts")}</Link>
              <button onClick={handleLogout} className="block py-1 text-sm text-left">{t("logout")}</button>
            </>
          ) : (
            <>
              <Link href={`/${currentLocale}/login`} className="block py-1 text-sm">{t("login")}</Link>
              <Link href={`/${currentLocale}/register`} className="block py-1 text-sm text-red-600 font-medium">{t("register")}</Link>
            </>
          )}
          <Link href={`/${currentLocale}/post`} className="block py-1 text-sm text-red-600 font-medium">{t("post")}</Link>
        </div>
      )}
    </header>
  );
}
