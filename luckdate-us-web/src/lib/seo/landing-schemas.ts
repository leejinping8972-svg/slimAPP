import { BASE_URL, buildPublisherSchema, MERCHANT_RETURN_POLICY, SHIPPING_DETAILS, WEBSITE_ID } from './home-schemas';

export function buildLandingProductJsonLd(options: {
  path: string;
  name: string;
  description: string;
  image?: string;
  price?: string;
}) {
  const url = `${BASE_URL}${options.path.startsWith('/') ? options.path : `/${options.path}`}`;
  const productId = `${url}#product`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': productId,
        name: options.name,
        description: options.description,
        image: options.image ? (options.image.startsWith('http') ? options.image : `${BASE_URL}${options.image}`) : undefined,
        brand: { '@type': 'Brand', name: 'LUCKDATE' },
        offers: {
          '@type': 'Offer',
          price: options.price ?? '29.99',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url,
          shippingDetails: SHIPPING_DETAILS,
          hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY,
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: options.name,
        description: options.description,
        isPartOf: { '@id': WEBSITE_ID },
        publisher: buildPublisherSchema(),
        inLanguage: 'en-US',
        about: { '@id': productId },
      },
    ],
  };
}
