import { useState, useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ProductoResponse, Categoria, Talle } from '../lib/types'
import GlassPanel from './GlassPanel'

const CATEGORY_LABEL: Record<Categoria, string> = {
  REMERAS: 'Remeras',
  BUZOS: 'Buzos',
  PANTALONES: 'Pantalones',
  ACCESORIOS: 'Accesorios',
}

const CATEGORY_BG: Record<Categoria, string> = {
  REMERAS: 'from-indigo-600/20 to-indigo-900/30',
  BUZOS: 'from-violet-600/20 to-violet-900/30',
  PANTALONES: 'from-amber-600/20 to-amber-900/30',
  ACCESORIOS: 'from-emerald-600/20 to-emerald-900/30',
}

const CATEGORY_GALLERY: Record<Categoria, string[]> = {
  REMERAS: [
    'from-indigo-600/20 to-indigo-900/30',
    'from-indigo-500/15 to-indigo-800/35',
    'from-indigo-700/25 to-indigo-950/40',
  ],
  BUZOS: [
    'from-violet-600/20 to-violet-900/30',
    'from-violet-500/15 to-violet-800/35',
    'from-violet-700/25 to-violet-950/40',
  ],
  PANTALONES: [
    'from-amber-600/20 to-amber-900/30',
    'from-amber-500/15 to-amber-800/35',
    'from-amber-700/25 to-amber-950/40',
  ],
  ACCESORIOS: [
    'from-emerald-600/20 to-emerald-900/30',
    'from-emerald-500/15 to-emerald-800/35',
    'from-emerald-700/25 to-emerald-950/40',
  ],
}

const CATEGORY_TAG_BG: Record<Categoria, string> = {
  REMERAS: 'bg-indigo-500/20 text-indigo-300',
  BUZOS: 'bg-violet-500/20 text-violet-300',
  PANTALONES: 'bg-amber-500/20 text-amber-300',
  ACCESORIOS: 'bg-emerald-500/20 text-emerald-300',
}

const SIZE_GUIDE_ENTRIES: { talle: Talle; pecho: number; cintura: number; largo: number }[] = [
  { talle: 'XS', pecho: 86, cintura: 70, largo: 62 },
  { talle: 'S', pecho: 90, cintura: 74, largo: 64 },
  { talle: 'M', pecho: 94, cintura: 78, largo: 66 },
  { talle: 'L', pecho: 98, cintura: 82, largo: 68 },
  { talle: 'XL', pecho: 102, cintura: 86, largo: 70 },
  { talle: 'XXL', pecho: 106, cintura: 90, largo: 72 },
]

interface PaymentMethod {
  name: string
  type: 'credit' | 'debit' | 'digital' | 'transfer'
  maxInstallments: number
  discount?: string
}

const ALL_PAYMENT_METHODS: PaymentMethod[] = [
  { name: 'Mercado Pago', type: 'digital', maxInstallments: 12 },
  { name: 'Visa', type: 'credit', maxInstallments: 12 },
  { name: 'Mastercard', type: 'credit', maxInstallments: 12 },
  { name: 'American Express', type: 'credit', maxInstallments: 6 },
  { name: 'Naranja', type: 'credit', maxInstallments: 3 },
  { name: 'Visa Débito', type: 'debit', maxInstallments: 1 },
  { name: 'Mastercard Débito', type: 'debit', maxInstallments: 1 },
  { name: 'Transferencia bancaria', type: 'transfer', maxInstallments: 1, discount: '10% de descuento' },
]

const TYPE_LABEL: Record<string, string> = {
  credit: 'Tarjeta de crédito',
  debit: 'Tarjeta de débito',
  digital: 'Billetera digital',
  transfer: 'Transferencia',
}

const VISIBLE_PAYMENT_METHODS = ALL_PAYMENT_METHODS.filter(
  (m) => m.type !== 'transfer',
).slice(0, 4)

