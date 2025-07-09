import {useTranslations} from 'next-intl';

export default function PrivacyPolicyPage() {
  const t = useTranslations('Privacy');

  return (
    <main className="max-w-3xl mx-auto py-8 px-4 text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-6">{t('title')}</h1>

      <p className="mb-4">{t('intro')}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">{t('infoTitle')}</h2>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>{t('info1')}</li>
        <li>{t('info2')}</li>
        <li>{t('info3')}</li>
        <li>{t('info4')}</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">{t('usageTitle')}</h2>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>{t('usage1')}</li>
        <li>{t('usage2')}</li>
        <li>{t('usage3')}</li>
        <li>{t('usage4')}</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">{t('sharingTitle')}</h2>
      <ul className="list-disc list-inside space-y-1 mb-4">
        <li>{t('sharing1')}</li>
        <li>{t('sharing2')}</li>
        <li>{t('sharing3')}</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">{t('securityTitle')}</h2>
      <p className="mb-4">{t('security')}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">{t('cameraTitle')}</h2>
      <p className="mb-4">{t('camera')}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">{t('rightsTitle')}</h2>
      <p className="mb-4">{t('rights')}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">{t('contactTitle')}</h2>
      <p className="mb-4">{t('contact')}</p>

      <p className="italic">{t('updated')}</p>
    </main>
  );
}
