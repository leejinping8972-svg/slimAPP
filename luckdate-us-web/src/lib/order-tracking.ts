export const ORDER_CREATE_CHANNEL = {
  mall: 1,
  shilajit_1: 2,
  gummies_1: 3,
  body_purification: 4,
  disc_shilajit_1: 5,
  chatviva_patches: 6,
  slim_1: 7,
} as const;

export const ORDER_AD_SOURCE = {
  none: 0,
  fb: 1,
  tk: 2,
} as const;

export function resolveAdSourceByQuerySource(source: string | null | undefined): number {
  const normalizedSource = (source ?? '').trim().toLowerCase();
  if (normalizedSource === 'tk') {
    return ORDER_AD_SOURCE.tk;
  }
  if (normalizedSource === 'fb') {
    return ORDER_AD_SOURCE.fb;
  }
  return ORDER_AD_SOURCE.none;
}
