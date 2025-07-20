export async function fetchProperties() {
  const res = await fetch("/api/properties");
  if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu bất động sản");
  return res.json();
}
