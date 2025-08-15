'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter()
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', label: '🇺🇸 English' },
    { code: 'jp', name: '日本語', flag: '🇯🇵', label: '🇯🇵 日本語' },
  ];

  useEffect(() => {
    const cookieLocale = document.cookie.split(";").find((row) => row.startsWith("NEXT_LOCALE="))?.split("=")[1];
    if (cookieLocale) {
      setLanguage(cookieLocale);
    } else {
      const browserLocale = navigator.language.slice(0, 2);
      setLanguage(browserLocale);
      document.cookie = `NEXT_LOCALE=${browserLocale};`;
      router.refresh();
    }
  }, [router]);

  const changeLocale = (locale: string) => {
    setLanguage(locale);
    document.cookie = `NEXT_LOCALE=${locale};`;
    setIsLanguageDropdownOpen(false);
    router.refresh();
  }

  if (!user) {
    return (
      <div className='mx-[100px] py-3 flex items-center justify-between border-b '>
        <h1 className='text-lg font-bold'>SotaTest</h1>
        <div className="relative">
          <button
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <span>{languages.find(lang => lang.code === language)?.label || languages[0].label}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isLanguageDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <div className="py-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLocale(lang.code)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${language === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const navigation = [
    { name: 'Papers', href: '/papers', current: pathname.startsWith('/papers') },
    { name: "Video Player", href: "/video-player", current: pathname === '/video-player' },
    { name: 'Dashboard', href: '/dashboard', current: pathname === '/dashboard' },
  ];

  const isCurrentPage = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">
              Research Hub
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isCurrentPage(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.username}
              </span>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-2 rounded-md"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isCurrentPage(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
              {/* Mobile user menu */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm text-gray-700">
                    Welcome, {user.username}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
