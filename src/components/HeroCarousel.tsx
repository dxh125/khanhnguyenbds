'use client';

import Image from 'next/image';
import {useEffect, useState} from 'react';
import {clsx} from 'clsx';

const images = [
  '/hero/hero1.png',
  '/hero/hero2.png',
  '/hero/hero3.png'
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 5000); // 5s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      {images.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Slide ${index + 1}`}
          fill
          className={clsx(
            'object-cover transition-opacity duration-1000 ease-in-out',
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          )}
          priority={index === 0}
        />
      ))}

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center bg-black/40">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Khánh Nguyên</h1>
        <p className="text-lg md:text-xl mb-6">
          Nơi kết nối thủ công truyền thống & công nghệ hiện đại
        </p>
        <div className="flex gap-4">
          <a
            href="#about"
            className="px-5 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200"
          >
            Read More
          </a>
          <a
            href="#contact"
            className="px-5 py-2 bg-teal-700 text-white font-semibold rounded hover:bg-teal-800"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
