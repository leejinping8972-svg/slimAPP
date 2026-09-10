'use client';

import { useTranslation } from 'react-i18next';
import LegalPageLayout, { type LegalSection } from '@/components/LegalPageLayout';
import JsonLd from '@/components/JsonLd';
import { buildPublisherSchema, BASE_URL, WEBSITE_ID } from '@/lib/seo/home-schemas';

const disclaimerGraphJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${BASE_URL}/disclaimer/#page`,
  url: `${BASE_URL}/disclaimer`,
  name: 'Disclaimer | LUCKDATE',
  description: 'LUCKDATE disclaimer — health information, product accuracy, testimonials, and limitation of liability.',
  publisher: buildPublisherSchema(),
  isPartOf: { '@id': WEBSITE_ID },
  inLanguage: 'en-US',
  dateModified: '2026-01-01',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Disclaimer', item: `${BASE_URL}/disclaimer` },
    ],
  },
};

function ContactCard({ team }: { team: string }) {
  const { t } = useTranslation();
  return (
    <div className="bg-[#F7F5F1] rounded-2xl p-6 mt-4 space-y-2">
      <p><strong>{t('legal.contactTeam', { team })}</strong></p>
      <p>{t('legal.email')}: <a href="mailto:support@luckdate.com" className="text-[#D8CBB8] hover:underline">support@luckdate.com</a></p>
      <p>{t('legal.address')}: {t('legal.addressValue')}</p>
    </div>
  );
}

export default function DisclaimerPage() {
  const { t } = useTranslation();

  const sections: LegalSection[] = [
    {
      id: 'general',
      title: t('legal.disclaimer.general.title'),
      content: (
        <>
          <p>{t('legal.disclaimer.general.p1')}</p>
          <p>{t('legal.disclaimer.general.p2')}</p>
        </>
      ),
    },
    {
      id: 'health',
      title: t('legal.disclaimer.health.title'),
      content: (
        <>
          <p>{t('legal.disclaimer.health.p1')}</p>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mt-4">
            <p className="font-semibold text-amber-800 mb-2">{t('legal.disclaimer.health.noticeTitle')}</p>
            <p className="text-amber-700">{t('legal.disclaimer.health.noticeText')}</p>
          </div>
        </>
      ),
    },
    {
      id: 'product-info',
      title: t('legal.disclaimer.productInfo.title'),
      content: (
        <>
          <p>{t('legal.disclaimer.productInfo.desc')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            {(t('legal.disclaimer.productInfo.items', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'testimonials',
      title: t('legal.disclaimer.testimonials.title'),
      content: <p>{t('legal.disclaimer.testimonials.p1')}</p>,
    },
    {
      id: 'external-links',
      title: t('legal.disclaimer.externalLinks.title'),
      content: (
        <>
          <p>{t('legal.disclaimer.externalLinks.p1')}</p>
          <p>{t('legal.disclaimer.externalLinks.p2')}</p>
        </>
      ),
    },
    {
      id: 'limitation',
      title: t('legal.disclaimer.limitation.title'),
      content: (
        <>
          <p>{t('legal.disclaimer.limitation.desc')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            {(t('legal.disclaimer.limitation.items', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'accuracy',
      title: t('legal.disclaimer.accuracy.title'),
      content: <p>{t('legal.disclaimer.accuracy.p1')}</p>,
    },
    {
      id: 'contact',
      title: t('legal.disclaimer.contact.title'),
      content: (
        <>
          <p>{t('legal.disclaimer.contact.desc')}</p>
          <ContactCard team="Legal" />
        </>
      ),
    },
  ];

  return (
    <>
      <JsonLd data={disclaimerGraphJsonLd} />
      <LegalPageLayout
        title={t('legal.disclaimer.title')}
        subtitle={t('legal.disclaimer.subtitle')}
        lastUpdated={t('legal.disclaimer.date')}
        sections={sections}
      />
    </>
  );
}
