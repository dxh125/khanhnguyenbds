import '@/app/globals.css';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {getRequestConfig} from '@/i18n/request';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale;

  // Nếu locale không hợp lệ → notFound
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // next-intl yêu cầu requestLocale là Promise<string>
  const {messages} = await getRequestConfig({
    requestLocale: Promise.resolve(locale)
  });

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
