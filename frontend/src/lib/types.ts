export type Categoria = 'REMERAS' | 'BUZOS' | 'PANTALONES' | 'ACCESORIOS'

export interface CartItem {
  productoId: string
  varianteId: string
  nombre: string
  precio: number
  talle: Talle
  color: string
  cantidad: number
  imagenPlaceholder: string
}
export type Talle = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

export interface VarianteConStock {
  id: string
  talle: Talle
  color: string
  sku: string
  precioAdicional: number
  stockDisponible: number
}

export interface ProductoResponse {
  id: string
  nombre: string
  descripcion: string
  precioBase: number
  categoria: Categoria
  activo: boolean
  slug: string
  modelo3dUrl: string | null
  detalleTela: string | null
  detalleCorte: string | null
  detalleCostura: string | null
  fechaCreacion: string
  variantes: VarianteConStock[]
}
