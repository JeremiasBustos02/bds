import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/useAuthStore'
import { authFetch } from '../lib/api'
import type { Direccion } from '../lib/types'
import FloatingNavbar from '../components/FloatingNavbar'
import GlassPanel from '../components/GlassPanel'
import FatFooter from '../components/FatFooter'
import Toast from '../components/Toast'

export default function MiCuentaPage() {
  const usuario = useAuthStore((s) => s.usuario)
  const updateUser = useAuthStore((s) => s.updateUser)

  return (
    <div className="min-h-screen bg-neutral-950">
      <FloatingNavbar />
      <div className="mx-auto max-w-4xl px-4 pt-navbar-offset pb-12 sm:px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white sm:text-4xl"
        >
          Mi cuenta
        </motion.h1>

        <div className="mt-8 space-y-6">
          <DatosPersonalesSection usuario={usuario} updateUser={updateUser} />
          <CambioContrasenaSection tienePassword={usuario?.tienePassword ?? false} />
          <DireccionesSection />
        </div>
      </div>
      <FatFooter />
    </div>
  )
}

function DatosPersonalesSection({
  usuario,
  updateUser,
}: {
  usuario: ReturnType<typeof useAuthStore>['usuario']
  updateUser: (fields: Record<string, unknown>) => void
}) {
  const [nombre, setNombre] = useState(usuario?.nombre ?? '')
  const [apellido, setApellido] = useState(usuario?.apellido ?? '')
  const [telefono, setTelefono] = useState(usuario?.telefono ?? '')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre)
      setApellido(usuario.apellido)
      setTelefono(usuario.telefono ?? '')
    }
  }, [usuario])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!nombre.trim() || !apellido.trim()) {
      setError('Nombre y apellido son obligatorios')
      return
    }

    setSaving(true)
    try {
      const res = await authFetch('/api/auth/perfil', {
        method: 'PUT',
        body: JSON.stringify({ nombre: nombre.trim(), apellido: apellido.trim(), telefono: telefono.trim() || null }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.mensaje || err.error || 'Error al guardar')
      }

      const data = await res.json()
      updateUser({ nombre: data.nombre, apellido: data.apellido, telefono: data.telefono })
      setToast(true)
      setTimeout(() => setToast(false), 2500)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <GlassPanel variant="dense" className="rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-white">Datos personales</h2>

        <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <label className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Email</label>
          <p className="mt-1 text-sm text-neutral-300">{usuario?.email}</p>
          <p className="mt-0.5 text-xs text-neutral-500">El email no se puede cambiar desde aquí</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="mt-1.5 w-full rounded-full border border-white/[0.08] bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-white/20"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Apellido</label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="mt-1.5 w-full rounded-full border border-white/[0.08] bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-white/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Opcional"
              className="mt-1.5 w-full rounded-full border border-white/[0.08] bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-white/20"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-white px-8 py-2.5 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </GlassPanel>
      <Toast show={toast} message="Datos actualizados correctamente" />
    </motion.div>
  )
}

