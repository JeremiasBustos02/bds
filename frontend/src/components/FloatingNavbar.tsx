import { useState, useMemo, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore, selectCantidadTotal } from '../store/useCartStore'
import { useProducts } from '../hooks/useProducts'
import type { Categoria } from '../lib/types'
import GlassPanel from './GlassPanel'
import CartDrawer from './CartDrawer'

const CATEGORY_INFO: Record<Categoria, { label: string; slug: string }> = {
  REMERAS: { label: 'Remeras', slug: 'remeras' },
  BUZOS: { label: 'Buzos', slug: 'buzos' },
  PANTALONES: { label: 'Pantalones', slug: 'pantalones' },
  ACCESORIOS: { label: 'Accesorios', slug: 'accesorios' },
}

export default function FloatingNavbar() {
  const cantidadTotal = useCartStore(selectCantidadTotal)
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [coleccionOpen, setColeccionOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [coleccionMobileOpen, setColeccionMobileOpen] = useState(false)
  const coleccionRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const { products } = useProducts()

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.categoria))
    return (Object.entries(CATEGORY_INFO) as [Categoria, { label: string; slug: string }][])
      .filter(([key]) => cats.has(key))
      .map(([key, val]) => ({ categoria: key, ...val }))
  }, [products])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (coleccionRef.current && !coleccionRef.current.contains(e.target as Node))
        setColeccionOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleNav() {
    setMenuOpen(false)
    setColeccionMobileOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center pt-4 transition-all duration-300"
      >
        <GlassPanel className="flex w-[calc(100vw-16px)] sm:max-w-2xl items-center justify-between rounded-full px-4 sm:px-6 py-3">
          <Link to="/" className="text-lg font-extrabold tracking-tight text-white">
            BDS
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link to="/" className="text-sm text-neutral-400 transition-colors hover:text-white">
              Inicio
            </Link>

            <div ref={coleccionRef} className="relative">
                <button
                  type="button"
                  onClick={() => setColeccionOpen(!coleccionOpen)}
                  className="flex items-center justify-center gap-1 text-sm text-neutral-400 transition-colors hover:text-white"
                >
                  Colección
                <svg
                  className={`h-3 w-3 transition-transform duration-200 ${coleccionOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {coleccionOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2"
                  >
                    <GlassPanel className="min-w-[180px] rounded-xl p-2 shadow-xl">
                      {categories.length === 0 ? (
                        <div className="px-3 py-2 text-xs text-neutral-500">Cargando...</div>
                      ) : (
                        categories.map(({ categoria, label, slug }) => (
                          <Link
                            key={categoria}
                            to={`/categoria/${slug}`}
                            onClick={() => setColeccionOpen(false)}
                            className="block rounded-lg px-3 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                          >
                            {label}
                          </Link>
                        ))
                      )}
                    </GlassPanel>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/nosotros" className="text-sm text-neutral-400 transition-colors hover:text-white">
              Nosotros
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex cursor-pointer items-center justify-center text-neutral-300 transition-colors hover:text-white"
                aria-label="Perfil"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2"
                  >
                    <GlassPanel className="min-w-[180px] rounded-xl p-2 shadow-xl">
                      <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
                        Cuenta
                      </div>
                      <button
                        type="button"
                        onClick={() => { setProfileOpen(false) }}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        Iniciar sesión
                      </button>
                      <button
                        type="button"
                        onClick={() => { setProfileOpen(false) }}
                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        Crear cuenta
                      </button>
                      {/* Cuando haya auth, mostrar en vez: Mi cuenta / Mis pedidos / Cerrar sesión */}
                    </GlassPanel>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative flex cursor-pointer items-center justify-center text-neutral-300 transition-colors hover:text-white"
              aria-label="Carrito"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              {cantidadTotal > 0 && (
                <span className="absolute -right-2 -top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[9px] font-medium text-neutral-900">
                  {cantidadTotal}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center md:hidden text-neutral-300 transition-colors hover:text-white"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {menuOpen ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </GlassPanel>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="mx-4 mt-20"
              onClick={(e) => e.stopPropagation()}
            >
              <GlassPanel className="rounded-2xl p-4">
                <div className="space-y-1">
                  <Link
                    to="/"
                    onClick={handleNav}
                    className="block rounded-lg px-4 py-3 text-base text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Inicio
                  </Link>

                  <div>
                    <button
                      type="button"
                      onClick={() => setColeccionMobileOpen(!coleccionMobileOpen)}
                      className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-base text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      Colección
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${coleccionMobileOpen ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {coleccionMobileOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-4 space-y-0.5 pb-2">
                            {categories.length === 0 ? (
                              <div className="px-4 py-2 text-sm text-neutral-500">Cargando...</div>
                            ) : (
                              categories.map(({ categoria, label, slug }) => (
                                <Link
                                  key={categoria}
                                  to={`/categoria/${slug}`}
                                  onClick={handleNav}
                                  className="block rounded-lg px-4 py-2.5 text-sm text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
                                >
                                  {label}
                                </Link>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link
                    to="/nosotros"
                    onClick={handleNav}
                    className="block rounded-lg px-4 py-3 text-base text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Nosotros
                  </Link>
                </div>
              </GlassPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
