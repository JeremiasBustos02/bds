/**
 * Altura objetivo (en unidades 3D) del modelo GLB por contexto de renderizado.
 *
 * GarmentModel calcula el multiplicador de escala como:
 *   computedScale = targetHeight / bboxHeight
 *
 * Los valores se calibraron para que el modelo ocupe aproximadamente
 * el % indicado del alto visible de la cámara en cada contexto.
 */
export const GARMENT_SCALE = {
  /** Página de producto — modelo único, ~65% del viewport */
  productPage: 2.7,
  /** Hero carousel desktop — 3 modelos en arco decorativo */
  heroCarouselDesktop: 1.2,
  /** Hero carousel mobile — modelo único, más prominente */
  heroCarouselMobile: 1.8,
  /** Mini preview en cards de producto */
  miniPreview: 1.5,
} as const
