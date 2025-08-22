// lib/searchIntent.ts
export type SearchIntent = {
  purpose?: "buy" | "rent";
  type?: "can-ho" | "nha-rieng" | "dat-nen" | "phong-tro";
  city?: string;
  district?: string;
  maxPrice?: number;
  reasons: string[];
};

const VIET_NO_TONE = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function parseSearchIntent(q?: string): SearchIntent {
  const intent: SearchIntent = { reasons: [] };
  if (!q) return intent;
  const t = VIET_NO_TONE(q);

  if (/(thue|phong tro|nha tro|cho thue)/.test(t)) {
    intent.purpose = "rent";
    intent.reasons.push("Từ khóa có 'thuê/phòng trọ'");
  }
  if (/(phong tro|nha tro)/.test(t)) intent.type = "phong-tro";
  else if (/(can ho|chung cu|apartment|condo)/.test(t)) intent.type = "can-ho";
  else if (/(nha rieng|nha pho)/.test(t)) intent.type = "nha-rieng";
  else if (/(dat nen|dat)/.test(t)) intent.type = "dat-nen";

  if (/(gia re|re)/.test(t)) {
    intent.maxPrice = intent.purpose === "rent" ? 5_000_000 : 2_000_000_000;
    intent.reasons.push("Từ khóa có 'giá rẻ'");
  }
  if (/(thu duc|tp thu duc|q thu duc)/.test(t)) {
    intent.city = "ho-chi-minh";
    intent.district = "thu-duc";
    intent.reasons.push("Khu vực 'Thủ Đức'");
  }
  return intent;
}
