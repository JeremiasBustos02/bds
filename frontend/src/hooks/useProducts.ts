import { useState, useEffect } from 'react'
import type { ProductoResponse } from '../lib/types'

interface UseProductsResult {
  products: ProductoResponse[]
  loading: boolean
  error: string | null
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<ProductoResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchProducts() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/productos?size=20')

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
  }, [])

  return { products, loading, error }
}
