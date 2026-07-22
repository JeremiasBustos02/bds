import { useState, useEffect } from 'react'
import type { ProductoResponse, Categoria } from '../lib/types'

interface CacheEntry {
  products: ProductoResponse[]
  timestamp: number
}

const cache = new Map<string, CacheEntry>()
const CACHE_TTL = 30_000

interface UseProductsResult {
  products: ProductoResponse[]
  loading: boolean
  error: string | null
}

export function useProducts(categoria?: Categoria): UseProductsResult {
  const [products, setProducts] = useState<ProductoResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const cacheKey = categoria ?? '__ALL__'

  useEffect(() => {
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setProducts(cached.products)
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchProducts() {
      if (!cached) setLoading(true)
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
          cache.set(cacheKey, { products: data.content, timestamp: Date.now() })
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
  }, [categoria, cacheKey])

  return { products, loading, error }
}
