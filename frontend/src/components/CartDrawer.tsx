import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore, selectCantidadTotal, selectPrecioTotal } from '../store/useCartStore'
import GlassPanel from './GlassPanel'

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const cantidadTotal = useCartStore(selectCantidadTotal)
  const precioTotal = useCartStore(selectPrecioTotal)
  const quitarItem = useCartStore((s) => s.quitarItem)
  const actualizarCantidad = useCartStore((s) => s.actualizarCantidad)

  function handleIrAlCarrito() {
    onClose()
    navigate('/carrito')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 z-50 h-full w-full sm:max-w-sm"
          >
            <GlassPanel
              variant="dense"
              className="flex h-full flex-col sm:rounded-l-2xl border-l border-white/[0.06] p-0"
              style={{ borderRadius: '1rem 0 0 1rem' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                <h2 className="text-lg font-bold text-white">Carrito</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-white/10 p-1.5 text-white/60 transition-colors hover:text-white"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {cantidadTotal === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <svg
                      className="mb-4 h-12 w-12 text-neutral-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                      />
                    </svg>
                    <p className="text-base font-medium text-neutral-400">
                      Tu carrito está vacío
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      Explorá la colección y agregá tus prendas favoritas.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose()
                        navigate('/')
                      }}
                      className="mt-5 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200 active:scale-95"
                    >
                      Ver colección
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.varianteId}
                        className="flex gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] p-3"
                      >
                        <div
                          className={`h-16 w-16 shrink-0 rounded-lg bg-gradient-to-br ${item.imagenPlaceholder}`}
                        />
                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white">
                                {item.nombre}
                              </p>
                              <p className="text-xs text-neutral-400">
                                Talle {item.talle}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => quitarItem(item.varianteId)}
                              className="shrink-0 rounded-full p-1 text-neutral-500 transition-colors hover:text-red-400"
                            >
                              <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">
                              ${item.precio.toLocaleString('es-AR')}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  actualizarCantidad(item.varianteId, item.cantidad - 1)
                                }
                                disabled={item.cantidad <= 1}
                                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-all ${
                                  item.cantidad <= 1
                                    ? 'text-neutral-600 cursor-not-allowed'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                              >
                                –
                              </button>
                              <span className="min-w-[1.5ch] text-center text-sm font-medium text-white">
                                {item.cantidad}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  actualizarCantidad(item.varianteId, item.cantidad + 1)
                                }
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white transition-all hover:bg-white/20"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cantidadTotal > 0 && (
                <div className="border-t border-white/[0.06] px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-400">Total</span>
                    <span className="text-xl font-bold text-white">
                      ${precioTotal.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleIrAlCarrito}
                    className="mt-3 w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200 active:scale-[0.98]"
                  >
                    Ir al carrito
                  </button>
                </div>
              )}
            </GlassPanel>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
