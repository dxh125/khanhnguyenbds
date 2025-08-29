// Các danh mục hiển thị label nhưng lưu slug (value)
export const PROPERTY_TYPES = [
  { label: "Căn hộ (Chung cư)", value: "can-ho" },
  { label: "Nhà riêng",         value: "nha-rieng" },
  { label: "Đất nền",           value: "dat-nen" },
] as const;

export const PURPOSES = [
  { label: "Mua",  value: "buy"  },
  { label: "Thuê", value: "rent" },
] as const;

export const STATUSES = [
  { label: "Còn hàng", value: "available" },
  { label: "Đã bán",   value: "sold"      },
  { label: "Đã thuê",  value: "rented"    },
] as const;

// Hướng nhà (slug hoá)
export const DIRECTIONS = [
  { label: "Đông",       value: "dong" },
  { label: "Tây",        value: "tay" },
  { label: "Nam",        value: "nam" },
  { label: "Bắc",        value: "bac" },
  { label: "Đông-Bắc",   value: "dong-bac" },
  { label: "Đông-Nam",   value: "dong-nam" },
  { label: "Tây-Bắc",    value: "tay-bac" },
  { label: "Tây-Nam",    value: "tay-nam" },
] as const;

// Pháp lý (tuỳ bạn mở rộng)
export const LEGALS = [
  { label: "Sổ đỏ",    value: "so-do" },
  { label: "Sổ hồng",  value: "so-hong" },
  { label: "HĐMB",     value: "hdmb" },
  { label: "Giấy tay", value: "giay-tay" },
] as const;

// tiện hàm rút values để dùng cho zod enum
export const valuesOf = <T extends readonly { value: string }[]>(arr: T) =>
  arr.map(i => i.value) as [string, ...string[]];
