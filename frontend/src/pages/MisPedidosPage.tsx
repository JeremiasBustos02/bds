import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/useAuthStore'
import { BADGE_ESTADO, LABEL_ESTADO } from '../lib/pedido-constants'
import { CATEGORY_BG } from '../lib/categoryColors'
import type { Categoria, EstadoPedido } from '../lib/types'
import FloatingNavbar from '../components/FloatingNavbar'
import GlassPanel from '../components/GlassPanel'
import FatFooter from '../components/FatFooter'

interface ItemPedido {
  id: string
  varianteId: string
  sku: string
  talle: string
  color: string
  productoNombre: string
  categoria: Categoria
  cantidad: number
  precioUnitarioAlMomento: number
}

interface Pedido {
  id: string
  usuarioId: string
  fechaCreacion: string
  estado: EstadoPedido
  fechaEstadoActualizado: string | null
  numeroSeguimiento: string | null
  total: number
  metodoEnvio: string
  codigoPostal: string
  items: ItemPedido[]
}

export default function MisPedidosPage() {
  const navigate = useNavigate()
  const token = useAuthStore((s) => s.token)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    fetch('/api/pedidos/mios', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar pedidos')
        return res.json()
      })
      .then((data) => {
        setPedidos(data.content ?? [])
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }, [token])

  const formatearFecha = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <FloatingNavbar />
      <div className="mx-auto max-w-4xl px-4 pt-navbar-offset pb-12 sm:px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white sm:text-4xl"
        >
          Mis pedidos
        </motion.h1>

        {loading && (
          <div className="mt-16 flex justify-center">
            <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-700" />
          </div>
        )}

        {error && (
          <GlassPanel variant="dense" className="mt-8 rounded-2xl p-6 text-center">
            <p className="text-neutral-400">{error}</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-4 rounded-full bg-white px-8 py-2.5 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200"
            >
              Volver al inicio
            </button>
          </GlassPanel>
        )}

        {!loading && !error && pedidos.length === 0 && (
          <GlassPanel variant="dense" className="mt-8 rounded-2xl p-8 text-center">
            <svg
              className="mx-auto mb-4 h-14 w-14 text-neutral-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h2 className="text-xl font-bold text-white">No tenés pedidos</h2>
            <p className="mt-2 text-neutral-400">Todavía no realizaste ninguna compra.</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-6 rounded-full bg-white px-8 py-2.5 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200"
            >
              Ver colección
            </button>
          </GlassPanel>
        )}

        {!loading && !error && pedidos.length > 0 && (
          <div className="mt-8 space-y-4">
            {pedidos.map((pedido, i) => (
              <motion.div
                key={pedido.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <GlassPanel
                  variant="dense"
                  className="cursor-pointer rounded-2xl p-5 transition-colors hover:bg-white/[0.04] sm:p-6"
                  onClick={() => navigate(`/mis-pedidos/${pedido.id}`)}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-neutral-500">
                        Pedido #{pedido.id.slice(0, 8)}
                      </p>
                      <p className="mt-0.5 text-sm text-neutral-400">
                        {formatearFecha(pedido.fechaCreacion)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        BADGE_ESTADO[pedido.estado] ?? 'text-neutral-400 bg-neutral-400/10'
                      }`}
                    >
                      {LABEL_ESTADO[pedido.estado] ?? pedido.estado}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center">
                    {pedido.items.slice(0, 3).map((item, idx) => (
                      <div
                        key={item.id}
                        className={`h-12 w-12 rounded-lg bg-gradient-to-br ${
                          CATEGORY_BG[item.categoria] ?? 'from-neutral-600/20 to-neutral-800/30'
                        } ${idx > 0 ? '-ml-2' : ''} ring-2 ring-neutral-900`}
                      />
                    ))}
                    {pedido.items.length > 3 && (
                      <span className="-ml-2 flex h-12 items-center rounded-lg bg-neutral-800/80 px-2.5 text-xs font-semibold text-neutral-400 ring-2 ring-neutral-900">
                        +{pedido.items.length - 3} más
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    {pedido.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">
                            {item.productoNombre}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {item.sku} &middot; Talle {item.talle} &middot; {item.color} &middot; x{item.cantidad}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-medium text-white">
                          ${(item.precioUnitarioAlMomento * item.cantidad).toLocaleString('es-AR')}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <span className="text-sm text-neutral-400">
                      Envío a {pedido.metodoEnvio === 'DOMICILIO' ? 'domicilio' : 'sucursal'} &middot; CP {pedido.codigoPostal}
                    </span>
                    <span className="text-lg font-bold text-white">
                      ${pedido.total.toLocaleString('es-AR')}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <span className="text-xs font-medium text-neutral-500">
                      Ver detalle →
                    </span>
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <FatFooter />
    </div>
  )
}
