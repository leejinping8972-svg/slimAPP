'use client';

import { useTranslation } from 'react-i18next';
import LegalPageLayout, { type LegalSection } from '@/components/LegalPageLayout';
import JsonLd from '@/components/JsonLd';
import { buildPublisherSchema, BASE_URL, WEBSITE_ID } from '@/lib/seo/home-schemas';

const termsGraphJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${BASE_URL}/terms-of-service/#page`,
  url: `${BASE_URL}/terms-of-service`,
  name: 'Terms of Service | LUCKDATE',
  description: 'LUCKDATE Terms of Service — eligibility, accounts, orders, shipping, returns, and more.',
  publisher: buildPublisherSchema(),
  isPartOf: { '@id': WEBSITE_ID },
  inLanguage: 'en-US',
  dateModified: '2026-01-01',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Terms of Service', item: `${BASE_URL}/terms-of-service` },
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

export default function TermsOfServicePage() {
  const { t } = useTranslation();

  const sections: LegalSection[] = [
    {
      id: 'acceptance',
      title: t('legal.terms.acceptance.title'),
      content: (
        <>
          <p>{t('legal.terms.acceptance.p1')}</p>
          <p>{t('legal.terms.acceptance.p2')}</p>
        </>
      ),
    },
    {
      id: 'eligibility',
      title: t('legal.terms.eligibility.title'),
      content: <p>{t('legal.terms.eligibility.p1')}</p>,
    },
    {
      id: 'accounts',
      title: t('legal.terms.accounts.title'),
      content: (
        <>
          <p>{t('legal.terms.accounts.desc')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            {(t('legal.terms.accounts.items', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'orders',
      title: t('legal.terms.orders.title'),
      content: (
        <>
          <p>{t('legal.terms.orders.desc')}</p>
          <p className="font-semibold text-[#4E554B] mt-4">{t('legal.terms.orders.pricingTitle')}</p>
          <p className="mt-2">{t('legal.terms.orders.pricingDesc')}</p>
          <p className="font-semibold text-[#4E554B] mt-4">{t('legal.terms.orders.paymentTitle')}</p>
          <p className="mt-2">{t('legal.terms.orders.paymentDesc')}</p>
        </>
      ),
    },
    {
      id: 'shipping-returns',
      title: t('legal.terms.shipping.title'),
      content: (
        <>
          <p>{t('legal.terms.shipping.desc')}</p>
          <p className="font-semibold text-[#4E554B] mt-4">{t('legal.terms.shipping.returnTitle')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            {(t('legal.terms.shipping.returnItems', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'intellectual-property',
      title: t('legal.terms.ip.title'),
      content: (
        <>
          <p>{t('legal.terms.ip.p1')}</p>
          <p>{t('legal.terms.ip.p2')}</p>
        </>
      ),
    },
    {
      id: 'prohibited-use',
      title: t('legal.terms.prohibited.title'),
      content: (
        <>
          <p>{t('legal.terms.prohibited.desc')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            {(t('legal.terms.prohibited.items', { returnObjects: true }) as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'limitation',
      title: t('legal.terms.limitation.title'),
      content: (
        <>
          <p>{t('legal.terms.limitation.p1')}</p>
          <p>{t('legal.terms.limitation.p2')}</p>
        </>
      ),
    },
    {
      id: 'governing-law',
      title: t('legal.terms.governing.title'),
      content: <p>{t('legal.terms.governing.p1')}</p>,
    },
    {
      id: 'contact',
      title: t('legal.terms.contact.title'),
      content: (
        <>
          <p>{t('legal.terms.contact.desc')}</p>
          <ContactCard team="Legal" />
        </>
      ),
    },
  ];

  return (
    <>
      <JsonLd data={termsGraphJsonLd} />
      <LegalPageLayout
        title={t('legal.terms.title')}
        subtitle={t('legal.terms.subtitle')}
        lastUpdated={t('legal.terms.date')}
        sections={sections}
      />
    </>
  );
}
