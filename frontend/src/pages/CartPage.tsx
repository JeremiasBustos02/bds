import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCartStore, selectCantidadTotal, selectPrecioTotal } from '../store/useCartStore'
import FloatingNavbar from '../components/FloatingNavbar'
import GlassPanel from '../components/GlassPanel'
import FatFooter from '../components/FatFooter'

export default function CartPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const cantidadTotal = useCartStore(selectCantidadTotal)
  const precioTotal = useCartStore(selectPrecioTotal)
  const quitarItem = useCartStore((s) => s.quitarItem)
  const actualizarCantidad = useCartStore((s) => s.actualizarCantidad)
  const vaciarCarrito = useCartStore((s) => s.vaciarCarrito)

  if (cantidadTotal === 0) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <FloatingNavbar />
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          >
            <svg
              className="mx-auto mb-6 h-20 w-20 text-neutral-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={0.8}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            <h1 className="text-3xl font-bold text-white">Tu carrito está vacío</h1>
            <p className="mt-3 text-lg text-neutral-400">
              Parece que todavía no agregaste nada. Explorá la colección y encontrá tu próximo look.
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-8 rounded-full bg-white px-10 py-3.5 text-base font-semibold text-neutral-900 transition-all hover:bg-neutral-200 active:scale-[0.98]"
            >
              Ver colección
            </button>
          </motion.div>
        </div>
        <FatFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <FloatingNavbar />

      <div className="mx-auto max-w-6xl px-4 pt-28 pb-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="flex items-center justify-between"
        >
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Carrito</h1>
          <button
            type="button"
            onClick={vaciarCarrito}
            className="text-sm font-medium text-neutral-500 underline underline-offset-2 transition-colors hover:text-red-400"
          >
            Vaciar carrito
          </button>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Items list */}
          <div className="lg:col-span-2">
            <GlassPanel
              variant="dense"
              className="divide-y divide-white/[0.06] rounded-2xl p-0"
              style={{ overflow: 'hidden' }}
            >
              {items.map((item, i) => (
                <motion.div
                  key={item.varianteId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex gap-4 p-4 sm:p-5"
                >
                  <div
                    className={`h-24 w-24 shrink-0 rounded-xl bg-gradient-to-br ${item.imagenPlaceholder} sm:h-28 sm:w-28`}
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-white">{item.nombre}</h3>
                        <p className="mt-0.5 text-sm text-neutral-400">
                          Talle {item.talle} &middot; {item.color}
                        </p>
                      </div>
                      <p className="shrink-0 text-lg font-bold text-white">
                        ${item.precio.toLocaleString('es-AR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            actualizarCantidad(item.varianteId, item.cantidad - 1)
                          }
                          disabled={item.cantidad <= 1}
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium transition-all ${
                            item.cantidad <= 1
                              ? 'text-neutral-600 cursor-not-allowed'
                              : 'text-white hover:bg-white/10'
                          }`}
                        >
                          –
                        </button>
                        <span className="min-w-[2ch] text-center text-base font-medium text-white">
                          {item.cantidad}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            actualizarCantidad(item.varianteId, item.cantidad + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium text-white transition-all hover:bg-white/10"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => quitarItem(item.varianteId)}
                        className="text-sm font-medium text-neutral-500 underline underline-offset-2 transition-colors hover:text-red-400"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </GlassPanel>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <GlassPanel
              variant="dense"
              className="rounded-2xl p-5 sm:p-6"
              style={{ position: 'sticky', top: '7rem' }}
            >
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-400">
                Resumen
              </h3>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-base">
                  <span className="text-neutral-400">Subtotal ({cantidadTotal} {cantidadTotal === 1 ? 'prenda' : 'prendas'})</span>
                  <span className="font-medium text-white">
                    ${precioTotal.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-neutral-400">Envío</span>
                  <span className="text-sm font-medium text-neutral-500">
                    A calcular
                  </span>
                </div>
              </div>

              <div className="mt-4 border-t border-white/[0.06] pt-4">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-white">Total</span>
                  <span className="font-bold text-white">
                    ${precioTotal.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="mt-5 w-full rounded-full bg-white py-3.5 text-base font-semibold text-neutral-900 transition-all hover:bg-neutral-200 active:scale-[0.98]"
              >
                Finalizar compra
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="mt-2 w-full rounded-full border border-white/20 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-[0.98]"
              >
                Seguir comprando
              </button>
            </GlassPanel>
          </div>
        </div>
      </div>

      <FatFooter />
    </div>
  )
}