function CambioContrasenaSection({ tienePassword }: { tienePassword: boolean }) {
  const [actual, setActual] = useState('')
  const [nueva, setNueva] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!actual || !nueva || !confirmar) {
      setError('Todos los campos son obligatorios')
      return
    }

    if (nueva.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    if (nueva !== confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }

    setSaving(true)
    try {
      const res = await authFetch('/api/auth/password', {
        method: 'PUT',
        body: JSON.stringify({ passwordActual: actual, passwordNueva: nueva }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.mensaje || err.error || 'Error al cambiar contraseña')
      }

      setActual('')
      setNueva('')
      setConfirmar('')
      setToast(true)
      setTimeout(() => setToast(false), 2500)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cambiar contraseña')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <GlassPanel variant="dense" className="rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-white">Cambiar contraseña</h2>

        {!tienePassword ? (
          <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3">
            <p className="text-sm text-amber-300">
              Tu cuenta fue creada con Google. El cambio de contraseña no aplica para cuentas vinculadas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Contraseña actual</label>
              <input
                type="password"
                value={actual}
                onChange={(e) => setActual(e.target.value)}
                className="mt-1.5 w-full rounded-full border border-white/[0.08] bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-white/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Nueva contraseña</label>
              <input
                type="password"
                value={nueva}
                onChange={(e) => setNueva(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="mt-1.5 w-full rounded-full border border-white/[0.08] bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-white/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Confirmar nueva contraseña</label>
              <input
                type="password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                className="mt-1.5 w-full rounded-full border border-white/[0.08] bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-white/20"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-white px-8 py-2.5 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200 disabled:opacity-50"
              >
                {saving ? 'Cambiando...' : 'Cambiar contraseña'}
              </button>
            </div>
          </form>
        )}
      </GlassPanel>
      <Toast show={toast} message="Contraseña actualizada correctamente" />
    </motion.div>
  )
}

function DireccionesSection() {
  const [direcciones, setDirecciones] = useState<Direccion[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [error, setError] = useState<string | null>(null)

  const [alias, setAlias] = useState('')
  const [calle, setCalle] = useState('')
  const [numero, setNumero] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [provincia, setProvincia] = useState('')
  const [codigoPostal, setCodigoPostal] = useState('')
  const [esPredeterminada, setEsPredeterminada] = useState(false)

  useEffect(() => {
    fetchDirecciones()
  }, [])

  async function fetchDirecciones() {
    setLoading(true)
    try {
      const res = await authFetch('/api/auth/direcciones')
      if (res.ok) {
        const data = await res.json()
        setDirecciones(data)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setAlias('')
    setCalle('')
    setNumero('')
    setCiudad('')
    setProvincia('')
    setCodigoPostal('')
    setEsPredeterminada(false)
    setEditing(null)
    setShowForm(false)
    setError(null)
  }

  function startEdit(d: Direccion) {
    setAlias(d.alias)
    setCalle(d.calle)
    setNumero(d.numero)
    setCiudad(d.ciudad)
    setProvincia(d.provincia)
    setCodigoPostal(d.codigoPostal)
    setEsPredeterminada(d.esPredeterminada)
    setEditing(d.id)
    setShowForm(true)
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!alias.trim() || !calle.trim() || !numero.trim() || !ciudad.trim() || !provincia.trim() || !codigoPostal.trim()) {
      setError('Todos los campos son obligatorios')
      return
    }

    const body = { alias: alias.trim(), calle: calle.trim(), numero: numero.trim(), ciudad: ciudad.trim(), provincia: provincia.trim(), codigoPostal: codigoPostal.trim(), esPredeterminada }

    try {
      const url = editing ? `/api/auth/direcciones/${editing}` : '/api/auth/direcciones'
      const method = editing ? 'PUT' : 'POST'
      const res = await authFetch(url, { method, body: JSON.stringify(body) })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.mensaje || err.error || 'Error al guardar')
      }

      resetForm()
      fetchDirecciones()
      showToast(editing ? 'Dirección actualizada' : 'Dirección agregada')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await authFetch(`/api/auth/direcciones/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchDirecciones()
        showToast('Dirección eliminada')
      }
    } catch {
      // silent
    }
  }

  async function handleSetDefault(id: string) {
    const d = direcciones.find((d) => d.id === id)
    if (!d) return

    try {
      const res = await authFetch(`/api/auth/direcciones/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...d, esPredeterminada: true }),
      })
      if (res.ok) {
        fetchDirecciones()
        showToast('Dirección predeterminada actualizada')
      }
    } catch {
      // silent
    }
  }

  function showToast(msg: string) {
    setToastMsg(msg)
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <GlassPanel variant="dense" className="rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Direcciones guardadas</h2>
          {!showForm && (
            <button
              type="button"
              onClick={() => { resetForm(); setShowForm(true) }}
              className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              + Agregar
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Alias</label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Casa, Trabajo..."
                className="mt-1.5 w-full rounded-full border border-white/[0.08] bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-white/20"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Calle</label>
                <input
                  type="text"
                  value={calle}
                  onChange={(e) => setCalle(e.target.value)}
                  className="mt-1.5 w-full rounded-full border border-white/[0.08] bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-white/20"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Número</label>
                <input
                  type="text"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="mt-1.5 w-full rounded-full border border-white/[0.08] bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-white/20"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Ciudad</label>
                <input
                  type="text"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  className="mt-1.5 w-full rounded-full border border-white/[0.08] bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-white/20"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Provincia</label>
                <input
                  type="text"
                  value={provincia}
                  onChange={(e) => setProvincia(e.target.value)}
                  className="mt-1.5 w-full rounded-full border border-white/[0.08] bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-white/20"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Código Postal</label>
                <input
                  type="text"
                  value={codigoPostal}
                  onChange={(e) => setCodigoPostal(e.target.value)}
                  className="mt-1.5 w-full rounded-full border border-white/[0.08] bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-white/20"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-neutral-300">
              <input
                type="checkbox"
                checked={esPredeterminada}
                onChange={(e) => setEsPredeterminada(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-white accent-white"
              />
              Predeterminada
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-full bg-white px-8 py-2.5 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200 disabled:opacity-50"
              >
                {editing ? 'Actualizar' : 'Agregar'}
              </button>
            </div>
          </form>
        )}

        {!showForm && loading && (
          <div className="mt-8 flex justify-center">
            <div className="h-6 w-6 animate-pulse rounded-full bg-neutral-700" />
          </div>
        )}

        {!showForm && !loading && direcciones.length === 0 && (
          <p className="mt-4 text-sm text-neutral-500">
            No tenés direcciones guardadas. Agregá una para reutilizarla en tus compras.
          </p>
        )}

        {!showForm && !loading && direcciones.length > 0 && (
          <div className="mt-4 space-y-3">
            {direcciones.map((d) => (
              <div
                key={d.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{d.alias}</span>
                    {d.esPredeterminada && (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-300">
                        Predeterminada
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-neutral-400">
                    {d.calle} {d.numero}, {d.ciudad}, {d.provincia} ({d.codigoPostal})
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {!d.esPredeterminada && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(d.id)}
                      className="rounded-lg px-2.5 py-1.5 text-xs text-neutral-500 transition-colors hover:bg-white/10 hover:text-white"
                      title="Marcar como predeterminada"
                    >
                      ★
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => startEdit(d)}
                    className="rounded-lg px-2.5 py-1.5 text-xs text-neutral-500 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(d.id)}
                    className="rounded-lg px-2.5 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>
      <Toast show={toast} message={toastMsg} />
    </motion.div>
  )
}
