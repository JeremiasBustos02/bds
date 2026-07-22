import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdminProductos } from './admin-productos.hooks'
import { authFetch } from '../../lib/api'
import type { ProductoResponse, ProductoUpdatePayload, Categoria } from '../../lib/types'
import GlassPanel from '../../components/GlassPanel'

const CATEGORIAS: Categoria[] = ['REMERAS', 'BUZOS', 'PANTALONES', 'ACCESORIOS']
const PAGE_SIZE = 10

const BADGE_CATEGORIA: Record<Categoria, string> = {
  REMERAS: 'bg-blue-500/10 text-blue-400',
  BUZOS: 'bg-amber-500/10 text-amber-400',
  PANTALONES: 'bg-purple-500/10 text-purple-400',
  ACCESORIOS: 'bg-emerald-500/10 text-emerald-400',
}

const ETIQUETA_CATEGORIA: Record<Categoria, string> = {
  REMERAS: 'Remeras',
  BUZOS: 'Buzos',
  PANTALONES: 'Pantalones',
  ACCESORIOS: 'Accesorios',
}

export default function AdminProductos() {
  const navigate = useNavigate()
  const { productos, loading, error, refetch } = useAdminProductos()

  const [search, setSearch] = useState('')
  const [categoriaFilter, setCategoriaFilter] = useState<Categoria | ''>('')
  const [estadoFilter, setEstadoFilter] = useState<'todos' | 'activos' | 'inactivos'>('todos')
  const [page, setPage] = useState(0)
  const [toggleLoading, setToggleLoading] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let result = productos

    if (search.trim()) {
      const s = search.toLowerCase()
      result = result.filter((p) => p.nombre.toLowerCase().includes(s))
    }

    if (categoriaFilter) {
      result = result.filter((p) => p.categoria === categoriaFilter)
    }

    if (estadoFilter === 'activos') {
      result = result.filter((p) => p.activo)
    } else if (estadoFilter === 'inactivos') {
      result = result.filter((p) => !p.activo)
    }

    return result
  }, [productos, search, categoriaFilter, estadoFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)
  const pageProductos = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)

  useEffect(() => {
    setPage(0)
  }, [search, categoriaFilter, estadoFilter])

  async function handleToggleActivo(p: ProductoResponse) {
    if (p.activo) {
      const ok = window.confirm(`¿Desactivar "${p.nombre}"? No será visible en el catálogo público.`)
      if (!ok) return
    } else {
      const ok = window.confirm(`¿Reactivar "${p.nombre}"? Volverá a ser visible en el catálogo público.`)
      if (!ok) return
    }

    setToggleLoading(p.id)

    try {
      if (p.activo) {
        const res = await authFetch(`/api/productos/${p.id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error()
      } else {
        const body: ProductoUpdatePayload = {
          nombre: p.nombre,
          descripcion: p.descripcion,
          precioBase: p.precioBase,
          categoria: p.categoria,
          slug: p.slug || undefined,
          modelo3dUrl: p.modelo3dUrl ?? undefined,
          detalleTela: p.detalleTela ?? undefined,
          detalleCorte: p.detalleCorte ?? undefined,
          detalleCostura: p.detalleCostura ?? undefined,
          activo: true,
        }
        const res = await authFetch(`/api/productos/${p.id}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error()
      }
      refetch()
    } catch {
      alert('Error al cambiar el estado del producto. Intentalo de nuevo.')
    } finally {
      setToggleLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-neutral-800/60"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <GlassPanel variant="dense" className="rounded-2xl p-6 text-center">
          <p className="text-red-400">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 rounded-full bg-white px-6 py-2 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200 active:scale-95"
          >
            Reintentar
          </button>
        </GlassPanel>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Productos</h1>
          <p className="mt-0.5 text-sm text-neutral-400">
            {productos.length} producto{productos.length !== 1 ? 's' : ''} en total
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/productos/nuevo')}
          className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200 active:scale-95"
        >
          + Nuevo producto
        </button>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre…"
            className="w-full rounded-full border border-white/[0.08] bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-white/20"
          />
        </div>

        <select
          value={categoriaFilter}
          onChange={(e) => setCategoriaFilter(e.target.value as Categoria | '')}
          className="rounded-full border border-white/[0.08] bg-neutral-800 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-white/20"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {ETIQUETA_CATEGORIA[c]}
            </option>
          ))}
        </select>

        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value as 'todos' | 'activos' | 'inactivos')}
          className="rounded-full border border-white/[0.08] bg-neutral-800 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-white/20"
        >
          <option value="todos">Todos los estados</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </select>
      </div>

      {/* Product grid */}
      {pageProductos.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          <svg
            className="mb-4 h-16 w-16 text-neutral-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={0.8}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p className="text-lg font-medium text-neutral-400">
            {productos.length === 0
              ? 'No hay productos creados todavía'
              : 'No se encontraron productos con los filtros seleccionados'}
          </p>
          {productos.length === 0 && (
            <button
              type="button"
              onClick={() => navigate('/admin/productos/nuevo')}
              className="mt-4 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200 active:scale-95"
            >
              Crear primer producto
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pageProductos.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <GlassPanel
                variant="dense"
                className="flex h-full flex-col rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-white truncate">{p.nombre}</h3>
                    <span
                      className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        BADGE_CATEGORIA[p.categoria]
                      }`}
                    >
                      {ETIQUETA_CATEGORIA[p.categoria]}
                    </span>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      p.activo
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {p.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <p className="mt-3 text-xl font-bold text-white">
                  ${p.precioBase.toLocaleString('es-AR')}
                </p>

                <p className="mt-0.5 text-xs text-neutral-500">
                  {p.variantes.length} variante{p.variantes.length !== 1 ? 's' : ''}
                </p>

                <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-4">
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/productos/${p.id}/editar`)}
                    className="flex items-center gap-1.5 rounded-full border border-white/[0.12] px-3.5 py-1.5 text-xs font-semibold text-neutral-300 transition-all hover:bg-white/10 hover:text-white active:scale-95"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleActivo(p)}
                    disabled={toggleLoading === p.id}
                    className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
                      p.activo
                        ? 'border-red-500/20 text-red-400 hover:bg-red-500/10'
                        : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
                    }`}
                  >
                    {toggleLoading === p.id ? (
                      <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-current" />
                    ) : p.activo ? (
                      'Desactivar'
                    ) : (
                      'Reactivar'
                    )}
                  </button>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage(Math.max(0, safePage - 1))}
            disabled={safePage <= 0}
            className="rounded-full border border-white/[0.08] px-4 py-2 text-sm font-medium text-neutral-400 transition-all hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            Anterior
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all ${
                i === safePage
                  ? 'bg-white text-neutral-900'
                  : 'text-neutral-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setPage(Math.min(totalPages - 1, safePage + 1))}
            disabled={safePage >= totalPages - 1}
            className="rounded-full border border-white/[0.08] px-4 py-2 text-sm font-medium text-neutral-400 transition-all hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}
