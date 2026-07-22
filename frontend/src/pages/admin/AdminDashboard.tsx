import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts'
import GlassPanel from '../../components/GlassPanel'
import { useMetricas } from './admin-metricas.hooks'
import { CATEGORY_COLORS, CATEGORY_LABEL } from '../../lib/categoryColors'
import { LABEL_ESTADO, BADGE_ESTADO } from '../../lib/pedido-constants'
import type { Categoria, EstadoPedido } from '../../lib/types'

const PRESETS = [
  { label: '7 días', days: 7 },
  { label: '30 días', days: 30 },
  { label: '3 meses', days: 90 },
] as const

function getRange(presetDays: number) {
  const hasta = new Date()
  const desde = new Date()
  desde.setDate(desde.getDate() - presetDays)
  return { desde: fmt(desde), hasta: fmt(hasta) }
}

function fmt(d: Date) {
  return d.toISOString().split('T')[0]
}

const CATEGORY_CHART_COLORS: Record<Categoria, string> = {
  REMERAS: CATEGORY_COLORS.REMERAS,
  BUZOS: CATEGORY_COLORS.BUZOS,
  PANTALONES: CATEGORY_COLORS.PANTALONES,
  ACCESORIOS: CATEGORY_COLORS.ACCESORIOS,
}

const ESTADO_COLORS: Record<EstadoPedido, string> = {
  CONFIRMADO: '#3b82f6',
  PREPARANDO: '#f59e0b',
  ENVIADO: '#8b5cf6',
  ENTREGADO: '#10b981',
  CANCELADO: '#ef4444',
}

