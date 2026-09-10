/**
 * 首页各 section 的 JSON-LD 结构化数据
 * 依据 .cursor/skills/seo-structured-data/SKILL.md
 */

export const BASE_URL = 'https://www.luckdate.com';
export const SITE_NAME = 'LUCKDATE';
export const SITE_ALTERNATE_NAMES = ['Luckdate', 'LuckDate', 'LUCKDATE Wellness'];
export const SITE_DESCRIPTION =
  'Premium supplements backed by science for longevity and wellness. Shop NAD+, collagen peptides, probiotics & more.';
export const WEBSITE_ID = `${BASE_URL}/#website`;
export const ORGANIZATION_ID = `${BASE_URL}/#organization`;
export const HOME_WEBPAGE_ID = `${BASE_URL}/#webpage`;
export const DEFAULT_LOGO_URL = `${BASE_URL}/logo.png`;
export const DEFAULT_OG_IMAGE_URL = `${BASE_URL}/og-image.png`;

/** 通用运费信息 - 美国境内免运费 */
export const SHIPPING_DETAILS = {
  '@type': 'OfferShippingDetails',
  shippingRate: {
    '@type': 'MonetaryAmount',
    value: '0',
    currency: 'USD',
  },
  shippingDestination: {
    '@type': 'DefinedRegion',
    addressCountry: 'US',
  },
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: {
      '@type': 'QuantitativeValue',
      minValue: 0,
      maxValue: 1,
      unitCode: 'DAY',
    },
    transitTime: {
      '@type': 'QuantitativeValue',
      minValue: 3,
      maxValue: 7,
      unitCode: 'DAY',
    },
  },
};

/** 通用退货政策 - 30天免费退货 */
export const MERCHANT_RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: 'US',
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 30,
  returnMethod: 'https://schema.org/ReturnByMail',
  returnFees: 'https://schema.org/FreeReturn',
};

export function absoluteUrl(url?: string | null, fallback = DEFAULT_OG_IMAGE_URL) {
  if (!url) return fallback;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

function imageObject(url: string, name: string, width?: number, height?: number) {
  return {
    '@type': 'ImageObject',
    url,
    contentUrl: url,
    name,
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };
}

/** 完整 Organization schema - 用于 @graph 多实体场景（首页等） */
export function buildOrganizationSchema(logoUrl = DEFAULT_LOGO_URL) {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
    url: BASE_URL,
    logo: imageObject(absoluteUrl(logoUrl, DEFAULT_LOGO_URL), `${SITE_NAME} logo`, 512, 512),
    image: imageObject(DEFAULT_OG_IMAGE_URL, `${SITE_NAME} brand image`, 1200, 630),
    description: SITE_DESCRIPTION,
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Los Angeles',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: 'support@luckdate.com',
        contactType: 'customer service',
        availableLanguage: ['English'],
      },
    ],
  };
}

/** 精简 Organization schema - 用于嵌入 publisher 字段（各子页面） */
export function buildPublisherSchema() {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
    url: BASE_URL,
    logo: imageObject(DEFAULT_LOGO_URL, `${SITE_NAME} logo`, 512, 512),
  };
}

/** 独立 WebSite Schema - RootLayout SSR 到 <head>，帮助 Google 识别网站名称 */
export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${BASE_URL}/`,
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
    description: 'Premium supplements for longevity & wellness',
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/products?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export interface ProductForSchema {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
}

export interface ArticleForSchema {
  id: number;
  title: string;
  coverImage: string;
  excerpt: string;
}

export interface FaqForSchema {
  id: number;
  question: string;
  answer: string;
}

export interface TestimonialForSchema {
  name: string;
  role: string;
  text: string;
  rating: number;
}

/** WebPage + OnlineStore - 首页页面级 Schema；WebSite/Organization 由 RootLayout 全站输出 */
export function buildBaseSchemas() {
  return [
    {
      '@type': 'WebPage',
      '@id': HOME_WEBPAGE_ID,
      url: `${BASE_URL}/`,
      name: `${SITE_NAME} - Premium Supplements for Longevity & Wellness`,
      description:
        'Premium supplements backed by science — NAD+, collagen peptides, probiotics & more. Fuel your active lifestyle with nature-backed formulas.',
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': ORGANIZATION_ID },
      primaryImageOfPage: imageObject(DEFAULT_OG_IMAGE_URL, `${SITE_NAME} premium supplements`, 1200, 630),
      image: DEFAULT_OG_IMAGE_URL,
      inLanguage: 'en-US',
    },
    {
      '@type': 'OnlineStore',
      '@id': `${BASE_URL}/#store`,
      name: SITE_NAME,
      url: `${BASE_URL}/`,
      description: 'Premium supplements designed to fuel your active lifestyle.',
      brand: { '@id': ORGANIZATION_ID },
      parentOrganization: { '@id': ORGANIZATION_ID },
      potentialAction: {
        '@type': 'BuyAction',
        target: `${BASE_URL}/products`,
      },
    },
  ];
}

