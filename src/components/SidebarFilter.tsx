interface SidebarFilterProps {
    filter: string;
    setFilter: (val: string) => void;
    search: string;
    setSearch: (val: string) => void;
    priceFrom: string;
    setPriceFrom: (val: string) => void;
    priceTo: string;
    setPriceTo: (val: string) => void;
    areaFrom: string;
    setAreaFrom: (val: string) => void;
    areaTo: string;
    setAreaTo: (val: string) => void;
  }
  
  export default function SidebarFilter({
    filter,
    setFilter,
    search,
    setSearch,
    priceFrom,
    setPriceFrom,
    priceTo,
    setPriceTo,
    areaFrom,
    setAreaFrom,
    areaTo,
    setAreaTo,
  }: SidebarFilterProps) {
    return (
      <aside className="bg-white rounded-xl shadow p-4 space-y-4">
        <h2 className="text-lg font-semibold mb-2">Bộ lọc nâng cao</h2>
        <input
          type="text"
          placeholder="Từ khóa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <select
          className="w-full border p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Tất cả loại</option>
          <option value="nhà phố">Nhà phố</option>
          <option value="căn hộ">Căn hộ</option>
          <option value="đất">Đất nền</option>
        </select>
  
        <div>
          <label className="text-sm">Giá (tỷ VNĐ)</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              placeholder="Từ"
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              className="w-1/2 border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Đến"
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
              className="w-1/2 border p-2 rounded"
            />
          </div>
        </div>
  
        <div>
          <label className="text-sm">Diện tích (m²)</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              placeholder="Từ"
              value={areaFrom}
              onChange={(e) => setAreaFrom(e.target.value)}
              className="w-1/2 border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Đến"
              value={areaTo}
              onChange={(e) => setAreaTo(e.target.value)}
              className="w-1/2 border p-2 rounded"
            />
          </div>
        </div>
      </aside>
    );
  }
  