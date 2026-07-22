export type Categoria = 'REMERAS' | 'BUZOS' | 'PANTALONES' | 'ACCESORIOS'
export type RolUsuario = 'CLIENTE' | 'ADMIN'

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

export interface VarianteCreatePayload {
  talle: Talle
  color: string
  precioAdicional?: number
  cantidadInicial: number
}

export interface ProductoCreatePayload {
  nombre: string
  descripcion: string
  precioBase: number
  categoria: Categoria
  slug?: string
  modelo3dUrl?: string
  detalleTela?: string
  detalleCorte?: string
  detalleCostura?: string
  variantes: VarianteCreatePayload[]
}

export interface ProductoUpdatePayload {
  nombre: string
  descripcion: string
  precioBase: number
  categoria: Categoria
  slug?: string
  modelo3dUrl?: string
  detalleTela?: string
  detalleCorte?: string
  detalleCostura?: string
  activo: boolean
}

export type EstadoPedido = 'CONFIRMADO' | 'PREPARANDO' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO'

export interface ItemPedidoAdmin {
  id: string
  varianteId: string
  sku: string
  talle: string
  color: string
  productoNombre: string
  categoria: Categoria
  cantidad: number
  precioUnitarioAlMomento: number
}

export interface PedidoDetalle {
  id: string
  fechaCreacion: string
  estado: EstadoPedido
  fechaEstadoActualizado: string | null
  numeroSeguimiento: string | null
  total: number
  metodoEnvio: string
  codigoPostal: string
  envCalle: string | null
  envNumero: string | null
  envPiso: string | null
  envLocalidad: string | null
  envProvincia: string | null
  usuarioNombre: string
  usuarioEmail: string
  items: ItemPedidoAdmin[]
  datosFacturacion: DatosFacturacion | null
}

export interface Direccion {
  id: string
  alias: string
  calle: string
  numero: string
  ciudad: string
  provincia: string
  codigoPostal: string
  esPredeterminada: boolean
}

export type TipoDocumento = 'DNI' | 'CUIT'

export interface DatosFacturacion {
  tipoDocumento: TipoDocumento
  numeroDocumento: string
  nombreRazonSocial: string
  telefono: string
  emailContacto: string
  mismaDireccionEnvio: boolean
  direccionCalle: string | null
  direccionNumero: string | null
  direccionCiudad: string | null
  direccionProvincia: string | null
  direccionCodigoPostal: string | null
}
