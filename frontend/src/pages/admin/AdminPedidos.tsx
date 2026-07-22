import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdminPedidos, usePedidoDetalle, useCambiarEstado } from './admin-pedidos.hooks'
import type { EstadoPedido, PedidoDetalle } from '../../lib/types'
import { BADGE_ESTADO, LABEL_ESTADO } from '../../lib/pedido-constants'
import GlassPanel from '../../components/GlassPanel'

const PAGE_SIZE = 15

const ESTADOS: { value: EstadoPedido | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'CONFIRMADO', label: 'Confirmado' },
  { value: 'PREPARANDO', label: 'Preparando' },
  { value: 'ENVIADO', label: 'Enviado' },
  { value: 'ENTREGADO', label: 'Entregado' },
  { value: 'CANCELADO', label: 'Cancelado' },
]

const TRANSICIONES_VALIDAS: Record<EstadoPedido, EstadoPedido[]> = {
  CONFIRMADO: ['PREPARANDO', 'CANCELADO'],
  PREPARANDO: ['ENVIADO', 'CANCELADO'],
  ENVIADO: ['ENTREGADO'],
  ENTREGADO: [],
  CANCELADO: [],
}

function formatearFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatearMoneda(monto: number) {
  return `$${monto.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/* ─── Filtros ─── */

function Filtros({
  estado,
  setEstado,
  desde,
  setDesde,
  hasta,
  setHasta,
  onLimpiar,
}: {
  estado: EstadoPedido | ''
  setEstado: (v: EstadoPedido | '') => void
  desde: string
  setDesde: (v: string) => void
  hasta: string
  setHasta: (v: string) => void
  onLimpiar: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value as EstadoPedido | '')}
        className="rounded-full border border-white/[0.08] bg-neutral-800 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-white/20"
      >
        {ESTADOS.map((e) => (
          <option key={e.value} value={e.value}>{e.label}</option>
        ))}
      </select>

      <input
        type="date"
        value={desde}
        onChange={(e) => setDesde(e.target.value)}
        className="rounded-full border border-white/[0.08] bg-neutral-800 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-white/20 [color-scheme:dark]"
        placeholder="Desde"
      />

      <input
        type="date"
        value={hasta}
        onChange={(e) => setHasta(e.target.value)}
        className="rounded-full border border-white/[0.08] bg-neutral-800 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-white/20 [color-scheme:dark]"
        placeholder="Hasta"
      />

      {(estado || desde || hasta) && (
        <button
          type="button"
          onClick={onLimpiar}
          className="rounded-full border border-white/[0.08] px-4 py-2.5 text-sm text-neutral-400 transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          Limpiar
        </button>
      )}
    </div>
  )
}

/* ─── Paginación ─── */

function Paginacion({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []
  for (let i = 0; i < totalPages; i++) {
    if (i === 0 || i === totalPages - 1 || Math.abs(i - currentPage) <= 1) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-full border border-white/[0.08] px-4 py-2 text-sm font-medium text-neutral-400 transition-all hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        Anterior
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-neutral-500">…</span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all ${
              p === currentPage
                ? 'bg-white text-neutral-900'
                : 'text-neutral-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {p + 1}
          </button>
        )
      )}

      <button
        type="button"
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-full border border-white/[0.08] px-4 py-2 text-sm font-medium text-neutral-400 transition-all hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        Siguiente
      </button>
    </div>
  )
}

/* ─── Modal de Detalle ─── */

function PedidoDetalleModal({
  pedido,
  loading,
  error,
  onCerrar,
}: {
  pedido: PedidoDetalle | null
  loading: boolean
  error: string | null
  onCerrar: () => void
}) {
  const { loading: cambiando, error: errorCambio, cambiar, limpiarError } = useCambiarEstado()
  const [nuevoEstado, setNuevoEstado] = useState<EstadoPedido | ''>('')
  const [tracking, setTracking] = useState('')
  const [exito, setExito] = useState(false)

  useEffect(() => {
    if (pedido) {
      setNuevoEstado('')
      setTracking('')
      setExito(false)
      limpiarError()
    }
  }, [pedido, limpiarError])

  if (!pedido) return null

  const opcionesTransicion = TRANSICIONES_VALIDAS[pedido.estado] || []

  async function handleCambiarEstado() {
    if (!nuevoEstado) return

    if (nuevoEstado === 'CANCELADO') {
      const ok = window.confirm(
        '¿Cancelar este pedido? Se devolverá el stock de todos los items. Esta acción es irreversible.'
      )
      if (!ok) return
    }

    const exito = await cambiar(pedido.id, nuevoEstado, tracking || undefined)
    if (exito) {
      setExito(true)
      setTimeout(() => onCerrar(), 1200)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onCerrar}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/[0.08] bg-neutral-900 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Pedido #{pedido.id.slice(0, 8)}
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                  {formatearFecha(pedido.fechaCreacion)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${BADGE_ESTADO[pedido.estado]}`}>
                  {LABEL_ESTADO[pedido.estado]}
                </span>
                <button
                  type="button"
                  onClick={onCerrar}
                  className="shrink-0 rounded-full bg-white/10 p-1.5 text-white/60 transition-colors hover:text-white"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-700" />
          </div>
        )}

        {error && (
          <div className="py-8 text-center">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Cliente */}
            <div className="mb-6 rounded-xl bg-white/[0.03] p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">Cliente</h3>
              <p className="text-sm font-medium text-white">{pedido.usuarioNombre}</p>
              <p className="text-sm text-neutral-400">{pedido.usuarioEmail}</p>
            </div>

            {/* Items */}
            <div className="mb-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">Items</h3>
              <div className="space-y-2">
                {pedido.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg bg-white/[0.03] px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{item.productoNombre}</p>
                      <p className="text-xs text-neutral-500">
                        {item.sku} · Talle {item.talle} · {item.color} · x{item.cantidad}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-medium text-white">
                      {formatearMoneda(item.precioUnitarioAlMomento * item.cantidad)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Envío y total */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/[0.03] p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">Envío</h3>
                <p className="text-sm text-white">
                  {pedido.metodoEnvio === 'DOMICILIO' ? 'Domicilio' : 'Retiro en sucursal'}
                </p>
                {pedido.codigoPostal && (
                  <p className="text-xs text-neutral-400">CP: {pedido.codigoPostal}</p>
                )}
                {pedido.numeroSeguimiento && (
                  <p className="mt-1 text-xs text-violet-400">Tracking: {pedido.numeroSeguimiento}</p>
                )}
              </div>
              <div className="rounded-xl bg-white/[0.03] p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">Total</h3>
                <p className="text-lg font-bold text-white">{formatearMoneda(pedido.total)}</p>
              </div>
            </div>

            {/* Dirección de envío */}
            {pedido.metodoEnvio === 'DOMICILIO' && (pedido.envCalle || pedido.envLocalidad || pedido.envProvincia) && (
              <div className="mb-6 rounded-xl bg-white/[0.03] p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">Dirección de envío</h3>
                <p className="text-sm text-white">
                  {pedido.envCalle}{pedido.envNumero ? `, ${pedido.envNumero}` : ''}
                  {pedido.envPiso ? `, Piso ${pedido.envPiso}` : ''}
                </p>
                {(pedido.envLocalidad || pedido.envProvincia) && (
                  <p className="text-sm text-neutral-400">
                    {[pedido.envLocalidad, pedido.envProvincia].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            )}

            {/* Datos de facturación */}
            {pedido.datosFacturacion && (
              <div className="mb-6 rounded-xl bg-white/[0.03] p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">Datos de facturación</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <p className="text-neutral-400">Documento</p>
                  <p className="text-white">{pedido.datosFacturacion.tipoDocumento} {pedido.datosFacturacion.numeroDocumento}</p>
                  <p className="text-neutral-400">Nombre</p>
                  <p className="text-white">{pedido.datosFacturacion.nombreRazonSocial}</p>
                  <p className="text-neutral-400">Teléfono</p>
                  <p className="text-white">{pedido.datosFacturacion.telefono}</p>
                  <p className="text-neutral-400">Email</p>
                  <p className="text-white">{pedido.datosFacturacion.emailContacto}</p>
                </div>
                {!pedido.datosFacturacion.mismaDireccionEnvio && (
                  <div className="mt-3 border-t border-white/[0.06] pt-3">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-neutral-500">Dirección de facturación</p>
                    <p className="text-sm text-white">
                      {pedido.datosFacturacion.direccionCalle}{pedido.datosFacturacion.direccionNumero ? `, ${pedido.datosFacturacion.direccionNumero}` : ''}
                    </p>
                    {(pedido.datosFacturacion.direccionCiudad || pedido.datosFacturacion.direccionProvincia) && (
                      <p className="text-sm text-neutral-400">
                        {[pedido.datosFacturacion.direccionCiudad, pedido.datosFacturacion.direccionProvincia].filter(Boolean).join(', ')}
                      </p>
                    )}
                    {pedido.datosFacturacion.direccionCodigoPostal && (
                      <p className="text-xs text-neutral-500">CP: {pedido.datosFacturacion.direccionCodigoPostal}</p>
                    )}
                  </div>
                )}
                {pedido.datosFacturacion.mismaDireccionEnvio && (
                  <p className="mt-3 text-xs text-neutral-500">Dirección de facturación: igual a dirección de envío</p>
                )}
              </div>
            )}

            {/* Método de pago */}
            <div className="mb-6 rounded-xl bg-white/[0.03] p-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">Método de pago</h3>
              <p className="text-sm text-neutral-500">Pendiente de integración de pago</p>
            </div>

            {/* Última actualización */}
            {pedido.fechaEstadoActualizado && (
              <p className="mb-6 text-xs text-neutral-500">
                Última actualización de estado: {formatearFecha(pedido.fechaEstadoActualizado)}
              </p>
            )}

            {/* Cambio de estado */}
            {opcionesTransicion.length > 0 && (
              <div className="border-t border-white/[0.06] pt-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Cambiar estado
                </h3>

                {exito ? (
                  <div className="rounded-xl bg-emerald-500/10 p-4 text-center">
                    <p className="text-sm font-medium text-emerald-400">Estado actualizado correctamente</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <select
                        value={nuevoEstado}
                        onChange={(e) => {
                          setNuevoEstado(e.target.value as EstadoPedido)
                          setTracking('')
                          limpiarError()
                        }}
                        className="flex-1 rounded-full border border-white/[0.08] bg-neutral-800 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-white/20"
                      >
                        <option value="">Seleccionar estado…</option>
                        {opcionesTransicion.map((e) => (
                          <option key={e} value={e}>{LABEL_ESTADO[e]}</option>
                        ))}
                      </select>

                      <button
                        type="button"
                        disabled={!nuevoEstado || cambiando}
                        onClick={handleCambiarEstado}
                        className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 ${
                          nuevoEstado === 'CANCELADO'
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            : 'bg-white text-neutral-900 hover:bg-neutral-200'
                        }`}
                      >
                        {cambiando ? 'Aplicando…' : 'Aplicar'}
                      </button>
                    </div>

                    {nuevoEstado === 'ENVIADO' && (
                      <input
                        type="text"
                        value={tracking}
                        onChange={(e) => setTracking(e.target.value)}
                        placeholder="Número de seguimiento"
                        className="w-full rounded-full border border-white/[0.08] bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-white/20"
                      />
                    )}

                    {errorCambio && (
                      <p className="text-xs text-red-400">{errorCambio}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ─── Página Principal ─── */

export default function AdminPedidos() {
  const [estado, setEstado] = useState<EstadoPedido | ''>('')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [page, setPage] = useState(0)

  const { pedidos, totalPages, loading, error, refetch } = useAdminPedidos({
    estado,
    desde,
    hasta,
    page,
    size: PAGE_SIZE,
  })

  const { pedido: pedidoDetalle, loading: detalleLoading, error: detalleError, fetchPedido, cerrar: cerrarDetalle } = usePedidoDetalle()

  useEffect(() => { setPage(0) }, [estado, desde, hasta])

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Pedidos</h1>
          <p className="mt-1 text-sm text-neutral-400">Gestioná los pedidos de tu tienda</p>
        </div>
      </div>

      <Filtros
        estado={estado}
        setEstado={setEstado}
        desde={desde}
        setDesde={setDesde}
        hasta={hasta}
        setHasta={setHasta}
        onLimpiar={() => { setEstado(''); setDesde(''); setHasta('') }}
      />

      {/* Loading */}
      {loading && (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-neutral-800/60" />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <GlassPanel variant="dense" className="mt-8 rounded-2xl p-8 text-center">
          <p className="text-sm text-neutral-400">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200"
          >
            Reintentar
          </button>
        </GlassPanel>
      )}

      {/* Empty */}
      {!loading && !error && pedidos.length === 0 && (
        <GlassPanel variant="dense" className="mt-8 rounded-2xl p-8 text-center">
          <p className="text-neutral-400">No se encontraron pedidos con esos filtros.</p>
        </GlassPanel>
      )}

      {/* Tabla */}
      {!loading && !error && pedidos.length > 0 && (
        <GlassPanel variant="dense" className="mt-6 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">#</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">Fecha</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">Cliente</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-widest text-neutral-400 text-right">Total</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">Estado</th>
                  <th className="px-5 py-4" />
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido, i) => (
                  <motion.tr
                    key={pedido.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    onClick={() => fetchPedido(pedido.id)}
                    className="cursor-pointer border-b border-white/[0.04] transition-colors hover:bg-white/[0.03] last:border-0"
                  >
                    <td className="px-5 py-4 text-sm font-mono text-neutral-300">
                      {pedido.id.slice(0, 8)}
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-300">
                      {formatearFecha(pedido.fechaCreacion)}
                    </td>
                    <td className="px-5 py-4 text-sm text-white">
                      {pedido.items.length > 0
                        ? `${pedido.items.length} item${pedido.items.length > 1 ? 's' : ''}`
                        : '—'}
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-medium text-white">
                      {formatearMoneda(pedido.total)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${BADGE_ESTADO[pedido.estado]}`}>
                        {LABEL_ESTADO[pedido.estado]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <svg className="h-4 w-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      )}

      <Paginacion currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <AnimatePresence>
        {pedidoDetalle && (
          <PedidoDetalleModal
            pedido={pedidoDetalle}
            loading={detalleLoading}
            error={detalleError}
            onCerrar={() => { cerrarDetalle(); refetch() }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
