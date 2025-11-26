'use client';

import { useRouter, usePathname } from '../../i18n/routing';
import { useLocale } from 'next-intl';
import { useState, useTransition, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [selectedLocale, setSelectedLocale] = useState(locale);

  const switchLocale = (newLocale: string) => {
    if (newLocale === selectedLocale || isPending) return;

    setSelectedLocale(newLocale);
    setIsOpen(false);

    startTransition(() => {
      router.push(pathname, { locale: newLocale });
      window.location.reload();
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-language-switcher]')) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
  ];

  const currentLanguage = languages.find((lang) => lang.code === selectedLocale) ?? languages[1];
  return (
    <div className="relative" data-language-switcher>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        title='Change Language'
        className={`flex items-center gap-2 px-2 py-1 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg shadow-sm hover:bg-[hsl(var(--accent))] transition-colors duration-200 min-w-[60px] ${isPending ? 'opacity-50 cursor-not-allowed' : ''
          }`}
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <ChevronDown
          className={`h-4 w-4 text-[hsl(var(--muted-foreground))] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </button>

      {isOpen && !isPending && (
        <div className="absolute top-full left-0 mt-1 w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg shadow-lg z-20 overflow-hidden min-w-[120px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              disabled={locale === lang.code}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-[hsl(var(--accent))] transition-colors duration-150 ${locale === lang.code
                ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-medium cursor-default'
                : 'text-[hsl(var(--foreground))]'
                }`}
              title={lang.label}
            >
              <span className="text-lg">{lang.flag}</span>
              <div className="flex flex-col items-start">
                <span className="font-medium">{lang.code.toUpperCase()}</span>
                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                  {lang.label}
                </span>
              </div>
              {locale === lang.code && (
                <div className="ml-auto w-2 h-2 bg-[hsl(var(--primary))] rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}