'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import CartDrawer from '@/components/CartDrawer';

export interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export default function LegalPageLayout({
  title,
  subtitle,
  lastUpdated,
  sections,
}: LegalPageLayoutProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="min-h-screen bg-[#F7F5F1] noise-overlay flex flex-col">
      <Navigation />

      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#6C6763]/60 hover:text-[#D8CBB8] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('legal.back')}
          </button>

          <div className="mb-12">
            <p className="text-[#D8CBB8] font-medium tracking-wider text-sm uppercase mb-3">
              {subtitle}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#4E554B] mb-4 font-['Montserrat']">
              {title}
            </h2>
            <p className="text-[#6C6763]/50 text-sm">
              {t('legal.lastUpdated')}: {lastUpdated}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            <aside className="lg:w-64 flex-shrink-0">
              <nav className="lg:sticky lg:top-28 bg-white rounded-2xl p-5 shadow-sm border border-[#4E554B]/5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6C6763]/40 mb-4">
                  {t('legal.onThisPage')}
                </p>
                <ul className="space-y-1">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                          activeSection === s.id
                            ? 'bg-[#D8CBB8]/10 text-[#D8CBB8] font-medium'
                            : 'text-[#6C6763]/60 hover:text-[#4E554B] hover:bg-[#F7F5F1]'
                        }`}
                      >
                        <ChevronRight
                          className={`w-3 h-3 flex-shrink-0 transition-transform ${
                            activeSection === s.id ? 'rotate-90' : ''
                          }`}
                        />
                        <span className="truncate">{s.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-3xl shadow-sm border border-[#4E554B]/5 overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-[#D8CBB8]/20 via-[#D8CBB8] to-[#D8CBB8]/20" />
                <div className="p-8 lg:p-12 space-y-12 legal-content">
                  {sections.map((section, i) => (
                    <section
                      key={section.id}
                      id={section.id}
                      className={i > 0 ? 'pt-10 border-t border-[#4E554B]/5' : ''}
                    >
                      <h2 className="text-2xl font-bold text-[#4E554B] font-['Montserrat'] mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 bg-[#D8CBB8]/10 text-[#D8CBB8] rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {i + 1}
                        </span>
                        {section.title}
                      </h2>
                      <div className="text-[#6C6763]/70 leading-relaxed space-y-4 text-[15px]">
                        {section.content}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
