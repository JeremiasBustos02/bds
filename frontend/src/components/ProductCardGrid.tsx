import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { ProductoResponse } from '../lib/types'
import MiniProductPreview from '../scene/MiniProductPreview'
import { CATEGORY_COLORS, CATEGORY_BG } from '../lib/categoryColors'

export default function ProductCardGrid({
  product,
}: {
  product: ProductoResponse
}) {
  const navigate = useNavigate()
  const color = CATEGORY_COLORS[product.categoria]
  const bg = CATEGORY_BG[product.categoria]
  const [hovered, setHovered] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = useCallback(() => {
    setHovered(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setShowPreview(true), 250)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setShowPreview(false)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
    >
      <div
        onClick={() => navigate(`/producto/${product.slug}`)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 transition-all duration-300"
        style={{
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          zIndex: hovered ? 10 : 1,
        }}
      >
        <div
          className={`relative flex aspect-[4/5] items-center justify-center bg-gradient-to-br ${bg}`}
        >
          <motion.div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: color }}
            animate={{ opacity: showPreview ? 0 : 0.3 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </motion.div>

          <AnimatePresence>
            {showPreview && (
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

        <div className="p-3 sm:p-4">
          <h3 className="text-sm sm:text-base font-semibold text-white">
            {product.nombre}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-neutral-400">
            ${product.precioBase.toLocaleString('es-AR')}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
