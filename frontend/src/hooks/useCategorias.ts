import { useState, useEffect } from 'react'
import type { Categoria } from '../lib/types'

interface UseCategoriasResult {
  categorias: Categoria[]
  loading: boolean
}

export function useCategorias(): UseCategoriasResult {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchCategorias() {
      try {
        const res = await fetch('/api/productos/categorias')
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const data = (await res.json()) as Categoria[]
        if (!cancelled) {
          setCategorias(data)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchCategorias()

    return () => {
      cancelled = true
    }
  }, [])

  return { categorias, loading }
}
