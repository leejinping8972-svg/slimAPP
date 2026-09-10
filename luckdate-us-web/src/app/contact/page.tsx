'use client';

import { ArrowLeft, Mail, Clock, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import CartDrawer from '@/components/CartDrawer';

const SUPPORT_EMAIL = 'support@luckdate.com';

export default function ContactPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const topics = t('contact.topics', { returnObjects: true }) as string[];

  return (
    <div className="min-h-screen bg-[#F7F5F1] noise-overlay flex flex-col">
      <Navigation />

      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 max-w-4xl">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#6C6763]/60 hover:text-[#D8CBB8] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('contact.back')}
          </button>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#4E554B] mb-4 font-['Montserrat']">
              {t('contact.title')}
            </h1>
            <p className="text-[#6C6763]/70 text-lg max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-[#4E554B]/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D8CBB8]/20 via-[#D8CBB8] to-[#D8CBB8]/20" />

            <div className="max-w-2xl mx-auto space-y-10">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#D8CBB8]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-[#D8CBB8]" />
                </div>
                <h2 className="text-2xl font-bold text-[#4E554B] mb-3 font-['Montserrat']">
                  {t('contact.emailTitle')}
                </h2>
                <p className="text-[#6C6763]/70 mb-6">{t('contact.emailDesc')}</p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="inline-flex items-center gap-2 text-xl font-semibold text-[#D8CBB8] hover:underline"
                >
                  <Mail className="w-5 h-5" />
                  {SUPPORT_EMAIL}
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 text-[#6C6763]/60 text-sm">
                <Clock className="w-4 h-4 text-[#D8CBB8]" />
                <span>{t('contact.responseTime')}</span>
              </div>

              <div className="bg-[#F7F5F1] rounded-2xl p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="w-5 h-5 text-[#D8CBB8]" />
                  <h3 className="font-semibold text-[#4E554B]">{t('contact.helpWith')}</h3>
                </div>
                <ul className="space-y-3">
                  {Array.isArray(topics) &&
                    topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-3 text-[#6C6763]/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D8CBB8] mt-2 flex-shrink-0" />
                        <span>{topic}</span>
                      </li>
                    ))}
                </ul>
              </div>

              <p className="text-center text-sm text-[#6C6763]/50">
                {t('legal.address')}: {t('legal.addressValue')}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
