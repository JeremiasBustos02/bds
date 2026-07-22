import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/useAuthStore'
import { BADGE_ESTADO, LABEL_ESTADO, TIMELINE_ESTADOS, TIMELINE_DESCRIPCION } from '../lib/pedido-constants'
import { CATEGORY_BG } from '../lib/categoryColors'
import type { EstadoPedido, PedidoDetalle } from '../lib/types'
import FloatingNavbar from '../components/FloatingNavbar'
import GlassPanel from '../components/GlassPanel'
import FatFooter from '../components/FatFooter'

function formatearFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatearMoneda(monto: number) {
  return `$${monto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/* ─── Timeline ─── */

function OrderTimeline({
  estado,
  numeroSeguimiento,
}: {
  estado: EstadoPedido
  numeroSeguimiento?: string | null
}) {
  if (estado === 'CANCELADO') {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15 text-red-400 ring-4 ring-red-500/10">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <span className="mt-3 text-sm font-semibold text-red-400">Cancelado</span>
        <p className="mt-1 max-w-xs text-xs text-neutral-500">
          {TIMELINE_DESCRIPCION.CANCELADO}
        </p>
      </div>
    )
  }

  const currentIndex = TIMELINE_ESTADOS.indexOf(estado)

  return (
    <div className="flex items-start justify-between">
      {TIMELINE_ESTADOS.map((step, i) => {
        const isCompleted = i < currentIndex
        const isCurrent = i === currentIndex

        return (
          <div key={step} className="flex flex-1 items-start">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-blue-500 text-white ring-4 ring-blue-500/20'
                    : 'bg-neutral-800 text-neutral-500 ring-2 ring-neutral-700'
                }`}
              >
                {isCompleted ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isCompleted
                    ? 'text-emerald-400'
                    : isCurrent
                    ? 'text-blue-400'
                    : 'text-neutral-500'
                }`}
              >
                {LABEL_ESTADO[step]}
              </span>
              <p
                className={`mt-1 max-w-[120px] text-center text-[11px] leading-tight ${
                  isCompleted
                    ? 'text-emerald-400/70'
                    : isCurrent
                    ? 'text-blue-400/70'
                    : 'text-neutral-600'
                }`}
              >
                {step === 'ENVIADO' && isCurrent && numeroSeguimiento
                  ? `${TIMELINE_DESCRIPCION[step]} Seguimiento: ${numeroSeguimiento}.`
                  : TIMELINE_DESCRIPCION[step]}
              </p>
            </div>
            {i < TIMELINE_ESTADOS.length - 1 && (
              <div
                className={`mx-2 mt-5 h-0.5 flex-1 ${
                  i < currentIndex ? 'bg-emerald-500' : 'bg-neutral-700'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Página de Detalle ─── */

export default function PedidoDetallePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const token = useAuthStore((s) => s.token)
  const [pedido, setPedido] = useState<PedidoDetalle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token || !id) return
    setLoading(true)
    setError(null)

    fetch(`/api/pedidos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 403) throw new Error('No tenés permiso para ver este pedido.')
        if (res.status === 404) throw new Error('Pedido no encontrado.')
        if (!res.ok) throw new Error('Error al cargar el pedido.')
        return res.json()
      })
      .then((data: PedidoDetalle) => {
        setPedido(data)
        setLoading(false)
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Error desconocido')
        setLoading(false)
      })
  }, [id, token])

  return (
    <div className="min-h-screen bg-neutral-950">
      <FloatingNavbar />
      <div className="mx-auto max-w-3xl px-4 pt-navbar-offset pb-12 sm:px-6">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          type="button"
          onClick={() => navigate('/mis-pedidos')}
          className="mb-6 flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a mis pedidos
        </motion.button>

        {loading && (
          <div className="space-y-4">
            <div className="h-20 animate-pulse rounded-2xl bg-neutral-800/60" />
            <div className="h-40 animate-pulse rounded-2xl bg-neutral-800/60" />
            <div className="h-32 animate-pulse rounded-2xl bg-neutral-800/60" />
          </div>
        )}

        {error && (
          <GlassPanel className="mt-4 rounded-2xl p-8 text-center">
            <p className="text-neutral-400">{error}</p>
            <button
              type="button"
              onClick={() => navigate('/mis-pedidos')}
              className="mt-4 rounded-full bg-white px-8 py-2.5 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200"
            >
              Volver a mis pedidos
            </button>
          </GlassPanel>
        )}

        {!loading && !error && pedido && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-white sm:text-3xl">
                    Pedido #{pedido.id.slice(0, 8)}
                  </h1>
                  <p className="mt-1 text-sm text-neutral-400">
                    {formatearFecha(pedido.fechaCreacion)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                    BADGE_ESTADO[pedido.estado]
                  }`}
                >
                  {LABEL_ESTADO[pedido.estado]}
                </span>
              </div>
            </div>

            {/* Cancelado banner */}
            {pedido.estado === 'CANCELADO' && (
              <GlassPanel className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                    <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-400">Pedido cancelado</p>
                    <p className="text-xs text-neutral-500">
                      {TIMELINE_DESCRIPCION.CANCELADO}
                    </p>
                    {pedido.fechaEstadoActualizado && (
                      <p className="mt-0.5 text-xs text-neutral-600">
                        {formatearFecha(pedido.fechaEstadoActualizado)}
                      </p>
                    )}
                  </div>
                </div>
              </GlassPanel>
            )}

            {/* Timeline */}
            <GlassPanel className="mb-6 rounded-2xl p-6">
              <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                {pedido.estado === 'CANCELADO' ? 'Estado del pedido' : 'Progreso del pedido'}
              </h2>
              <OrderTimeline estado={pedido.estado} numeroSeguimiento={pedido.numeroSeguimiento} />
            </GlassPanel>

            {/* Tracking */}
            {pedido.numeroSeguimiento && ['ENVIADO', 'ENTREGADO'].includes(pedido.estado) && (
              <GlassPanel className="mb-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/10">
                    <svg className="h-5 w-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Número de seguimiento
                    </p>
                    <p className="mt-0.5 text-lg font-bold text-violet-400">
                      {pedido.numeroSeguimiento}
                    </p>
                  </div>
                </div>
              </GlassPanel>
            )}

            {/* Items */}
            <GlassPanel className="mb-6 rounded-2xl p-6">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Items comprados
              </h2>
              <div className="space-y-3">
                {pedido.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${
                          CATEGORY_BG[item.categoria] ?? 'from-neutral-600/20 to-neutral-800/30'
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium text-white">{item.productoNombre}</p>
                        <p className="text-xs text-neutral-500">
                          Talle {item.talle} &middot; {item.color} &middot; x{item.cantidad}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {formatearMoneda(item.precioUnitarioAlMomento * item.cantidad)}
                    </p>
                  </div>
                ))}
              </div>
            </GlassPanel>

            {/* Envío y Total */}
            <GlassPanel className="rounded-2xl p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                    Método de envío
                  </h2>
                  <p className="text-sm font-medium text-white">
                    {pedido.metodoEnvio === 'DOMICILIO' ? 'Envío a domicilio' : 'Retiro en sucursal'}
                  </p>
                  {pedido.codigoPostal && (
                    <p className="mt-1 text-xs text-neutral-500">Código postal: {pedido.codigoPostal}</p>
                  )}
                </div>
                <div className="text-right">
                  <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                    Total pagado
                  </h2>
                  <p className="text-2xl font-bold text-white">{formatearMoneda(pedido.total)}</p>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </div>
      <FatFooter />
    </div>
  )
}
