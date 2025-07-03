import {getRequestConfig as createRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export const getRequestConfig = createRequestConfig(async ({requestLocale}) => {
  const resolvedLocale = await requestLocale;

  // Nếu không có locale => throw error (bắt buộc để TypeScript hiểu luôn là string)
  if (!resolvedLocale || !routing.locales.includes(resolvedLocale as any)) {
    throw new Error(`Unsupported locale: ${resolvedLocale}`);
  }

  const messages = (await import(`../../messages/${resolvedLocale}.json`)).default;

  return {
    locale: resolvedLocale, // ✅ chắc chắn là string
    messages
  };
});
export default getRequestConfig;