/** Products section - Product + Offer + AggregateRating */
export function buildProductSchemas(products: ProductForSchema[]) {
  if (products.length === 0) return [];
  return products.map((p) => ({
    '@type': 'Product',
    '@id': `${BASE_URL}/#product-${p.id}`,
    name: p.name,
    description: p.description,
    image: absoluteUrl(p.image),
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    sku: `LUCKDATE-${p.id}`,
    offers: {
      '@type': 'Offer',
      price: String(p.price),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/product/${p.id}`,
      seller: { '@id': ORGANIZATION_ID },
      shippingDetails: SHIPPING_DETAILS,
      hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY,
    },
    ...(p.rating > 0 && p.reviews > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: p.rating,
        reviewCount: p.reviews,
        bestRating: 5,
        worstRating: 1,
      },
    } : {}),
  }));
}

/** Products section - ItemList 包装商品列表 */
export function buildProductListSchema(products: ProductForSchema[]) {
  if (products.length === 0) return null;
  return {
    '@type': 'ItemList',
    '@id': `${BASE_URL}/#product-list`,
    name: 'LUCKDATE Premium Supplements',
    description: 'Discover our complete range of premium supplements.',
    numberOfItems: products.length,
    itemListElement: products.slice(0, 12).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@id': `${BASE_URL}/#product-${p.id}` },
    })),
  };
}

/** Blog section - BlogPosting 每篇文章 */
export function buildBlogSchemas(articles: ArticleForSchema[]) {
  if (articles.length === 0) return [];
  return articles.map((a) => ({
    '@type': 'BlogPosting',
    '@id': `${BASE_URL}/#article-${a.id}`,
    headline: a.title,
    description: a.excerpt,
    image: absoluteUrl(a.coverImage),
    url: `${BASE_URL}/blog/${a.id}`,
    publisher: { '@id': ORGANIZATION_ID },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${a.id}`,
    },
  }));
}

/** Blog section - ItemList 包装文章列表 */
export function buildBlogListSchema(articles: ArticleForSchema[]) {
  if (articles.length === 0) return null;
  return {
    '@type': 'ItemList',
    '@id': `${BASE_URL}/#blog-list`,
    name: 'Latest from Our Blog',
    description: 'Health insights and wellness guides from LUCKDATE.',
    numberOfItems: articles.length,
    itemListElement: articles.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: { '@id': `${BASE_URL}/#article-${a.id}` },
    })),
  };
}

/** Testimonials section - Review + AggregateRating */
export function buildTestimonialSchemas(testimonials: TestimonialForSchema[]) {
  if (testimonials.length === 0) return [];
  const reviews = testimonials.map((t) => ({
    '@type': 'Review' as const,
    itemReviewed: {
      '@type': 'Product',
      '@id': `${BASE_URL}/#product-supplements`,
      name: 'LUCKDATE Premium Supplements Collection',
      description: 'Complete range of premium supplements including NAD+, NMN, collagen peptides, probiotics & more for longevity and wellness.',
      brand: {
        '@type': 'Brand',
        name: SITE_NAME,
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: '15.90',
        highPrice: '89.90',
        offerCount: '20+',
        url: `${BASE_URL}/products`,
        availability: 'https://schema.org/InStock',
        seller: { '@id': ORGANIZATION_ID },
        shippingDetails: SHIPPING_DETAILS,
        hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY,
      },
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: String(t.rating || 5),
      bestRating: '5',
      worstRating: '1',
    },
    name: `Review by ${t.name}`,
    reviewBody: t.text,
    author: {
      '@type': 'Person',
      name: t.name,
      jobTitle: t.role,
    },
    publisher: { '@id': ORGANIZATION_ID },
  }));
  return reviews;
}

