import { useState, useEffect } from 'react'
import type { ProductoResponse } from '../lib/types'

interface UseProductResult {
  product: ProductoResponse | null
  loading: boolean
  error: string | null
}

export function useProduct(slug: string | undefined): UseProductResult {
  const [product, setProduct] = useState<ProductoResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      setError('Slug no especificado')
      return
    }

    let cancelled = false

    async function fetchProduct() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/productos/slug/${encodeURIComponent(slug as string)}`)

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Producto no encontrado')
          }
          throw new Error(`Error ${res.status}: ${res.statusText}`)
        }

        const data = (await res.json()) as ProductoResponse

        if (!cancelled) {
          setProduct(data)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error desconocido')
          setLoading(false)
        }
      }
    }

    fetchProduct()

    return () => {
      cancelled = true
    }
  }, [slug])

  return { product, loading, error }
}
