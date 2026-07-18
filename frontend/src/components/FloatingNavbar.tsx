import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function FloatingNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className={`fixed inset-x-0 top-0 z-50 flex justify-center pt-4 transition-all duration-300`}
    >
      <div
        className={`flex w-full max-w-2xl items-center justify-between transition-all duration-300 ${
          scrolled
            ? 'rounded-2xl bg-neutral-950/70 px-5 py-2.5 shadow-2xl shadow-black/30 backdrop-blur-2xl'
            : 'rounded-full bg-white/10 px-6 py-3 shadow-lg shadow-black/10 backdrop-blur-xl'
        }`}
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Link to="/" className="text-lg font-bold tracking-tight text-white">
          BDS
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="text-sm text-neutral-400 transition-colors hover:text-white"
          >
            Inicio
          </Link>
          <span className="cursor-pointer text-sm text-neutral-400 transition-colors hover:text-white">
            Colección
          </span>
          <span className="cursor-pointer text-sm text-neutral-400 transition-colors hover:text-white">
            Nosotros
          </span>
        </div>

        <div className="relative">
          <svg
            className="h-5 w-5 text-neutral-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
          <span className="absolute -right-2 -top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[9px] font-bold text-neutral-900">
            0
          </span>
        </div>
      </div>
    </motion.nav>
  )
}
