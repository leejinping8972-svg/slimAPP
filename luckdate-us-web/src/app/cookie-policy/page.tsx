'use client';

import { useTranslation } from 'react-i18next';
import LegalPageLayout, { type LegalSection } from '@/components/LegalPageLayout';
import JsonLd from '@/components/JsonLd';
import { buildPublisherSchema, BASE_URL, WEBSITE_ID } from '@/lib/seo/home-schemas';

const cookieGraphJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${BASE_URL}/cookie-policy/#page`,
  url: `${BASE_URL}/cookie-policy`,
  name: 'Cookie Policy | LUCKDATE',
  description: 'Understand how LUCKDATE uses cookies and similar technologies.',
  publisher: buildPublisherSchema(),
  isPartOf: { '@id': WEBSITE_ID },
  inLanguage: 'en-US',
  dateModified: '2026-01-01',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Cookie Policy', item: `${BASE_URL}/cookie-policy` },
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

function CookieTypeCard({ labelKey, textKey }: { labelKey: string; textKey: string }) {
  const { t } = useTranslation();
  return (
    <div className="bg-[#F7F5F1] rounded-2xl p-6">
      <p className="font-semibold text-[#4E554B] mb-2">{t(labelKey)}</p>
      <p>{t(textKey)}</p>
    </div>
  );
}

export default function CookiePolicyPage() {
  const { t } = useTranslation();

  const thirdPartyItems = t('legal.cookies.thirdParty.items', { returnObjects: true }) as { label: string; text: string }[];
  const optOutItems = t('legal.cookies.managing.optOutItems', { returnObjects: true }) as { label: string; text: string; url: string }[];
  const retentionItems = t('legal.cookies.retention.items', { returnObjects: true }) as { label: string; text: string }[];

  const sections: LegalSection[] = [
    {
      id: 'what-are-cookies',
      title: t('legal.cookies.what.title'),
      content: (
        <>
          <p>{t('legal.cookies.what.p1')}</p>
          <p>{t('legal.cookies.what.p2')}</p>
        </>
      ),
    },
    {
      id: 'types',
      title: t('legal.cookies.types.title'),
      content: (
        <div className="space-y-6">
          <CookieTypeCard labelKey="legal.cookies.types.essential.label" textKey="legal.cookies.types.essential.text" />
          <CookieTypeCard labelKey="legal.cookies.types.performance.label" textKey="legal.cookies.types.performance.text" />
          <CookieTypeCard labelKey="legal.cookies.types.functional.label" textKey="legal.cookies.types.functional.text" />
          <CookieTypeCard labelKey="legal.cookies.types.marketing.label" textKey="legal.cookies.types.marketing.text" />
        </div>
      ),
    },
    {
      id: 'third-party',
      title: t('legal.cookies.thirdParty.title'),
      content: (
        <>
          <p>{t('legal.cookies.thirdParty.desc')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            {thirdPartyItems.map((item, i) => (
              <li key={i}><strong>{item.label}</strong> — {item.text}</li>
            ))}
          </ul>
          <p className="mt-4">{t('legal.cookies.thirdParty.note')}</p>
        </>
      ),
    },
    {
      id: 'managing',
      title: t('legal.cookies.managing.title'),
      content: (
        <>
          <p>{t('legal.cookies.managing.desc')}</p>
          <p className="font-semibold text-[#4E554B] mt-4">{t('legal.cookies.managing.browserTitle')}</p>
          <p className="mt-2">{t('legal.cookies.managing.browserDesc')}</p>
          <p className="font-semibold text-[#4E554B] mt-4">{t('legal.cookies.managing.optOutTitle')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            {optOutItems.map((item, i) => (
              <li key={i}>
                {item.label}:{' '}
                <a href={item.url} className="text-[#D8CBB8] hover:underline" target="_blank" rel="noopener noreferrer">
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'retention',
      title: t('legal.cookies.retention.title'),
      content: (
        <>
          <p>{t('legal.cookies.retention.desc')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            {retentionItems.map((item, i) => (
              <li key={i}><strong>{item.label}</strong> — {item.text}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'updates',
      title: t('legal.cookies.updates.title'),
      content: <p>{t('legal.cookies.updates.p1')}</p>,
    },
    {
      id: 'contact',
      title: t('legal.cookies.contact.title'),
      content: (
        <>
          <p>{t('legal.cookies.contact.desc')}</p>
          <ContactCard team="Privacy" />
        </>
      ),
    },
  ];

  return (
    <>
      <JsonLd data={cookieGraphJsonLd} />
      <LegalPageLayout
        title={t('legal.cookies.title')}
        subtitle={t('legal.cookies.subtitle')}
        lastUpdated={t('legal.cookies.date')}
        sections={sections}
      />
    </>
  );
}
