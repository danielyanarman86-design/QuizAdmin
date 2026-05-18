import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Preloader } from '@/components/preloader/Preloader';
import '../globals.css';

export const metadata: Metadata = {
  title: 'QuizRush Admin',
  description: 'QuizRush Admin Panel',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body className="bg-[#0a0a14] text-white antialiased">
        <NextIntlClientProvider messages={messages}>
          <Preloader />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
