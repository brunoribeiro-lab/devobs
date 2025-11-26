import LanguageSwitcher from '@/components/language/Switcher';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const translate = await getTranslations('common');

  return (
    <div className="flex min-h-screen">
        <LanguageSwitcher />

        Bem Vindo [LOCALE]: {translate('welcome')}
    </div>
  );
}
