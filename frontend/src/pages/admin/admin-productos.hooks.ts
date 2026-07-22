import { useState, useEffect, useCallback } from 'react'
import type { ProductoResponse, ProductoCreatePayload, ProductoUpdatePayload } from '../../lib/types'
import { authFetch } from '../../lib/api'

export function useAdminProductos() {
  const [productos, setProductos] = useState<ProductoResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await authFetch('/api/admin/productos')
      if (!res.ok) {
        if (res.status === 401) throw new Error('Tu sesión expiró. Iniciá sesión de nuevo.')
        throw new Error('Error al cargar productos')
      }
      const data = (await res.json()) as ProductoResponse[]
      setProductos(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { productos, loading, error, refetch }
}

export function useProductoForm(id?: string) {
  const [producto, setProducto] = useState<ProductoResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)

    let cancelled = false

    authFetch(`/api/productos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar el producto')
        return res.json()
      })
      .then((data: ProductoResponse) => {
        if (!cancelled) {
          setProducto(data)
          setLoading(false)
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Error desconocido')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const crear = async (data: ProductoCreatePayload): Promise<ProductoResponse | null> => {
    setError(null)
    try {
      const res = await authFetch('/api/productos', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = (await res.json()) as { mensaje?: string; error?: string }
        throw new Error(err.mensaje ?? err.error ?? 'Error al crear producto')
      }
      return (await res.json()) as ProductoResponse
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
      return null
    }
  }

  const actualizar = async (
    productoId: string,
    data: ProductoUpdatePayload,
  ): Promise<ProductoResponse | null> => {
    setError(null)
    try {
      const res = await authFetch(`/api/productos/${productoId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = (await res.json()) as { mensaje?: string; error?: string }
        throw new Error(err.mensaje ?? err.error ?? 'Error al actualizar producto')
      }
      return (await res.json()) as ProductoResponse
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
      return null
    }
  }

  return { producto, loading, error, crear, actualizar }
}
