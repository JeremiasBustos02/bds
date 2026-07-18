import { useState, useEffect } from 'react'
import type { ProductoResponse, Categoria } from '../lib/types'

interface UseProductsResult {
  products: ProductoResponse[]
  loading: boolean
  error: string | null
}

export function useProducts(categoria?: Categoria): UseProductsResult {
  const [products, setProducts] = useState<ProductoResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchProducts() {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        params.set('size', '20')
        if (categoria) params.set('categoria', categoria)
        const res = await fetch(`/api/productos?${params}`)

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`)
        }

        const data = (await res.json()) as { content: ProductoResponse[] }

        if (!cancelled) {
          setProducts(data.content)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error desconocido')
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      cancelled = true
    }
  }, [categoria])

  return { products, loading, error }
}
