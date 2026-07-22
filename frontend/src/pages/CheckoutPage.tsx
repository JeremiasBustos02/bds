import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCartStore, selectCantidadTotal, selectPrecioTotal } from '../store/useCartStore'
import { useAuthStore } from '../store/useAuthStore'
import { authFetch } from '../lib/api'
import type { TipoDocumento, Direccion } from '../lib/types'
import FloatingNavbar from '../components/FloatingNavbar'
import GlassPanel from '../components/GlassPanel'
import GlassSelect from '../components/GlassSelect'
import FatFooter from '../components/FatFooter'

const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut',
  'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy',
  'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén',
  'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
  'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
]

interface EnvioResultado {
  costo: number
  diasEstimados: string
}

function calcularEnvioSimulado(cp: string): EnvioResultado {
  const prefijo = parseInt(cp.substring(0, 1), 10)
  if (prefijo === 1) {
    return { costo: Math.floor(Math.random() * 2000) + 3500, diasEstimados: '2-3 días hábiles' }
  }
  if (prefijo >= 2 && prefijo <= 4) {
    return { costo: Math.floor(Math.random() * 3000) + 6000, diasEstimados: '3-5 días hábiles' }
  }
  if (prefijo >= 5 && prefijo <= 6) {
    return { costo: Math.floor(Math.random() * 4000) + 8000, diasEstimados: '4-6 días hábiles' }
  }
  if (prefijo >= 7 && prefijo <= 8) {
    return { costo: Math.floor(Math.random() * 5000) + 10000, diasEstimados: '5-8 días hábiles' }
  }
  return { costo: Math.floor(Math.random() * 6000) + 12000, diasEstimados: '6-10 días hábiles' }
}

