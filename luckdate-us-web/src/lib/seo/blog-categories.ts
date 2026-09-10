export const BLOG_CATEGORY_IDS = [
  'all',
  'guides',
  'comparisons',
  'wellness-system',
  'ingredient-science',
  'use-cases',
] as const;

export type BlogCategoryId = typeof BLOG_CATEGORY_IDS[number];

export const BLOG_CATEGORY_LABEL_KEYS: Record<Exclude<BlogCategoryId, 'all'>, string> = {
  guides: 'geoSeo.blog.categories.guides',
  comparisons: 'geoSeo.blog.categories.comparisons',
  'wellness-system': 'geoSeo.blog.categories.wellnessSystem',
  'ingredient-science': 'geoSeo.blog.categories.ingredientScience',
  'use-cases': 'geoSeo.blog.categories.useCases',
};

/** Infer topic cluster from title when CMS category is unavailable */
export function inferBlogCategory(title: string): Exclude<BlogCategoryId, 'all'> {
  const t = title.toLowerCase();
  if (t.includes(' vs ') || t.includes('versus') || t.includes('compare') || t.includes('comparison')) {
    return 'comparisons';
  }
  if (t.includes('wellness system') || t.includes('nutritionist') || t.includes('app +') || t.includes('product + app')) {
    return 'wellness-system';
  }
  if (t.includes('ingredient') || t.includes('nmn') || t.includes('nad') || t.includes('formula') || t.includes('science')) {
    return 'ingredient-science';
  }
  if (t.includes('busy') || t.includes('professional') || t.includes('after 40') || t.includes('use case') || t.includes('routine')) {
    return 'use-cases';
  }
  if (t.includes('how to') || t.includes('how-to') || t.includes('guide') || t.includes('what is')) {
    return 'guides';
  }
  return 'guides';
}

export function blogCategoryToArticleSection(category: Exclude<BlogCategoryId, 'all'>): string {
  const map: Record<Exclude<BlogCategoryId, 'all'>, string> = {
    guides: 'Guides',
    comparisons: 'Comparisons',
    'wellness-system': 'Wellness System',
    'ingredient-science': 'Ingredient Science',
    'use-cases': 'Use Cases',
  };
  return map[category];
}
