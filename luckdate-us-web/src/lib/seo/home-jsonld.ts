import en from '@/locales/en.json';
import type { FaqItem } from '@/lib/api/types';
import type { Product } from '@/sections/Products';
import type { ArticleDisplay } from '@/lib/api/mappers';
import {
  buildBaseSchemas,
  buildProductSchemas,
  buildProductListSchema,
  buildBlogSchemas,
  buildBlogListSchema,
  buildTestimonialSchemas,
  buildTestimonialAggregateSchema,
  buildFaqSchema,
  buildCategoriesSchema,
  buildBrandLogosSchema,
  buildWhyChooseUsSchema,
} from './home-schemas';

type GeoFaqItem = { question: string; answer: string };

function getGeoFaqs(): GeoFaqItem[] {
  const items = (en as { geoSeo?: { geoFaq?: { items?: GeoFaqItem[] } } }).geoSeo?.geoFaq?.items;
  return Array.isArray(items) ? items : [];
}

export function buildHomePageJsonLd(
  products: Product[],
  articles: ArticleDisplay[],
  apiFaqs: FaqItem[],
) {
  const testimonialsData = en.testimonials?.items ?? [];
  const testimonials = testimonialsData.slice(0, 6).map((item) => ({
    ...item,
    rating: 5,
  }));

  const whyChooseUsFeatures = [
    { title: en.whyChooseUs?.features?.cleanIngredients ?? '', description: en.whyChooseUs?.features?.cleanIngredientsDesc ?? '' },
    { title: en.whyChooseUs?.features?.scienceBacked ?? '', description: en.whyChooseUs?.features?.scienceBackedDesc ?? '' },
    { title: en.whyChooseUs?.features?.thirdParty ?? '', description: en.whyChooseUs?.features?.thirdPartyDesc ?? '' },
    { title: en.whyChooseUs?.features?.subscribe ?? '', description: en.whyChooseUs?.features?.subscribeDesc ?? '' },
  ];

  const certifications = [
    en.brandLogos?.certifications?.fda,
    en.brandLogos?.certifications?.gmp,
    en.brandLogos?.certifications?.natural,
    en.brandLogos?.certifications?.tested,
    en.brandLogos?.certifications?.vegan,
    en.brandLogos?.certifications?.premium,
  ].filter(Boolean) as string[];

  const productInput = products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    rating: p.rating,
    reviews: p.reviews || 0,
    image: p.image,
  }));

  const articleInput = articles.map((a) => ({
    id: a.id,
    title: a.title,
    coverImage: a.coverImage,
    excerpt: a.excerpt,
  }));

  const geoFaqs = getGeoFaqs();
  const mergedFaqs = [
    ...geoFaqs.map((f, i) => ({ id: -(i + 1), question: f.question, answer: f.answer })),
    ...apiFaqs,
  ];

  const graph = [
    ...buildBaseSchemas(),
    ...buildProductSchemas(productInput),
    ...buildTestimonialSchemas(testimonials),
    buildProductListSchema(productInput),
    buildBlogListSchema(articleInput),
    buildTestimonialAggregateSchema(testimonials),
    buildFaqSchema(mergedFaqs),
    buildCategoriesSchema(),
    buildBrandLogosSchema(certifications),
    buildWhyChooseUsSchema(whyChooseUsFeatures),
    ...buildBlogSchemas(articleInput),
  ].filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