function formatCurrency(n: number) {
  return '$' + n.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export default function AdminDashboard() {
  const [preset, setPreset] = useState<number | null>(30)
  const [customDesde, setCustomDesde] = useState('')
  const [customHasta, setCustomHasta] = useState('')

  const isCustom = preset === null
  const range = useMemo(() => {
    if (!isCustom) return getRange(preset)
    return { desde: customDesde, hasta: customHasta }
  }, [isCustom, preset, customDesde, customHasta])

  const { metricas, loading, error } = useMetricas(
    range.desde || undefined,
    range.hasta || undefined,
  )

  const ventasPorCategoria = useMemo(() => {
    if (!metricas) return []
    return Object.entries(metricas.ventasPorCategoria).map(([cat, total]) => ({
      name: CATEGORY_LABEL[cat as Categoria] || cat,
      value: total,
      color: CATEGORY_CHART_COLORS[cat as Categoria] || '#6b7280',
    }))
  }, [metricas])

  const pedidosPorEstado = useMemo(() => {
    if (!metricas) return []
    return Object.entries(metricas.pedidosPorEstado)
      .filter(([, count]) => count > 0)
      .map(([estado, count]) => ({
        name: LABEL_ESTADO[estado as EstadoPedido] || estado,
        cantidad: count,
        color: ESTADO_COLORS[estado as EstadoPedido],
      }))
  }, [metricas])

  const ventasPorDia = useMemo(() => {
    if (!metricas) return []
    return Object.entries(metricas.ventasPorDia).map(([fecha, total]) => ({
      fecha: fecha.slice(5),
      total,
    }))
  }, [metricas])

  return (
    <div className="space-y-6">
      {/* Date range selector */}
      <GlassPanel variant="dense" className="rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-neutral-300">Período:</span>
          <div className="flex gap-1">
            {PRESETS.map((p) => (
              <button
                key={p.days}
                onClick={() => { setPreset(p.days); setCustomDesde(''); setCustomHasta('') }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  preset === p.days
                    ? 'bg-white/15 text-white'
                    : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
                }`}
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={() => setPreset(null)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                isCustom
                  ? 'bg-white/15 text-white'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'
              }`}
            >
              Custom
            </button>
          </div>
          {isCustom && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customDesde}
                onChange={(e) => setCustomDesde(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-neutral-200 focus:border-white/20 focus:outline-none"
              />
              <span className="text-neutral-500">—</span>
              <input
                type="date"
                value={customHasta}
                onChange={(e) => setCustomHasta(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-neutral-200 focus:border-white/20 focus:outline-none"
              />
            </div>
          )}
        </div>
      </GlassPanel>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white/60" />
        </div>
      )}

      {error && (
        <GlassPanel variant="dense" className="rounded-xl p-6 text-center">
          <p className="text-sm text-red-400">{error}</p>
        </GlassPanel>
      )}

      {!loading && !error && metricas && (
        <>
          {/* Low stock alert */}
          {metricas.stockBajo.length > 0 && (
            <GlassPanel variant="dense" className="rounded-xl border border-amber-500/30 p-5">
              <div className="mb-3 flex items-center gap-2">
                <svg className="h-5 w-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-sm font-bold text-amber-300">Stock Bajo</h2>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">
                  {metricas.stockBajo.length}
                </span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {metricas.stockBajo.map((p) => (
                  <Link
                    key={p.id}
                    to={`/admin/productos/${p.id}/editar`}
                    className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm transition-colors hover:bg-white/10"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="truncate text-neutral-200">{p.nombre}</span>
                      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${BADGE_ESTADO.CONFIRMADO}`}>
                        {CATEGORY_LABEL[p.categoria]}
                      </span>
                    </div>
                    <span className="ml-2 shrink-0 font-mono text-amber-400">{p.stockTotal}</span>
                  </Link>
                ))}
              </div>
            </GlassPanel>
          )}

          {/* Summary cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <MetricCard
              label="Ventas Totales"
              value={formatCurrency(metricas.ventasTotales)}
              icon={<DollarIcon />}
            />
            <MetricCard
              label="Pedidos"
              value={String(metricas.cantidadPedidos)}
              icon={<OrderIcon />}
            />
            <MetricCard
              label="Ticket Promedio"
              value={formatCurrency(metricas.ticketPromedio)}
              icon={<TicketIcon />}
            />
            <MetricCard
              label="Tasa de Cancelación"
              value={`${metricas.tasaCancelacion}%`}
              icon={<CancelIcon />}
              alert={metricas.tasaCancelacion > 10}
            />
          </div>

          {/* Charts row: category + estado */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Ventas por categoría */}
            <GlassPanel variant="dense" className="rounded-xl p-5">
              <h3 className="mb-4 text-sm font-bold text-neutral-200">Ventas por Categoría</h3>
              {ventasPorCategoria.length > 0 ? (
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie
                        data={ventasPorCategoria}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {ventasPorCategoria.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: number) => formatCurrency(v)}
                        contentStyle={{
                          backgroundColor: '#1a1a1a',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {ventasPorCategoria.map((c) => (
                      <div key={c.name} className="flex items-center gap-2 text-xs">
                        <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: c.color }} />
                        <span className="text-neutral-300">{c.name}</span>
                        <span className="ml-auto font-mono text-neutral-400">{formatCurrency(c.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="py-6 text-center text-xs text-neutral-500">Sin datos para este período</p>
              )}
            </GlassPanel>

            {/* Pedidos por estado */}
            <GlassPanel variant="dense" className="rounded-xl p-5">
              <h3 className="mb-4 text-sm font-bold text-neutral-200">Pedidos por Estado</h3>
              {pedidosPorEstado.length > 0 ? (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={pedidosPorEstado} layout="vertical" margin={{ left: 0, right: 10 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={90}
                      tick={{ fill: '#a3a3a3', fontSize: 11 }}
                    />
                    <Bar dataKey="cantidad" radius={[0, 4, 4, 0]}>
                      {pedidosPorEstado.map((entry, i) => (
                        <Cell key={i} fill={entry.color} fillOpacity={0.8} />
                      ))}
                    </Bar>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-6 text-center text-xs text-neutral-500">Sin datos para este período</p>
              )}
            </GlassPanel>
          </div>

          {/* Ventas por día (full width) */}
          <GlassPanel variant="dense" className="rounded-xl p-5">
            <h3 className="mb-4 text-sm font-bold text-neutral-200">Ventas por Día</h3>
            {ventasPorDia.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={ventasPorDia} margin={{ left: 0, right: 10 }}>
                  <XAxis
                    dataKey="fecha"
                    tick={{ fill: '#737373', fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: '#737373', fontSize: 10 }}
                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                    width={50}
                  />
                  <Tooltip
                    formatter={(v: number) => formatCurrency(v)}
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#6366f1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-6 text-center text-xs text-neutral-500">Sin datos para este período</p>
            )}
          </GlassPanel>

          {/* Top 5 productos */}
          <GlassPanel variant="dense" className="rounded-xl p-5">
            <h3 className="mb-4 text-sm font-bold text-neutral-200">Top 5 Productos Más Vendidos</h3>
            {metricas.topProductos.length > 0 ? (
              <div className="space-y-2">
                {metricas.topProductos.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-neutral-300">
                      {i + 1}
                    </span>
                    <span className="truncate text-sm text-neutral-200">{p.nombre}</span>
                    <span className="ml-auto shrink-0 font-mono text-xs text-neutral-400">
                      {p.cantidadVendida} uds
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-xs text-neutral-500">Sin datos para este período</p>
            )}
          </GlassPanel>
        </>
      )}
    </div>
  )
}

function MetricCard({ label, value, icon, alert }: {
  label: string
  value: string
  icon: React.ReactNode
  alert?: boolean
}) {
  return (
    <GlassPanel variant="dense" className={`rounded-xl p-4 ${alert ? 'border border-red-500/30' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium text-neutral-400">{label}</p>
          <p className={`mt-1 text-lg font-bold ${alert ? 'text-red-400' : 'text-white'}`}>{value}</p>
        </div>
        <div className="text-neutral-500">{icon}</div>
      </div>
    </GlassPanel>
  )
}

function DollarIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  )
}

function OrderIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  )
}

function TicketIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
    </svg>
  )
}

function CancelIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  )
}
