// Node 18+ (có sẵn fetch). Chạy: node scripts/generate-vn-locations.js
// Sinh dữ liệu vào: src/data/locations/index.json + src/data/locations/provinces/*.json

const { writeFile, mkdir } = require("node:fs/promises");
const { existsSync } = require("node:fs");
const path = require("node:path");

// ---- Config ----
const OUT_DIR = path.resolve("src/data/locations");
const PROV_DIR = path.join(OUT_DIR, "provinces");
const INDEX_FILE = path.join(OUT_DIR, "index.json");
const API_BASE = "https://api.vnappmob.com/api/v2"; // public API

// ---- Utils ----
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function fetchJSON(url, { retries = 3, backoffMs = 400 } = {}) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return await res.json();
    } catch (e) {
      lastErr = e;
      if (i < retries - 1) await sleep(backoffMs * (i + 1));
    }
  }
  throw lastErr;
}

async function ensureDirs() {
  if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });
  if (!existsSync(PROV_DIR)) await mkdir(PROV_DIR, { recursive: true });
}

// ---- Main ----
(async function main() {
  console.log("→ Bắt đầu sinh dữ liệu 63 tỉnh/thành…");
  await ensureDirs();

  // 1) Lấy danh sách tỉnh/thành
  const provRes = await fetchJSON(`${API_BASE}/province`);
  const provinces = provRes.results || provRes || [];
  if (!Array.isArray(provinces) || provinces.length === 0) {
    throw new Error("Không lấy được danh sách tỉnh/thành từ API.");
  }

  const indexItems = [];

  for (let i = 0; i < provinces.length; i++) {
    const p = provinces[i];
    const provinceName = p.province_name || p.name;
    const provinceId = p.province_id || p.code;
    const provinceSlug = slugify(provinceName);
    const provinceOutPath = path.join(PROV_DIR, `${provinceSlug}.json`);

    console.log(`[${i + 1}/${provinces.length}] ${provinceName} → ${provinceOutPath}`);

    // 2) Quận/Huyện của tỉnh
    const distRes = await fetchJSON(`${API_BASE}/province/district/${provinceId}`);
    const districts = distRes.results || [];

    const districtsOut = [];
    for (const d of districts) {
      const districtName = d.district_name;
      const districtId = d.district_id;

      // 3) Phường/Xã của quận/huyện
      const wardRes = await fetchJSON(`${API_BASE}/province/ward/${districtId}`);
      const wards = wardRes.results || [];

      districtsOut.push({
        code: districtId,
        name: districtName,
        slug: slugify(districtName),
        wards: wards.map((w) => ({
          code: w.ward_id,
          name: w.ward_name,
          slug: slugify(w.ward_name),
        })),
      });

      // nhẹ nhàng tránh rate limit
      await sleep(120);
    }

    const provinceOut = {
      code: provinceId,
      name: provinceName,
      slug: provinceSlug,
      districts: districtsOut,
    };

    await writeFile(provinceOutPath, JSON.stringify(provinceOut, null, 2), "utf8");

    indexItems.push({
      code: provinceId,
      name: provinceName,
      slug: provinceSlug,
      file: `provinces/${provinceSlug}.json`,
    });

    await sleep(150);
  }

  await writeFile(INDEX_FILE, JSON.stringify(indexItems, null, 2), "utf8");

  console.log(`✅ Xong!
- ${INDEX_FILE}
- ${indexItems.length} file tỉnh tại: ${PROV_DIR}`);
})().catch((err) => {
  console.error("❌ Lỗi:", err);
  process.exit(1);
});
