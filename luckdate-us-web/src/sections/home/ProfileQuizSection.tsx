'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { SectionShell, PillButton } from './SectionShell';

export function ProfileQuizSection() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <SectionShell id="wellness-profile" background="ivory" layout="compact" className="!py-4 lg:!py-5">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative overflow-hidden rounded-2xl border border-[#E8D5A3]/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 px-5 py-5 sm:px-8 sm:py-5 lg:px-10 lg:py-6 min-h-0"
          style={{
            background: 'linear-gradient(135deg, #4E554B 0%, #5A6258 55%, #6B735F 100%)',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, #E8D5A3 0%, transparent 45%), radial-gradient(circle at 85% 30%, #F0E0B8 0%, transparent 40%)',
            }}
          />
          <p className="relative text-center sm:text-left text-base sm:text-lg lg:text-xl font-bold text-white font-['Montserrat'] leading-snug max-w-2xl">
            {t('homeLayout.profile.title')}
          </p>
          <div className="relative shrink-0 w-full sm:w-auto flex justify-center sm:justify-end">
            <PillButton variant="gold" onClick={() => router.push('/products')}>
              {t('homeLayout.profile.cta')} 鈫?            </PillButton>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
