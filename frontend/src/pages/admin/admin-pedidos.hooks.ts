import { useState, useEffect, useCallback } from 'react'
import { authFetch } from '../../lib/api'
import type { EstadoPedido, PedidoDetalle } from '../../lib/types'

export interface PedidoListItem {
  id: string
  usuarioId: string
  fechaCreacion: string
  estado: EstadoPedido
  fechaEstadoActualizado: string | null
  numeroSeguimiento: string | null
  total: number
  metodoEnvio: string
  codigoPostal: string
  items: {
    id: string
    varianteId: string
    sku: string
    talle: string
    color: string
    productoNombre: string
    cantidad: number
    precioUnitarioAlMomento: number
  }[]
}

interface PageResponse {
  content: PedidoListItem[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

interface FiltrosPedidos {
  estado: EstadoPedido | ''
  desde: string
  hasta: string
  page: number
  size: number
}

export function useAdminPedidos(filtros: FiltrosPedidos) {
  const [pedidos, setPedidos] = useState<PedidoListItem[]>([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPedidos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set('page', String(filtros.page))
      params.set('size', String(filtros.size))
      if (filtros.estado) params.set('estado', filtros.estado)
      if (filtros.desde) params.set('desde', new Date(filtros.desde).toISOString())
      if (filtros.hasta) {
        const hastaDate = new Date(filtros.hasta)
        hastaDate.setHours(23, 59, 59, 999)
        params.set('hasta', hastaDate.toISOString())
      }

      const res = await authFetch(`/api/admin/pedidos?${params.toString()}`)
      if (!res.ok) {
        if (res.status === 401) throw new Error('Tu sesión expiró. Iniciá sesión de nuevo.')
        throw new Error('Error al cargar pedidos')
      }
      const data: PageResponse = await res.json()
      setPedidos(data.content)
      setTotalElements(data.totalElements)
      setTotalPages(data.totalPages)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [filtros.estado, filtros.desde, filtros.hasta, filtros.page, filtros.size])

  useEffect(() => { fetchPedidos() }, [fetchPedidos])

  return { pedidos, totalElements, totalPages, currentPage: filtros.page, loading, error, refetch: fetchPedidos }
}

export function usePedidoDetalle() {
  const [pedido, setPedido] = useState<PedidoDetalle | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPedido = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authFetch(`/api/admin/pedidos/${id}`)
      if (!res.ok) {
        if (res.status === 401) throw new Error('Tu sesión expiró. Iniciá sesión de nuevo.')
        throw new Error('Error al cargar el pedido')
      }
      const data: PedidoDetalle = await res.json()
      setPedido(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  const cerrar = useCallback(() => { setPedido(null); setError(null) }, [])

  return { pedido, loading, error, fetchPedido, cerrar }
}

export function useCambiarEstado() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cambiar = useCallback(async (pedidoId: string, nuevoEstado: EstadoPedido, numeroSeguimiento?: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const body: { nuevoEstado: EstadoPedido; numeroSeguimiento?: string } = { nuevoEstado }
      if (numeroSeguimiento) body.numeroSeguimiento = numeroSeguimiento

      const res = await authFetch(`/api/admin/pedidos/${pedidoId}/estado`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        const msg = data?.mensaje || data?.error || 'Error al cambiar estado'
        setError(msg)
        return false
      }
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const limpiarError = useCallback(() => setError(null), [])

  return { loading, error, cambiar, limpiarError }
}
