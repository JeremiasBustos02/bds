import type { EstadoPedido } from './types'

export const BADGE_ESTADO: Record<EstadoPedido, string> = {
  CONFIRMADO: 'bg-blue-500/10 text-blue-400',
  PREPARANDO: 'bg-amber-500/10 text-amber-400',
  ENVIADO: 'bg-violet-500/10 text-violet-400',
  ENTREGADO: 'bg-emerald-500/10 text-emerald-400',
  CANCELADO: 'bg-red-500/10 text-red-400',
}

export const LABEL_ESTADO: Record<EstadoPedido, string> = {
  CONFIRMADO: 'Confirmado',
  PREPARANDO: 'Preparando',
  ENVIADO: 'Enviado',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}

export const TIMELINE_ESTADOS: EstadoPedido[] = [
  'CONFIRMADO',
  'PREPARANDO',
  'ENVIADO',
  'ENTREGADO',
]

export const TIMELINE_DESCRIPCION: Record<EstadoPedido, string> = {
  CONFIRMADO: 'Recibimos tu pedido y confirmamos el pago.',
  PREPARANDO: 'Estamos preparando tu pedido para el envío.',
  ENVIADO: 'Tu pedido está en camino.',
  ENTREGADO: 'Tu pedido fue entregado con éxito.',
  CANCELADO: 'Este pedido fue cancelado.',
}