function formatInstallments(method: PaymentMethod): string {
  if (method.maxInstallments <= 1) return '1 pago'
  return `Hasta ${method.maxInstallments} cuotas`
}

function LightboxModal({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, onPrev, onNext])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:p-3"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="flex max-h-[85vh] max-w-[90vw] items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`aspect-[4/5] w-full max-w-xl rounded-2xl bg-gradient-to-br ${images[currentIndex]}`}
        />
      </motion.div>

      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:p-3"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

function SizeGuideModal({
  onClose,
  categoria,
}: {
  onClose: () => void
  categoria: Categoria
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-neutral-900 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-white/10 p-1.5 text-white/60 transition-colors hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-xl font-semibold text-white">
          Guía de talles — {CATEGORY_LABEL[categoria]}
        </h3>
        <p className="mt-1 text-sm text-neutral-400">
          Medidas aproximadas en centímetros
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-base">
            <thead>
              <tr className="border-b border-white/[0.08] text-sm font-medium uppercase tracking-widest text-neutral-400">
                <th className="pb-3 pr-5">Talle</th>
                <th className="pb-3 pr-5">Pecho</th>
                <th className="pb-3 pr-5">Cintura</th>
                <th className="pb-3">Largo</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE_ENTRIES.map((row) => (
                <tr key={row.talle} className="border-b border-white/[0.04] text-white/80 last:border-0">
                  <td className="py-3 pr-5 font-medium text-white">{row.talle}</td>
                  <td className="py-3 pr-5">{row.pecho}</td>
                  <td className="py-3 pr-5">{row.cintura}</td>
                  <td className="py-3">{row.largo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-neutral-500">
          Si estás entre dos talles, recomendamos elegir la más grande.
        </p>
      </motion.div>
    </motion.div>
  )
}

function PaymentDetailModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const grouped = ALL_PAYMENT_METHODS.reduce<Record<string, PaymentMethod[]>>((acc, m) => {
    ;(acc[m.type] ??= []).push(m)
    return acc
  }, {})

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/[0.08] bg-neutral-900 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-white/10 p-1.5 text-white/60 transition-colors hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-xl font-semibold text-white">Medios de pago</h3>

        {Object.entries(grouped).map(([type, methods]) => (
          <div key={type} className="mt-5">
            <p className="text-sm font-medium uppercase tracking-widest text-neutral-400">
              {TYPE_LABEL[type]}
            </p>
            <div className="mt-3 space-y-2.5">
              {methods.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.03] px-5 py-3"
                >
                  <div>
                    <span className="text-base font-medium text-white">{m.name}</span>
                    {m.discount && (
                      <span className="ml-2 text-sm font-medium text-emerald-400">
                        {m.discount}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-neutral-400">
                    {formatInstallments(m)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <p className="mt-5 text-sm font-medium text-emerald-400/80">
          3 cuotas sin interés con Mercado Pago
        </p>
      </motion.div>
    </motion.div>
  )
}

function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <div className="border-b border-white/[0.06] pb-3">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-1 text-left"
      >
        <span className="text-sm font-semibold uppercase tracking-widest text-neutral-400">
          {title}
        </span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="h-4 w-4 shrink-0 text-neutral-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function PurchasePanel({
  product,
}: {
  product: ProductoResponse
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [paymentDetailOpen, setPaymentDetailOpen] = useState(false)
  const [shippingOpen, setShippingOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [cp, setCp] = useState('')
  const [shippingResult, setShippingResult] = useState<{
    domicilio: { costo: number; dias: string }
    sucursal: { costo: number; dias: string }
  } | null>(null)
  const [calculating, setCalculating] = useState(false)

  const selected = product.variantes.find((v) => v.id === selectedId) ?? null
  const totalPrice = selected
    ? product.precioBase + selected.precioAdicional
    : product.precioBase

  const galleryImages = CATEGORY_GALLERY[product.categoria] ?? CATEGORY_GALLERY.REMERAS

  function handlePrev() {
    setGalleryIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length)
  }

  function handleNext() {
    setGalleryIndex((i) => (i + 1) % galleryImages.length)
  }

  function handleCalculateShipping() {
    if (!cp.trim()) return
    setCalculating(true)
    setTimeout(() => {
      setShippingResult({
        domicilio: { costo: 1200 + Math.floor(Math.random() * 800), dias: '3-5' },
        sucursal: { costo: 0, dias: '5-8' },
      })
      setCalculating(false)
    }, 800)
  }

  function handleAddToCart() {
    if (!selected) return
    console.log('Agregar al carrito', {
      productoId: product.id,
      productoNombre: product.nombre,
      varianteId: selected.id,
      talle: selected.talle,
      color: selected.color,
      precioTotal: totalPrice,
    })
  }

  function handleBuyNow() {
    if (!selected) return
    console.log('Comprar ahora', {
      productoId: product.id,
      productoNombre: product.nombre,
      varianteId: selected.id,
      talle: selected.talle,
      color: selected.color,
      precioTotal: totalPrice,
    })
  }

  return (
    <>
      <GlassPanel
        variant="dense"
        className="mx-auto w-[90vw] max-w-4xl p-4 sm:p-6 rounded-3xl"
        style={{ maxHeight: '80vh', overflowY: 'auto' }}
      >
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-7">
          {/* ── Galería (columna izquierda) ── */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="group relative overflow-hidden rounded-xl focus:outline-none"
            >
              <div
                className={`aspect-[4/5] w-full bg-gradient-to-br ${galleryImages[galleryIndex]} transition-all duration-500`}
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              <div className="absolute right-3 top-3 rounded-full bg-black/50 p-1.5 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </button>

            <div className="flex gap-2">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setGalleryIndex(i)}
                  className={`h-11 w-full rounded-lg bg-gradient-to-br ${img} transition-all ${
                    i === galleryIndex
                      ? 'ring-2 ring-white ring-offset-1 ring-offset-neutral-900'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ── Detalle (columna derecha) ── */}
          <div className="flex flex-col gap-4">
            {/* Nombre + categoría */}
            <div>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                {product.nombre}
              </h2>
            </div>

            {/* Precio + cuotas */}
            <div>
              <p className="text-3xl font-bold text-white sm:text-4xl">
                ${totalPrice.toLocaleString('es-AR')}
              </p>
              <p className="mt-0.5 text-sm font-medium text-emerald-400/80">
                3 cuotas sin interés de ${(totalPrice / 3).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
              </p>
            </div>

            {/* Talle + guía de talles + stock */}
            <div className="border-b border-white/[0.06] pb-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  Talle
                </p>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-sm font-medium text-white/50 underline underline-offset-2 transition-colors hover:text-white/80"
                >
                  Ver guía de talles
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variantes.map((v) => {
                  const outOfStock = v.stockDisponible <= 0
                  const isSelected = v.id === selectedId
                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={outOfStock}
                      onClick={() => setSelectedId(v.id)}
                      className={`min-w-[3rem] rounded-md border px-4 py-2.5 text-base font-medium transition-all ${
                        isSelected
                          ? 'border-white bg-white text-neutral-900'
                          : outOfStock
                            ? 'border-neutral-700 text-neutral-600 line-through cursor-not-allowed'
                            : 'border-neutral-600 text-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      {v.talle}
                    </button>
                  )
                })}
              </div>
              {selected && (
                <div
                  className={`mt-2 flex items-center gap-2 text-base ${
                    selected.stockDisponible > 5
                      ? 'text-emerald-400'
                      : selected.stockDisponible > 0
                        ? 'text-amber-400'
                        : 'text-red-400'
                  }`}
                >
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${
                      selected.stockDisponible > 5
                        ? 'bg-emerald-400'
                        : selected.stockDisponible > 0
                          ? 'bg-amber-400'
                          : 'bg-red-400'
                    }`}
                  />
                  {selected.stockDisponible > 5
                    ? 'En stock'
                    : selected.stockDisponible > 0
                      ? `Solo quedan ${selected.stockDisponible}`
                      : 'Sin stock'}
                </div>
              )}
            </div>

            {/* Calcular envío (acordeón) */}
            <Accordion title="Calcular envío" open={shippingOpen} onToggle={() => setShippingOpen((v) => !v)}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cp}
                  onChange={(e) => setCp(e.target.value)}
                  placeholder="Código postal"
                  className="min-w-0 flex-1 rounded-full border border-white/[0.08] bg-white/5 px-4 py-2.5 text-base text-white placeholder-neutral-500 outline-none transition-colors focus:border-white/20"
                  maxLength={8}
                />
                <button
                  type="button"
                  onClick={handleCalculateShipping}
                  disabled={!cp.trim() || calculating}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-base font-medium transition-all ${
                    cp.trim() && !calculating
                      ? 'bg-white/10 text-white hover:bg-white/20 active:scale-95'
                      : 'bg-white/5 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  {calculating ? '...' : 'Calcular'}
                </button>
              </div>

              <AnimatePresence>
                {shippingResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 space-y-2 rounded-lg border border-white/[0.06] bg-white/[0.03] p-3"
                  >
                    <div className="flex items-center justify-between text-base">
                      <span className="text-neutral-300">Envío a domicilio</span>
                      <span className="text-white">
                        ${shippingResult.domicilio.costo.toLocaleString('es-AR')}{' '}
                        <span className="text-sm text-neutral-500">
                          ({shippingResult.domicilio.dias} días hábiles)
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-base">
                      <span className="text-neutral-300">Retiro en sucursal</span>
                      <span className="text-emerald-400">
                        Gratis{' '}
                        <span className="text-sm text-neutral-500">
                          ({shippingResult.sucursal.dias} días hábiles)
                        </span>
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Accordion>

            {/* Medios de pago (acordeón) */}
            <Accordion title="Medios de pago" open={paymentOpen} onToggle={() => setPaymentOpen((v) => !v)}>
              <div className="flex flex-wrap gap-1.5">
                {VISIBLE_PAYMENT_METHODS.map((m) => (
                  <span
                    key={m.name}
                    className="rounded-full border border-white/[0.08] bg-white/5 px-4 py-1.5 text-sm text-neutral-300"
                  >
                    {m.name}
                  </span>
                ))}
              </div>
              <p className="mt-1.5 text-sm font-medium text-emerald-400/80">
                3 cuotas sin interés con Mercado Pago
              </p>
              <button
                type="button"
                onClick={() => setPaymentDetailOpen(true)}
                className="mt-2 text-sm font-medium text-white/50 underline underline-offset-2 transition-colors hover:text-white/80"
              >
                Ver más medios de pago
              </button>
            </Accordion>

            {/* Botones de acción */}
            <div className="mt-auto flex flex-col gap-2 pt-1">
              <button
                type="button"
                disabled={!selected}
                onClick={handleAddToCart}
                className={`w-full rounded-full px-8 py-4 text-base font-medium transition-all ${
                  selected
                    ? 'bg-white text-neutral-900 hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                }`}
              >
                Agregar al carrito
              </button>
              <button
                type="button"
                disabled={!selected}
                onClick={handleBuyNow}
                className={`w-full rounded-full border px-8 py-4 text-base font-medium transition-all ${
                  selected
                    ? 'border-white/20 text-white hover:bg-white/10 active:scale-[0.98]'
                    : 'border-neutral-700 text-neutral-600 cursor-not-allowed'
                }`}
              >
                Comprar ahora
              </button>
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* ── Modales ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <LightboxModal
            images={galleryImages}
            currentIndex={galleryIndex}
            onClose={() => setLightboxOpen(false)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {sizeGuideOpen && (
          <SizeGuideModal
            onClose={() => setSizeGuideOpen(false)}
            categoria={product.categoria}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {paymentDetailOpen && (
          <PaymentDetailModal onClose={() => setPaymentDetailOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
