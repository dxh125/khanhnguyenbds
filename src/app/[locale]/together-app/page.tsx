'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function TogetherAppPage() {
  const t = useTranslations('support');

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* Header với icon + title */}
      <div className="flex items-center mb-6 space-x-3">
        <Image
          src="/icons/support-icon.png" // Đảm bảo ảnh nằm trong public/icons/
          alt="Support Icon"
          width={40}
          height={40}
        />
        <h1 className="text-3xl font-bold">{t('title')}</h1>
      </div>

      {/* Description */}
      <p className="mb-6 text-gray-700">{t('description')}</p>

      {/* Contact Section */}
      <div className="space-y-2 mb-6">
        <h2 className="text-xl font-semibold">{t('contactTitle')}</h2>
        <p>
          {t('contactEmail')}{' '}
          <a href="mailto:dxh125@gmail.com" className="text-blue-600 underline">
            Hieu Do Developer
          </a>
        </p>
        <p>{t('contactAddress')}</p>
        <p>{t('contactPhone')}</p>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">{t('faqTitle')}</h2>
        <div className="space-y-4">
          {t.raw('faq').map((item: any, index: number) => (
            <div key={index} className="border-b pb-3">
              <p className="font-medium text-gray-900">Q{index + 1}. {item.question}</p>
              <p className="text-gray-700 mt-1">A: {item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
