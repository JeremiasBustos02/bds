import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Categoria } from '../lib/types'
import { useProducts } from '../hooks/useProducts'
import FloatingNavbar from '../components/FloatingNavbar'
import ProductCardGrid from '../components/ProductCardGrid'
import GlassPanel from '../components/GlassPanel'
import FatFooter from '../components/FatFooter'

const CATEGORY_LABEL: Record<string, string> = {
  REMERAS: 'Remeras',
  BUZOS: 'Buzos',
  PANTALONES: 'Pantalones',
  ACCESORIOS: 'Accesorios',
}

const CATEGORY_DESC: Record<string, string> = {
  REMERAS: 'Minimalismo, comfort y líneas limpias. Prendas que funcionan en cualquier contexto.',
  BUZOS: 'Para el frío y para el mood. Capas con personalidad, pensadas para durar.',
  PANTALONES: 'Siluetas definidas, telas que respiran. De la city al finde.',
  ACCESORIOS: 'El detalle que completa el look. Proximamente.',
}

const slugToCategoria = (slug: string): Categoria | null => {
  const map: Record<string, Categoria> = {
    remeras: 'REMERAS',
    buzos: 'BUZOS',
    pantalones: 'PANTALONES',
    accesorios: 'ACCESORIOS',
  }
  return map[slug.toLowerCase()] ?? null
}

export default function CategoryPage() {
  const { nombre } = useParams<{ nombre: string }>()
  const categoria = nombre ? slugToCategoria(nombre) : null
  const { products, loading, error } = useProducts(categoria ?? undefined)
  const navigate = useNavigate()

  const label = categoria ? CATEGORY_LABEL[categoria] : null
  const desc = categoria ? CATEGORY_DESC[categoria] : null

  if (!categoria) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <FloatingNavbar />
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          >
            <h1 className="text-3xl font-bold text-white">Categoría no encontrada</h1>
            <p className="mt-3 text-lg text-neutral-400">
              La categoría que buscás no existe. Revisá el nombre e intentá de nuevo.
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-8 rounded-full bg-white px-10 py-3.5 text-base font-semibold text-neutral-900 transition-all hover:bg-neutral-200 active:scale-[0.98]"
            >
              Volver al inicio
            </button>
          </motion.div>
        </div>
        <FatFooter />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <FloatingNavbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-700" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <FloatingNavbar />
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl font-bold text-white">Error</h1>
          <p className="mt-2 text-neutral-400">{error}</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 rounded-full bg-white px-8 py-3 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <FloatingNavbar />

      <div className="mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-6 lg:px-8">
        {/* Header de categoría */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="mb-10"
        >
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
            {label}
          </h1>
          {desc && (
            <p className="mt-3 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
              {desc}
            </p>
          )}
          <p className="mt-2 text-sm font-medium text-neutral-500">
            {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </p>
        </motion.div>

        {/* Grid de productos */}
        {products.length === 0 ? (
          <GlassPanel variant="dense" className="rounded-2xl p-10 text-center">
            <svg
              className="mx-auto mb-5 h-14 w-14 text-neutral-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h2 className="text-xl font-bold text-white">No hay productos en esta categoría</h2>
            <p className="mt-2 text-sm text-neutral-400">
              Todavía no hay productos disponibles acá. Volvé pronto o explorá otras categorías.
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-6 rounded-full bg-white px-8 py-3 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200 active:scale-95"
            >
              Ver colección completa
            </button>
          </GlassPanel>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5 lg:gap-6">
            {products.map((product) => (
              <ProductCardGrid key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <FatFooter />
    </div>
  )
}
