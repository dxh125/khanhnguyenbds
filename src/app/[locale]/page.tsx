'use client';

import {useTranslations} from 'next-intl';
import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';

const heroImages = [
  '/hero1.png',
  '/hero2.png',
  '/hero3.png'
];

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <>
      <Navbar />
      <main className="bg-gray-100">
        {/* Hero section */}
        <section className="relative w-full h-[90vh] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <HeroCarousel />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full bg-black/40 text-white px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
            <p className="text-lg md:text-xl mb-6 max-w-3xl">{t('description')}</p>
            <div className="flex gap-4">
              <Link href="/about" className="bg-teal-700 px-6 py-2 rounded text-white hover:bg-teal-800">
                {t('readMore')}
              </Link>
              <Link href="/contact" className="bg-white text-teal-700 px-6 py-2 rounded hover:bg-gray-100">
                {t('contactUs')}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
