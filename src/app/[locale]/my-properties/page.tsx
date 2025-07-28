'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import PropertyCard from '@/components/PropertyCard';

interface RawProperty {
  _id: string;
  title: string;
  price: string;
  area: string;
  date: string;
  type: string;
  image: string;
  status?: string;
  ownerId: string;
}

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<RawProperty[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('MyProperties');

  // Lấy locale từ URL
  const currentLocale = pathname.split('/')[1] || 'vi';

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      alert(t('needLogin'));
      router.push(`/${currentLocale}/login`);
      return;
    }
    const parsed = JSON.parse(user);
    setUserId(parsed.id);
  }, [router, t, currentLocale]);

  const fetchMyProperties = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/properties');
      const all: RawProperty[] = res.data;
      const mine = all.filter((p) => p.ownerId === userId);
      setProperties(mine);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu:', err);
    }
  };

  useEffect(() => {
    if (userId) fetchMyProperties();
  }, [userId]);

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyProperties();
    } catch (err) {
      console.error('Lỗi khi xoá:', err);
      alert(t('deleteError'));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>
      {properties.length === 0 ? (
        <p className="text-gray-600">{t('noProperties')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property._id} className="relative">
              <PropertyCard
                property={{
                  id: property._id,
                  title: property.title,
                  price: parseInt(property.price),
                  area: parseFloat(property.area),
                  postedAt: property.date,
                  propertyType: property.type,
                  images: [property.image],
                  status: property.status,
                }}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => router.push(`/${currentLocale}/edit/${property._id}`)}
                  className="text-xs px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  {t('edit')}
                </button>
                <button
                  onClick={() => handleDelete(property._id)}
                  className="text-xs px-2 py-1 bg-red-600 text-white rounded"
                >
                  {t('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
