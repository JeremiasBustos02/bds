import { useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { ProductoResponse, Categoria } from '../lib/types'
import MiniProductPreview from '../scene/MiniProductPreview'
import { CATEGORY_COLORS, CATEGORY_BG } from '../lib/categoryColors'

type FilterOption = 'TODOS' | Categoria

const FILTERS: { label: string; value: FilterOption }[] = [
  { label: 'Todos', value: 'TODOS' },
  { label: 'Remeras', value: 'REMERAS' },
  { label: 'Buzos', value: 'BUZOS' },
  { label: 'Pantalones', value: 'PANTALONES' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const },
  },
}

export default function ProductCarousel({
  products,
}: {
  products: ProductoResponse[]
}) {
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState<FilterOption>('TODOS')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const previewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = useCallback((id: string) => {
    setHoveredId(id)
    if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current)
    previewTimeoutRef.current = setTimeout(() => setPreviewId(id), 250)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null)
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current)
      previewTimeoutRef.current = null
    }
    setPreviewId(null)
  }, [])

  const filtered =
    activeFilter === 'TODOS'
      ? products
      : products.filter((p) => p.categoria === activeFilter)

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.6
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }, [])

  return (
    <section id="categorias" className="px-6 py-24 md:px-12">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Descubrí la colección
          </h2>
        </div>

        <div className="hidden items-center gap-1.5 rounded-full bg-neutral-900 p-1 md:flex">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setActiveFilter(f.value)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                activeFilter === f.value
                  ? 'bg-white text-neutral-900'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scroll('left')}
          className="absolute -left-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-neutral-800/80 p-2 text-neutral-300 backdrop-blur-sm transition-all hover:bg-neutral-700 hover:text-white md:flex"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => scroll('right')}
          className="absolute -right-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full bg-neutral-800/80 p-2 text-neutral-300 backdrop-blur-sm transition-all hover:bg-neutral-700 hover:text-white md:flex"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <motion.div
          key={activeFilter}
          ref={scrollRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filtered.map((product) => {
            const color = CATEGORY_COLORS[product.categoria] ?? '#6366f1'
            const bg = CATEGORY_BG[product.categoria] ?? 'from-neutral-600/20 to-neutral-900/30'
            const isHovered = hoveredId === product.id

            return (
              <motion.div
                key={product.id}
                variants={itemVariants}
                onMouseEnter={() => handleMouseEnter(product.id)}
                onMouseLeave={handleMouseLeave}
                className="snap-start shrink-0 w-[44vw] min-w-[140px] max-w-[180px] sm:w-[28vw] sm:min-w-[220px] sm:max-w-[320px]"
              >
                <div
                  onClick={() => navigate(`/producto/${product.slug}`)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 transition-all duration-300"
                  style={{
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    zIndex: isHovered ? 10 : 1,
                  }}
                >
                  <div
                    className={`relative flex aspect-[4/5] items-center justify-center bg-gradient-to-br ${bg}`}
                  >
                    <motion.div
                      className="flex h-16 w-16 items-center justify-center rounded-full"
                      style={{ backgroundColor: color }}
                      animate={{ opacity: previewId === product.id ? 0 : 0.3 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </motion.div>

                    <AnimatePresence>
                      {previewId === product.id && (
                        <motion.div
                          key="3d-preview"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 z-10"
                        >
                          <MiniProductPreview
                            color={color}
                            modelo3dUrl={product.modelo3dUrl}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-semibold text-white">
                      {product.nombre}
                    </h3>
                    <p className="mt-1 text-base font-bold text-neutral-300">
                      ${product.precioBase.toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5 md:hidden">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setActiveFilter(f.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
              activeFilter === f.value
                ? 'bg-white text-neutral-900'
                : 'text-neutral-500'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </section>
  )
}
