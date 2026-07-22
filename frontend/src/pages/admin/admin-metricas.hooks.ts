import { useState, useEffect, useCallback } from 'react'
import { authFetch } from '../../lib/api'
import type { Categoria, EstadoPedido } from '../../lib/types'

export interface ProductoTop {
  nombre: string
  cantidadVendida: number
}

export interface StockBajo {
  id: string
  nombre: string
  slug: string
  categoria: Categoria
  stockTotal: number
}

export interface MetricasResponse {
  ventasTotales: number
  cantidadPedidos: number
  ticketPromedio: number
  topProductos: ProductoTop[]
  ventasPorDia: Record<string, number>
  ventasPorCategoria: Record<Categoria, number>
  pedidosPorEstado: Record<EstadoPedido, number>
  tasaCancelacion: number
  stockBajo: StockBajo[]
}

export function useMetricas(desde?: string, hasta?: string) {
  const [metricas, setMetricas] = useState<MetricasResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetricas = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (desde) params.set('desde', desde + 'T00:00:00.000Z')
      if (hasta) params.set('hasta', hasta + 'T23:59:59.999Z')
      const qs = params.toString()
      const res = await authFetch(`/api/admin/metricas${qs ? `?${qs}` : ''}`)
      if (!res.ok) {
        if (res.status === 401) throw new Error('Tu sesión expiró. Iniciá sesión de nuevo.')
        throw new Error('Error al cargar métricas')
      }
      const data: MetricasResponse = await res.json()
      setMetricas(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [desde, hasta])

  useEffect(() => { fetchMetricas() }, [fetchMetricas])

  return { metricas, loading, error, refetch: fetchMetricas }
}
