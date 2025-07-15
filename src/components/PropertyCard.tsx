import Link from "next/link";

interface Property {
  _id?: string;
  id?: number;
  title: string;
  price: string;
  area: string;
  date: string;
  type: string;
  image: string;
  status?: string;
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition-all overflow-hidden relative">
      {property.status && (
        <span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
          {property.status}
        </span>
      )}
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 line-clamp-1">
          {property.title}
        </h3>
        <p className="text-gray-700 text-sm">Giá: {property.price}</p>
        <p className="text-gray-700 text-sm">Diện tích: {property.area}</p>
        <p className="text-gray-500 text-xs mb-2">Ngày đăng: {property.date}</p>
        <Link href={`/properties/${property._id || property.id}`}>
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full">
            Xem chi tiết
          </button>
        </Link>
      </div>
    </div>
  );
}
