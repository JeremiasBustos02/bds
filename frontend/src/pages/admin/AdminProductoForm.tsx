import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProductoForm } from './admin-productos.hooks'
import type { Categoria, Talle, ProductoCreatePayload, ProductoUpdatePayload } from '../../lib/types'
import GlassPanel from '../../components/GlassPanel'

interface VarianteEntrada {
  talle: Talle | ''
  color: string
  precioAdicional: string
  cantidadInicial: string
}

const CATEGORIAS: Categoria[] = ['REMERAS', 'BUZOS', 'PANTALONES', 'ACCESORIOS']
const TALLES: Talle[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const ETIQUETA_CATEGORIA: Record<Categoria, string> = {
  REMERAS: 'Remeras',
  BUZOS: 'Buzos',
  PANTALONES: 'Pantalones',
  ACCESORIOS: 'Accesorios',
}

function varianteInicial(): VarianteEntrada {
  return { talle: '', color: '', precioAdicional: '', cantidadInicial: '0' }
}

type CampoError = Record<string, string>

export default function AdminProductoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const { producto, loading, error: fetchError, crear, actualizar } = useProductoForm(isEdit ? id : undefined)

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precioBase, setPrecioBase] = useState('')
  const [categoria, setCategoria] = useState<Categoria>('REMERAS')
  const [slug, setSlug] = useState('')
  const [modelo3dUrl, setModelo3dUrl] = useState('')
  const [detalleTela, setDetalleTela] = useState('')
  const [detalleCorte, setDetalleCorte] = useState('')
  const [detalleCostura, setDetalleCostura] = useState('')
  const [variantes, setVariantes] = useState<VarianteEntrada[]>([varianteInicial()])
  const [errores, setErrores] = useState<CampoError>({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!producto || !isEdit) return
    setNombre(producto.nombre)
    setDescripcion(producto.descripcion)
    setPrecioBase(producto.precioBase.toString())
    setCategoria(producto.categoria)
    setSlug(producto.slug ?? '')
    setModelo3dUrl(producto.modelo3dUrl ?? '')
    setDetalleTela(producto.detalleTela ?? '')
    setDetalleCorte(producto.detalleCorte ?? '')
    setDetalleCostura(producto.detalleCostura ?? '')
  }, [producto, isEdit])

  function validar(): boolean {
    const e: CampoError = {}
    if (!nombre.trim()) e.nombre = 'El nombre es obligatorio'
    if (!descripcion.trim()) e.descripcion = 'La descripción es obligatoria'
    const pb = parseFloat(precioBase)
    if (!precioBase.trim() || isNaN(pb) || pb <= 0) e.precioBase = 'Ingresá un precio mayor a 0'

    if (!isEdit) {
      if (variantes.length === 0) {
        e.variantes = 'Agregá al menos una variante'
      } else {
        variantes.forEach((v, i) => {
          if (!v.talle) e[`v${i}_talle`] = 'Seleccioná un talle'
          if (!v.color.trim()) e[`v${i}_color`] = 'El color es obligatorio'
          if (parseInt(v.cantidadInicial) < 0) e[`v${i}_stock`] = 'El stock no puede ser negativo'
        })
      }
    }

    setErrores(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validar()) return

    setSaving(true)
    setSubmitError(null)

    try {
      const bodyBase = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precioBase: parseFloat(precioBase),
        categoria,
        slug: slug.trim() || undefined,
        modelo3dUrl: modelo3dUrl.trim() || undefined,
        detalleTela: detalleTela.trim() || undefined,
        detalleCorte: detalleCorte.trim() || undefined,
        detalleCostura: detalleCostura.trim() || undefined,
      }

      if (isEdit) {
        const body = { ...bodyBase, activo: producto?.activo ?? true } as ProductoUpdatePayload
        const result = await actualizar(id, body)
        if (result) navigate('/admin/productos')
        else setSubmitError('Error al guardar los cambios. Intentalo de nuevo.')
      } else {
        const body = {
          ...bodyBase,
          variantes: variantes.map((v) => ({
            talle: v.talle as Talle,
            color: v.color.trim(),
            precioAdicional: v.precioAdicional ? parseFloat(v.precioAdicional) : undefined,
            cantidadInicial: parseInt(v.cantidadInicial) || 0,
          })),
        } as ProductoCreatePayload
        const result = await crear(body)
        if (result) navigate('/admin/productos')
        else setSubmitError('Error al crear el producto. Intentalo de nuevo.')
      }

      setSaving(false)
    } catch {
      setSubmitError('Error al procesar la solicitud')
      setSaving(false)
    }
  }

  function agregarVariante() {
    setVariantes([...variantes, varianteInicial()])
  }

  function quitarVariante(i: number) {
    setVariantes(variantes.filter((_, idx) => idx !== i))
  }

  function actualizarVariante(i: number, campo: keyof VarianteEntrada, valor: string) {
    setVariantes(
      variantes.map((v, idx) => (idx === i ? { ...v, [campo]: valor } : v)),
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-700" />
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center py-20">
        <GlassPanel variant="dense" className="rounded-2xl p-6 text-center">
          <p className="text-red-400">{fetchError}</p>
          <button
            type="button"
            onClick={() => navigate('/admin/productos')}
            className="mt-4 rounded-full bg-white px-6 py-2 text-sm font-semibold text-neutral-900"
          >
            Volver al listado
          </button>
        </GlassPanel>
      </div>
    )
  }

  const campoClase =
    'w-full rounded-full border border-white/[0.08] bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-white/20'

  const campoErrorClase = (campo: string) =>
    errores[campo] ? 'border-red-500/50' : ''

  const textareaClase =
    'w-full rounded-2xl border border-white/[0.08] bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-white/20 resize-none'

  const selectClase =
    'w-full rounded-full border border-white/[0.08] bg-neutral-800 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-white/20'

  return (
    <div className="mx-auto max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-white">
          {isEdit ? 'Editar producto' : 'Nuevo producto'}
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          {isEdit
            ? 'Modificá los datos del producto. Las variantes no se pueden editar después de la creación.'
            : 'Completá los datos del nuevo producto y agregá al menos una variante.'}
        </p>
      </motion.div>

      <div className="mt-6 space-y-6">
        {/* Basic info */}
        <GlassPanel variant="dense" className="rounded-2xl p-5 sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-400">
            Información básica
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Nombre *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Remera Básica"
                className={`${campoClase} ${campoErrorClase('nombre')}`}
              />
              {errores.nombre && <p className="mt-1 text-xs text-red-400">{errores.nombre}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Descripción *
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción del producto"
                rows={3}
                className={`${textareaClase} ${campoErrorClase('descripcion')}`}
              />
              {errores.descripcion && (
                <p className="mt-1 text-xs text-red-400">{errores.descripcion}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Categoría *
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as Categoria)}
                  className={selectClase}
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>
                      {ETIQUETA_CATEGORIA[c]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Precio base *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={precioBase}
                  onChange={(e) => setPrecioBase(e.target.value)}
                  placeholder="25000"
                  className={`${campoClase} ${campoErrorClase('precioBase')}`}
                />
                {errores.precioBase && (
                  <p className="mt-1 text-xs text-red-400">{errores.precioBase}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Slug (opcional)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Se genera automáticamente desde el nombre"
                className={campoClase}
              />
              <p className="mt-1 text-xs text-neutral-500">
                Dejalo vacío para generarlo automáticamente.
              </p>
            </div>
          </div>
        </GlassPanel>

        {/* Details */}
        <GlassPanel variant="dense" className="rounded-2xl p-5 sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-400">
            Detalles del producto
          </h2>

          <div className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Tela
                </label>
                <input
                  type="text"
                  value={detalleTela}
                  onChange={(e) => setDetalleTela(e.target.value)}
                  placeholder="Ej: Algodón peinado 24/1"
                  className={campoClase}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Corte
                </label>
                <input
                  type="text"
                  value={detalleCorte}
                  onChange={(e) => setDetalleCorte(e.target.value)}
                  placeholder="Ej: Regular fit"
                  className={campoClase}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Costura
                </label>
                <input
                  type="text"
                  value={detalleCostura}
                  onChange={(e) => setDetalleCostura(e.target.value)}
                  placeholder="Ej: Doble aguja"
                  className={campoClase}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Modelo 3D URL
              </label>
              <input
                type="url"
                value={modelo3dUrl}
                onChange={(e) => setModelo3dUrl(e.target.value)}
                placeholder="https://ejemplo.com/modelo.glb"
                className={campoClase}
              />
            </div>
          </div>
        </GlassPanel>

        {/* Variants — create mode */}
        {!isEdit && (
          <GlassPanel variant="dense" className="rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-400">
                Variantes *
              </h2>
              <button
                type="button"
                onClick={agregarVariante}
                className="rounded-full border border-white/[0.12] px-4 py-1.5 text-xs font-semibold text-neutral-300 transition-all hover:bg-white/10 hover:text-white"
              >
                + Agregar variante
              </button>
            </div>

            {errores.variantes && (
              <p className="mt-2 text-xs text-red-400">{errores.variantes}</p>
            )}

            <div className="mt-4 space-y-3">
              {variantes.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap items-end gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
                >
                  <div className="flex-1 min-w-[120px]">
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
                      Talle
                    </label>
                    <select
                      value={v.talle}
                      onChange={(e) => actualizarVariante(i, 'talle', e.target.value)}
                      className={selectClase}
                    >
                      <option value="">Seleccionar</option>
                      {TALLES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {errores[`v${i}_talle`] && (
                      <p className="mt-0.5 text-xs text-red-400">{errores[`v${i}_talle`]}</p>
                    )}
                  </div>

                  <div className="flex-1 min-w-[100px]">
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
                      Color
                    </label>
                    <input
                      type="text"
                      value={v.color}
                      onChange={(e) => actualizarVariante(i, 'color', e.target.value)}
                      placeholder="Negro"
                      className={campoClase}
                    />
                    {errores[`v${i}_color`] && (
                      <p className="mt-0.5 text-xs text-red-400">{errores[`v${i}_color`]}</p>
                    )}
                  </div>

                  <div className="w-28">
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
                      Precio extra
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={v.precioAdicional}
                      onChange={(e) => actualizarVariante(i, 'precioAdicional', e.target.value)}
                      placeholder="0"
                      className={campoClase}
                    />
                  </div>

                  <div className="w-20">
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
                      Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={v.cantidadInicial}
                      onChange={(e) => actualizarVariante(i, 'cantidadInicial', e.target.value)}
                      className={campoClase}
                    />
                    {errores[`v${i}_stock`] && (
                      <p className="mt-0.5 text-xs text-red-400">{errores[`v${i}_stock`]}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => quitarVariante(i)}
                    disabled={variantes.length <= 1}
                    className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm text-neutral-500 transition-colors hover:bg-red-500/20 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
                    title="Quitar variante"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        )}

        {/* Read-only variants in edit mode */}
        {isEdit && producto && producto.variantes.length > 0 && (
          <GlassPanel variant="dense" className="rounded-2xl p-5 sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-400">
              Variantes
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Las variantes se definen al crear el producto y no se pueden modificar.
            </p>

            <div className="mt-3 space-y-2">
              {producto.variantes.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-4 py-2.5 text-sm"
                >
                  <span className="font-medium text-white">{v.talle}</span>
                  <span className="text-neutral-400">{v.color}</span>
                  <span className="ml-auto text-xs text-neutral-500">SKU: {v.sku}</span>
                  <span className="text-xs text-neutral-400">
                    {v.precioAdicional > 0
                      ? `+$${v.precioAdicional.toLocaleString('es-AR')}`
                      : '—'}
                  </span>
                  <span className="text-xs text-neutral-400">Stock: {v.stockDisponible}</span>
                </div>
              ))}
            </div>
          </GlassPanel>
        )}

        {/* Submit error */}
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400"
          >
            {submitError}
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {saving
              ? 'Guardando…'
              : isEdit
                ? 'Guardar cambios'
                : 'Crear producto'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/productos')}
            className="rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-neutral-300 transition-all hover:bg-white/10 hover:text-white active:scale-95"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
