'use client';

import { useTranslation } from 'react-i18next';
import LegalPageLayout, { type LegalSection } from '@/components/LegalPageLayout';
import JsonLd from '@/components/JsonLd';
import { buildPublisherSchema, BASE_URL, WEBSITE_ID } from '@/lib/seo/home-schemas';

const privacyGraphJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${BASE_URL}/privacy-policy/#page`,
  url: `${BASE_URL}/privacy-policy`,
  name: 'Privacy Policy | LUCKDATE',
  description: 'Learn how LUCKDATE collects, uses, and protects your personal information.',
  publisher: buildPublisherSchema(),
  isPartOf: { '@id': WEBSITE_ID },
  inLanguage: 'en-US',
  dateModified: '2026-01-01',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: `${BASE_URL}/privacy-policy` },
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

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  const sharing = t('legal.privacy.sharing.items', { returnObjects: true }) as { label: string; text: string }[];

  const sections: LegalSection[] = [
    {
      id: 'introduction',
      title: t('legal.privacy.intro.title'),
      content: (
        <>
          <p>{t('legal.privacy.intro.p1')}</p>
          <p>{t('legal.privacy.intro.p2')}</p>
        </>
      ),
    },
    {
      id: 'information-we-collect',
      title: t('legal.privacy.collect.title'),
      content: (
        <>
          <p>{t('legal.privacy.collect.desc')}</p>
          <p className="font-semibold text-[#4E554B] mt-4">{t('legal.privacy.collect.personalTitle')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            {(t('legal.privacy.collect.personal', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="font-semibold text-[#4E554B] mt-4">{t('legal.privacy.collect.autoTitle')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            {(t('legal.privacy.collect.auto', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'how-we-use',
      title: t('legal.privacy.howWeUse.title'),
      content: (
        <>
          <p>{t('legal.privacy.howWeUse.desc')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            {(t('legal.privacy.howWeUse.items', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'sharing',
      title: t('legal.privacy.sharing.title'),
      content: (
        <>
          <p>{t('legal.privacy.sharing.desc')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            {sharing.map((item, i) => (
              <li key={i}><strong>{item.label}:</strong> {item.text}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'data-security',
      title: t('legal.privacy.security.title'),
      content: <p>{t('legal.privacy.security.p1')}</p>,
    },
    {
      id: 'your-rights',
      title: t('legal.privacy.rights.title'),
      content: (
        <>
          <p>{t('legal.privacy.rights.desc')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            {(t('legal.privacy.rights.items', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="mt-4">
            {t('legal.privacy.rights.contact')}{' '}
            <a href="mailto:support@luckdate.com" className="text-[#D8CBB8] hover:underline">support@luckdate.com</a>.
          </p>
        </>
      ),
    },
    {
      id: 'children',
      title: t('legal.privacy.children.title'),
      content: <p>{t('legal.privacy.children.p1')}</p>,
    },
    {
      id: 'changes',
      title: t('legal.privacy.changes.title'),
      content: <p>{t('legal.privacy.changes.p1')}</p>,
    },
    {
      id: 'contact',
      title: t('legal.privacy.contact.title'),
      content: (
        <>
          <p>{t('legal.privacy.contact.desc')}</p>
          <ContactCard team="Privacy" />
        </>
      ),
    },
  ];

  return (
    <>
      <JsonLd data={privacyGraphJsonLd} />
      <LegalPageLayout
        title={t('legal.privacy.title')}
        subtitle={t('legal.privacy.subtitle')}
        lastUpdated={t('legal.privacy.date')}
        sections={sections}
      />
    </>
  );
}