/** Testimonials section - AggregateRating 汇总 */
export function buildTestimonialAggregateSchema(testimonials: TestimonialForSchema[]) {
  if (testimonials.length === 0) return null;
  const avgRating =
    testimonials.reduce((s, t) => s + (t.rating || 5), 0) / testimonials.length;
  return {
    '@type': 'AggregateRating',
    '@id': `${BASE_URL}/#aggregate-rating`,
    itemReviewed: {
      '@type': 'Product',
      '@id': `${BASE_URL}/#product-supplements`,
      name: 'LUCKDATE Premium Supplements Collection',
      description: 'Complete range of premium supplements including NAD+, NMN, collagen peptides, probiotics & more for longevity and wellness.',
      brand: {
        '@type': 'Brand',
        name: SITE_NAME,
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: '15.90',
        highPrice: '89.90',
        offerCount: '20+',
        url: `${BASE_URL}/products`,
        availability: 'https://schema.org/InStock',
        seller: { '@id': ORGANIZATION_ID },
        shippingDetails: SHIPPING_DETAILS,
        hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY,
      },
    },
    ratingValue: avgRating.toFixed(1),
    bestRating: '5',
    worstRating: '1',
    reviewCount: String(testimonials.length),
  };
}

/** FAQ section - FAQPage */
export function buildFaqSchema(faqs: FaqForSchema[]) {
  if (faqs.length === 0) return null;
  return {
    '@type': 'FAQPage',
    '@id': `${BASE_URL}/#geo-faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

/** Categories section - ItemList */
export function buildCategoriesSchema() {
  return {
    '@type': 'ItemList',
    '@id': `${BASE_URL}/#categories`,
    name: 'Find Your Perfect Match',
    description: 'Shop by need: Energy, Immunity, Beauty.',
    numberOfItems: 3,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Energy', url: `${BASE_URL}/product/1` },
      { '@type': 'ListItem', position: 2, name: 'Immunity', url: `${BASE_URL}/product/2` },
      { '@type': 'ListItem', position: 3, name: 'Beauty', url: `${BASE_URL}/product/3` },
    ],
  };
}

/** BrandLogos section - ItemList 认证/资质 */
export function buildBrandLogosSchema(certifications: string[]) {
  if (certifications.length === 0) return null;
  return {
    '@type': 'ItemList',
    '@id': `${BASE_URL}/#certifications`,
    name: 'Trusted by Industry Leaders',
    description: 'LUCKDATE certifications and quality standards.',
    numberOfItems: certifications.length,
    itemListElement: certifications.map((label, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: label,
    })),
  };
}

/** WhyChooseUs section - ItemList 特性 */
export function buildWhyChooseUsSchema(
  features: { title: string; description: string }[]
) {
  if (features.length === 0) return null;
  return {
    '@type': 'ItemList',
    '@id': `${BASE_URL}/#why-choose-us`,
    name: 'The LUCKDATE Difference',
    description: 'Why customers choose LUCKDATE supplements.',
    numberOfItems: features.length,
    itemListElement: features.map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: f.title,
      description: f.description,
    })),
  };
}

/** About section - AboutPage */
export function buildAboutSchema(description: string, features: string[]) {
  return {
    '@type': 'AboutPage',
    '@id': `${BASE_URL}/#about`,
    name: 'Where Nature Meets Science',
    description,
    about: { '@id': `${BASE_URL}/#organization` },
    ...(features.length > 0 && {
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: features.map((f, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: f,
        })),
      },
    }),
  };
}
