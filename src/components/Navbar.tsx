'use client';

import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import clsx from 'clsx';

const Navbar = () => {
  const t = useTranslations('Navbar');
  const pathname = usePathname();

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="text-xl font-bold text-teal-800">Khánh Nguyên</div>

        <ul className="flex space-x-6 items-center">
          <li>
            <Link
              href="/"
              className={clsx(
                'text-sm font-medium hover:text-teal-700 transition',
                pathname === '/' ? 'text-teal-800' : 'text-gray-700'
              )}
            >
              {t('home')}
            </Link>
          </li>

          <li>
            <Link
              href="/about"
              className={clsx(
                'text-sm font-medium hover:text-teal-700 transition',
                pathname === '/about' ? 'text-teal-800' : 'text-gray-700'
              )}
            >
              {t('about')}
            </Link>
          </li>

          {/* Dropdown - updated colors */}
          <li className="relative group">
            <button
              className={clsx(
                'text-sm font-medium hover:text-teal-700 transition',
                pathname.startsWith('/products') ? 'text-teal-800' : 'text-gray-700'
              )}
            >
              {t('products')}
            </button>

            <div className="absolute left-0 top-full mt-2 w-48 bg-white border rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <Link
                href="/products"
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
              >
                {t('allProducts')}
              </Link>
              <Link
                href="/together-app"
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
              >
                {t('togetherApp')}
              </Link>
            </div>
          </li>

          <li>
            <Link
              href="/contact"
              className={clsx(
                'text-sm font-medium hover:text-teal-700 transition',
                pathname === '/contact' ? 'text-teal-800' : 'text-gray-700'
              )}
            >
              {t('contact')}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