type Paso = 'envio' | 'facturacion' | 'confirmar'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const cantidadTotal = useCartStore(selectCantidadTotal)
  const precioTotal = useCartStore(selectPrecioTotal)
  const vaciarCarrito = useCartStore((s) => s.vaciarCarrito)
  const usuario = useAuthStore((s) => s.usuario)
  const token = useAuthStore((s) => s.token)

  const [metodoEnvio, setMetodoEnvio] = useState<'DOMICILIO' | 'SUCURSAL'>('SUCURSAL')
  const [envCalle, setEnvCalle] = useState('')
  const [envNumero, setEnvNumero] = useState('')
  const [envPiso, setEnvPiso] = useState('')
  const [envLocalidad, setEnvLocalidad] = useState('')
  const [envProvincia, setEnvProvincia] = useState('')
  const [envCodigoPostal, setEnvCodigoPostal] = useState('')
  const [envioResultado, setEnvioResultado] = useState<EnvioResultado | null>(null)
  const [calculando, setCalculando] = useState(false)
  const [paso, setPaso] = useState<Paso>('envio')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pedidoId, setPedidoId] = useState<string | null>(null)

  const [tipoDoc, setTipoDoc] = useState<TipoDocumento>('DNI')
  const [numDoc, setNumDoc] = useState('')
  const [nombreRazon, setNombreRazon] = useState('')
  const [telefono, setTelefono] = useState('')
  const [emailContacto, setEmailContacto] = useState('')
  const [mismaDirEnvio, setMismaDirEnvio] = useState(false)
  const [dirCalle, setDirCalle] = useState('')
  const [dirNumero, setDirNumero] = useState('')
  const [dirCiudad, setDirCiudad] = useState('')
  const [dirProvincia, setDirProvincia] = useState('')
  const [dirCodigoPostal, setDirCodigoPostal] = useState('')

  const [direccionesGuardadas, setDireccionesGuardadas] = useState<Direccion[]>([])
  const [dirSeleccionada, setDirSeleccionada] = useState<string | null>(null)

  useEffect(() => {
    if (usuario) {
      setNombreRazon(`${usuario.nombre} ${usuario.apellido}`)
      setTelefono(usuario.telefono ?? '')
      setEmailContacto(usuario.email)
    }
  }, [usuario])

  useEffect(() => {
    if (!token) return
    authFetch('/api/auth/direcciones')
      .then((res) => { if (res.ok) return res.json(); return [] })
      .then((data: Direccion[]) => setDireccionesGuardadas(data))
      .catch(() => {})
  }, [token])

  useEffect(() => {
    if (metodoEnvio === 'DOMICILIO') {
      setMismaDirEnvio(true)
    } else {
      setMismaDirEnvio(false)
    }
  }, [metodoEnvio])

  useEffect(() => {
    if (mismaDirEnvio && metodoEnvio === 'DOMICILIO') {
      setDirCalle(envCalle)
      setDirNumero(envNumero)
      setDirCiudad(envLocalidad)
      setDirProvincia(envProvincia)
      setDirCodigoPostal(envCodigoPostal)
    }
  }, [mismaDirEnvio, metodoEnvio, envCalle, envNumero, envLocalidad, envProvincia, envCodigoPostal])

  const envioDisplay = metodoEnvio === 'SUCURSAL' ? 0 : (envioResultado?.costo ?? null)
  const totalConEnvio = precioTotal + (envioDisplay ?? 0)

  function seleccionarDireccionGuardada(dir: Direccion) {
    setEnvCalle(dir.calle)
    setEnvNumero(dir.numero)
    setEnvLocalidad(dir.ciudad)
    setEnvProvincia(dir.provincia)
    setEnvCodigoPostal(dir.codigoPostal)
    setDirSeleccionada(dir.id)
    setEnvioResultado(null)
  }

  if (pedidoId) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <FloatingNavbar />
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="max-w-md"
          >
            <GlassPanel variant="dense" className="rounded-2xl p-8 sm:p-10">
              <svg className="mx-auto mb-5 h-14 w-14 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-2xl font-bold text-white">¡Pedido confirmado!</h1>
              <p className="mt-2 text-neutral-400">
                Código: <span className="font-mono font-semibold text-white">{pedidoId.slice(0, 8)}</span>
              </p>
              <p className="mt-1 text-sm text-neutral-500">Te vamos a enviar el seguimiento por email.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link to="/mis-pedidos" className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200 active:scale-95">
                  Ver mis pedidos
                </Link>
                <Link to="/" className="rounded-full border border-white/[0.12] px-8 py-3 text-sm font-semibold text-neutral-300 transition-all hover:bg-white/10 hover:text-white active:scale-95">
                  Seguir comprando
                </Link>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
        <FatFooter />
      </div>
    )
  }

  if (cantidadTotal === 0) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <FloatingNavbar />
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}>
            <svg className="mx-auto mb-6 h-20 w-20 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <h1 className="text-3xl font-bold text-white">Tu carrito está vacío</h1>
            <p className="mt-3 text-lg text-neutral-400">Agregá productos antes de finalizar tu compra.</p>
            <button type="button" onClick={() => navigate('/carrito')} className="mt-8 rounded-full bg-white px-10 py-3.5 text-base font-semibold text-neutral-900 transition-all hover:bg-neutral-200 active:scale-95">
              Volver al carrito
            </button>
          </motion.div>
        </div>
        <FatFooter />
      </div>
    )
  }

  function handleCambiarMetodo(metodo: 'DOMICILIO' | 'SUCURSAL') {
    setMetodoEnvio(metodo)
    setError(null)
    setEnvioResultado(null)
    setDirSeleccionada(null)
    if (metodo === 'SUCURSAL') {
      setEnvCalle('')
      setEnvNumero('')
      setEnvPiso('')
      setEnvLocalidad('')
      setEnvProvincia('')
      setEnvCodigoPostal('')
    }
  }

  async function handleCalcularEnvio() {
    if (!envCodigoPostal.trim()) return
    setCalculando(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 600))
      const resultado = calcularEnvioSimulado(envCodigoPostal.trim())
      setEnvioResultado(resultado)
    } catch {
      setError('Error al calcular el envío')
    } finally {
      setCalculando(false)
    }
  }

  function handleAvanzarEnvio() {
    setError(null)
    if (metodoEnvio === 'DOMICILIO') {
      if (!envCalle.trim()) { setError('Ingresá la calle'); return }
      if (!envNumero.trim()) { setError('Ingresá el número'); return }
      if (!envLocalidad.trim()) { setError('Ingresá la localidad'); return }
      if (!envProvincia) { setError('Seleccioná una provincia'); return }
      if (!envCodigoPostal.trim()) { setError('Ingresá el código postal'); return }
      if (!envioResultado) { setError('Calculá el costo de envío antes de continuar'); return }
    }
    setPaso('facturacion')
  }

  function handleAvanzarFacturacion() {
    setError(null)
    if (!numDoc.trim()) { setError('Ingresá el número de documento'); return }
    if (tipoDoc === 'DNI' && (numDoc.length < 7 || numDoc.length > 8)) { setError('DNI: 7 u 8 dígitos'); return }
    if (tipoDoc === 'CUIT' && numDoc.length !== 11) { setError('CUIT: 11 dígitos'); return }
    if (!nombreRazon.trim()) { setError('Ingresá nombre o razón social'); return }
    if (!telefono.trim()) { setError('Ingresá un teléfono de contacto'); return }
    if (!emailContacto.trim()) { setError('Ingresá un email de contacto'); return }
    const hayDirEnvio = metodoEnvio === 'DOMICILIO' && envCalle.trim()
    if (hayDirEnvio && mismaDirEnvio) {
      setPaso('confirmar')
      return
    }
    if (!dirCalle.trim() || !dirNumero.trim() || !dirCiudad.trim() || !dirProvincia.trim() || !dirCodigoPostal.trim()) {
      setError('Completá todos los campos de dirección de facturación')
      return
    }
    setPaso('confirmar')
  }

  function handleVolver() {
    setError(null)
    if (paso === 'facturacion') setPaso('envio')
    else if (paso === 'confirmar') setPaso('facturacion')
  }

  function getDireccionEnvioParaSubmit() {
    if (metodoEnvio === 'SUCURSAL') return null
    return { calle: envCalle.trim(), numero: envNumero.trim(), piso: envPiso.trim() || null, localidad: envLocalidad.trim(), provincia: envProvincia, codigoPostal: envCodigoPostal.trim() }
  }

  function getDireccionFacturacionParaSubmit() {
    const hayDirEnvio = metodoEnvio === 'DOMICILIO' && envCalle.trim()
    if (hayDirEnvio && mismaDirEnvio) return null
    return { calle: dirCalle.trim(), numero: dirNumero.trim(), ciudad: dirCiudad.trim(), provincia: dirProvincia.trim(), codigoPostal: dirCodigoPostal.trim() }
  }

  async function handleSubmit() {
    setError(null)
    setEnviando(true)

    try {
      const body = {
        items: items.map((i) => ({ varianteId: i.varianteId, cantidad: i.cantidad })),
        metodoEnvio,
        codigoPostal: metodoEnvio === 'SUCURSAL' ? '' : envCodigoPostal.trim(),
        envCalle: metodoEnvio === 'SUCURSAL' ? null : envCalle.trim(),
        envNumero: metodoEnvio === 'SUCURSAL' ? null : envNumero.trim(),
        envPiso: metodoEnvio === 'SUCURSAL' ? null : (envPiso.trim() || null),
        envLocalidad: metodoEnvio === 'SUCURSAL' ? null : envLocalidad.trim(),
        envProvincia: metodoEnvio === 'SUCURSAL' ? null : envProvincia,
        datosFacturacion: (() => {
          const dirEnv = getDireccionEnvioParaSubmit()
          const dirFact = getDireccionFacturacionParaSubmit()
          const mismaDir = dirEnv !== null && dirFact === null
          return {
            tipoDocumento: tipoDoc,
            numeroDocumento: numDoc.trim(),
            nombreRazonSocial: nombreRazon.trim(),
            telefono: telefono.trim(),
            emailContacto: emailContacto.trim(),
            mismaDireccionEnvio: mismaDir,
            direccionCalle: dirFact?.calle ?? null,
            direccionNumero: dirFact?.numero ?? null,
            direccionCiudad: dirFact?.ciudad ?? null,
            direccionProvincia: dirFact?.provincia ?? null,
            direccionCodigoPostal: dirFact?.codigoPostal ?? null,
          }
        })(),
      }

      const res = await authFetch('/api/pedidos', {
        method: 'POST',
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        if (res.status === 401) throw new Error('Tu sesión expiró. Iniciá sesión de nuevo.')
        const err = (await res.json()) as { mensaje?: string; error?: string }
        throw new Error(err.mensaje ?? err.error ?? 'Error al crear el pedido')
      }

      const data = (await res.json()) as { id: string }
      vaciarCarrito()
      setPedidoId(data.id)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear el pedido. Intentalo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  const pasos = [
    { key: 'envio' as const, label: 'Envío', num: 1 },
    { key: 'facturacion' as const, label: 'Facturación', num: 2 },
    { key: 'confirmar' as const, label: 'Confirmar', num: 3 },
  ]
  const pasoActual = pasos.findIndex((p) => p.key === paso)

  const inputCls = "w-full rounded-full border border-white/[0.08] bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-white/20"
  const labelCls = "text-xs font-semibold uppercase tracking-widest text-neutral-400"

  return (
    <div className="min-h-screen bg-neutral-950">
      <FloatingNavbar />
      <div className="mx-auto max-w-6xl px-4 pt-navbar-offset pb-12 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Checkout</h1>
          <div className="mt-4 flex gap-4">
            {pasos.map((p, i) => (
              <div key={p.key} className="flex items-center gap-2">
                {i > 0 && <div className="flex items-center text-neutral-600 mr-2">›</div>}
                <div className={`flex items-center gap-2 text-sm font-semibold ${paso === p.key ? 'text-white' : i < pasoActual ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${i <= pasoActual ? 'bg-white text-neutral-900' : 'bg-neutral-800 text-neutral-400'}`}>
                    {p.num}
                  </span>
                  {p.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Items review */}
            <GlassPanel variant="dense" className="divide-y divide-white/[0.06] rounded-2xl p-0" style={{ overflow: 'hidden' }}>
              {items.map((item, i) => (
                <motion.div key={item.varianteId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }} className="flex gap-4 p-4 sm:p-5">
                  <div className={`h-24 w-24 shrink-0 rounded-xl bg-gradient-to-br ${item.imagenPlaceholder} sm:h-28 sm:w-28`} />
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                    <h3 className="text-lg font-bold text-white">{item.nombre}</h3>
                    <p className="text-sm text-neutral-400">Talle {item.talle} &middot; {item.color}</p>
                    <p className="text-sm text-neutral-500">Cantidad: {item.cantidad}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end justify-center">
                    <p className="text-lg font-bold text-white">${(item.precio * item.cantidad).toLocaleString('es-AR')}</p>
                    {item.cantidad > 1 && <p className="text-xs text-neutral-500">${item.precio.toLocaleString('es-AR')} c/u</p>}
                  </div>
                </motion.div>
              ))}
            </GlassPanel>

            {/* Step 1: Envío */}
            {paso === 'envio' && (
              <GlassPanel variant="dense" className="rounded-2xl p-5 sm:p-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-400">Método de envío</h3>
                <div className="mt-4 flex gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
                  <button type="button" onClick={() => handleCambiarMetodo('SUCURSAL')} className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${metodoEnvio === 'SUCURSAL' ? 'bg-white text-neutral-900' : 'text-neutral-400 hover:text-white'}`}>
                    Retiro en sucursal
                  </button>
                  <button type="button" onClick={() => handleCambiarMetodo('DOMICILIO')} className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${metodoEnvio === 'DOMICILIO' ? 'bg-white text-neutral-900' : 'text-neutral-400 hover:text-white'}`}>
                    Envío a domicilio
                  </button>
                </div>

                {metodoEnvio === 'DOMICILIO' && (
                  <div className="mt-5 space-y-4">
                    {direccionesGuardadas.length > 0 && (
                      <div>
                        <label className={labelCls}>Direcciones guardadas</label>
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          {direccionesGuardadas.map((dir) => (
                            <button key={dir.id} type="button" onClick={() => seleccionarDireccionGuardada(dir)} className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${dirSeleccionada === dir.id ? 'border-white/30 bg-white/10 text-white' : 'border-white/[0.08] bg-white/5 text-neutral-400 hover:text-white'}`}>
                              {dir.alias}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                      <div>
                        <label className={labelCls}>Calle</label>
                        <input type="text" value={envCalle} onChange={(e) => { setEnvCalle(e.target.value); setEnvioResultado(null); setDirSeleccionada(null) }} placeholder="Av. Corrientes" className={`mt-1.5 ${inputCls}`} />
                      </div>
                      <div>
                        <label className={labelCls}>Número</label>
                        <input type="text" value={envNumero} onChange={(e) => setEnvNumero(e.target.value)} placeholder="1234" className={`mt-1.5 ${inputCls}`} />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Piso / Departamento <span className="text-neutral-600">(opcional)</span></label>
                      <input type="text" value={envPiso} onChange={(e) => setEnvPiso(e.target.value)} placeholder="Piso 3, Depto B" className={`mt-1.5 ${inputCls}`} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelCls}>Localidad</label>
                        <input type="text" value={envLocalidad} onChange={(e) => { setEnvLocalidad(e.target.value); setEnvioResultado(null); setDirSeleccionada(null) }} placeholder="Capital Federal" className={`mt-1.5 ${inputCls}`} />
                      </div>
                      <div>
                        <label className={labelCls}>Provincia</label>
                        <GlassSelect
                          value={envProvincia}
                          options={PROVINCIAS.map((p) => ({ value: p, label: p }))}
                          placeholder="Seleccionar…"
                          onChange={(v) => { setEnvProvincia(v); setEnvioResultado(null); setDirSeleccionada(null) }}
                          className="mt-1.5"
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Código postal</label>
                      <div className="mt-1.5 flex gap-2">
                        <input type="text" value={envCodigoPostal} onChange={(e) => { setEnvCodigoPostal(e.target.value); setEnvioResultado(null); setDirSeleccionada(null) }} placeholder="Ej: 1425" className={`flex-1 ${inputCls}`} />
                        <button type="button" onClick={handleCalcularEnvio} disabled={calculando || !envCodigoPostal.trim()} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50">
                          {calculando ? 'Calculando…' : 'Calcular'}
                        </button>
                      </div>
                    </div>

                    {envioResultado && (
                      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-400">Costo de envío</span>
                          <span className="font-semibold text-emerald-400">${envioResultado.costo.toLocaleString('es-AR')}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-neutral-400">Tiempo estimado</span>
                          <span className="font-medium text-emerald-400">{envioResultado.diasEstimados}</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {metodoEnvio === 'SUCURSAL' && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm font-medium text-emerald-400">
                    Retiro gratis en sucursal
                  </motion.p>
                )}
              </GlassPanel>
            )}

            {/* Step 2: Facturación */}
            {paso === 'facturacion' && (
              <GlassPanel variant="dense" className="rounded-2xl p-5 sm:p-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-400">Datos de facturación</h3>
                <div className="mt-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Tipo de documento</label>
                      <div className="mt-1.5 flex gap-2">
                        {(['DNI', 'CUIT'] as TipoDocumento[]).map((td) => (
                          <button key={td} type="button" onClick={() => setTipoDoc(td)} className={`flex-1 rounded-full border px-4 py-2.5 text-sm font-medium transition-all ${tipoDoc === td ? 'border-white/30 bg-white/10 text-white' : 'border-white/[0.08] bg-white/5 text-neutral-400 hover:text-white'}`}>
                            {td}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Número de documento</label>
                      <input type="text" value={numDoc} onChange={(e) => setNumDoc(e.target.value.replace(/\D/g, ''))} placeholder={tipoDoc === 'DNI' ? 'Ej: 12345678' : 'Ej: 20123456783'} maxLength={tipoDoc === 'DNI' ? 8 : 11} className={`mt-1.5 ${inputCls}`} />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Nombre / Razón social</label>
                    <input type="text" value={nombreRazon} onChange={(e) => setNombreRazon(e.target.value)} className={`mt-1.5 ${inputCls}`} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Teléfono</label>
                      <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className={`mt-1.5 ${inputCls}`} />
                    </div>
                    <div>
                      <label className={labelCls}>Email de contacto</label>
                      <input type="email" value={emailContacto} onChange={(e) => setEmailContacto(e.target.value)} className={`mt-1.5 ${inputCls}`} />
                    </div>
                  </div>

                  {metodoEnvio === 'DOMICILIO' && (
                    <label className="flex items-center gap-2 text-sm text-neutral-300">
                      <input type="checkbox" checked={mismaDirEnvio} onChange={(e) => setMismaDirEnvio(e.target.checked)} className="h-4 w-4 rounded border-white/20 bg-white/5 text-white accent-white" />
                      Usar la misma dirección para facturación
                    </label>
                  )}

                  {!(metodoEnvio === 'DOMICILIO' && mismaDirEnvio) && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 overflow-hidden">
                      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                        <div>
                          <label className={labelCls}>Calle</label>
                          <input type="text" value={dirCalle} onChange={(e) => setDirCalle(e.target.value)} placeholder="Av. Corrientes" className={`mt-1.5 ${inputCls}`} />
                        </div>
                        <div>
                          <label className={labelCls}>Número</label>
                          <input type="text" value={dirNumero} onChange={(e) => setDirNumero(e.target.value)} placeholder="1234" className={`mt-1.5 ${inputCls}`} />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label className={labelCls}>Ciudad</label>
                          <input type="text" value={dirCiudad} onChange={(e) => setDirCiudad(e.target.value)} placeholder="Capital Federal" className={`mt-1.5 ${inputCls}`} />
                        </div>
                        <div>
                          <label className={labelCls}>Provincia</label>
                          <GlassSelect
                            value={dirProvincia}
                            options={PROVINCIAS.map((p) => ({ value: p, label: p }))}
                            placeholder="Seleccionar…"
                            onChange={(v) => setDirProvincia(v)}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Código Postal</label>
                          <input type="text" value={dirCodigoPostal} onChange={(e) => setDirCodigoPostal(e.target.value)} placeholder="1425" className={`mt-1.5 ${inputCls}`} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </GlassPanel>
            )}

            {/* Step 3: Confirmar */}
            {paso === 'confirmar' && (
              <>
                <GlassPanel variant="dense" className="rounded-2xl p-5 sm:p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-400">Datos del envío</h3>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Método</span>
                      <span className="font-medium text-white">{metodoEnvio === 'DOMICILIO' ? 'Envío a domicilio' : 'Retiro en sucursal'}</span>
                    </div>
                    {metodoEnvio === 'DOMICILIO' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Dirección</span>
                          <span className="text-right font-medium text-white">
                            {envCalle} {envNumero}{envPiso ? `, Piso ${envPiso}` : ''}<br/>
                            {envLocalidad}, {envProvincia} ({envCodigoPostal})
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Costo</span>
                          <span className="font-medium text-white">${envioDisplay?.toLocaleString('es-AR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Tiempo estimado</span>
                          <span className="font-medium text-white">{envioResultado?.diasEstimados}</span>
                        </div>
                      </>
                    )}
                  </div>
                </GlassPanel>

                <GlassPanel variant="dense" className="rounded-2xl p-5 sm:p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-400">Datos de facturación</h3>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Documento</span>
                      <span className="font-medium text-white">{tipoDoc}: {numDoc}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Nombre</span>
                      <span className="font-medium text-white">{nombreRazon}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Teléfono</span>
                      <span className="font-medium text-white">{telefono}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Email</span>
                      <span className="font-medium text-white">{emailContacto}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Dirección</span>
                      <span className="text-right font-medium text-white">
                        {metodoEnvio === 'DOMICILIO' && mismaDirEnvio
                          ? `${envCalle} ${envNumero}, ${envLocalidad}`
                          : `${dirCalle} ${dirNumero}, ${dirCiudad}`}
                      </span>
                    </div>
                  </div>
                </GlassPanel>
              </>
            )}
          </div>

          {/* Right column — summary */}
          <div className="lg:col-span-1">
            <GlassPanel variant="dense" className="rounded-2xl p-5 sm:p-6" style={{ position: 'sticky', top: '7rem' }}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-400">Resumen</h3>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-base">
                  <span className="text-neutral-400">Subtotal ({cantidadTotal} {cantidadTotal === 1 ? 'prenda' : 'prendas'})</span>
                  <span className="font-medium text-white">${precioTotal.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-neutral-400">Envío</span>
                  {envioDisplay !== null ? (
                    <span className={`font-medium ${envioDisplay === 0 ? 'text-emerald-400' : 'text-white'}`}>
                      {envioDisplay === 0 ? 'Gratis' : `$${envioDisplay.toLocaleString('es-AR')}`}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-neutral-500">A calcular</span>
                  )}
                </div>
              </div>
              <div className="mt-4 border-t border-white/[0.06] pt-4">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-white">Total</span>
                  <span className="font-bold text-white">${totalConEnvio.toLocaleString('es-AR')}</span>
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                  {error}
                </motion.div>
              )}

              {paso === 'envio' && (
                <>
                  <button type="button" onClick={handleAvanzarEnvio} className="mt-5 w-full rounded-full bg-white py-3.5 text-base font-semibold text-neutral-900 transition-all hover:bg-neutral-200 active:scale-95">
                    Continuar
                  </button>
                  <button type="button" onClick={() => navigate('/carrito')} className="mt-2 w-full rounded-full border border-white/20 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-95">
                    Volver al carrito
                  </button>
                </>
              )}

              {paso === 'facturacion' && (
                <>
                  <button type="button" onClick={handleAvanzarFacturacion} className="mt-5 w-full rounded-full bg-white py-3.5 text-base font-semibold text-neutral-900 transition-all hover:bg-neutral-200 active:scale-95">
                    Continuar
                  </button>
                  <button type="button" onClick={handleVolver} className="mt-2 w-full rounded-full border border-white/20 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-95">
                    Volver
                  </button>
                </>
              )}

              {paso === 'confirmar' && (
                <>
                  <button type="button" onClick={handleSubmit} disabled={enviando} className="mt-5 w-full rounded-full bg-white py-3.5 text-base font-semibold text-neutral-900 transition-all hover:bg-neutral-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100">
                    {enviando ? 'Confirmando…' : 'Confirmar compra'}
                  </button>
                  <button type="button" onClick={handleVolver} className="mt-2 w-full rounded-full border border-white/20 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-95">
                    Volver
                  </button>
                </>
              )}
            </GlassPanel>
          </div>
        </div>
      </div>
      <FatFooter />
    </div>
  )
}
