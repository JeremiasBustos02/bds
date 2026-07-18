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
      className={`fixed left-0 top-0 z-50 flex w-full items-center justify-between px-6 py-4 transition-all duration-300 md:px-12 ${
        scrolled
          ? 'bg-neutral-950/80 shadow-lg shadow-black/20 backdrop-blur-xl'
          : 'bg-white/5 backdrop-blur-md'
      }`}
    >
      <Link to="/" className="text-lg font-bold tracking-tight text-white">
        BDS
      </Link>

      <div className="hidden items-center gap-8 md:flex">
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
          className="h-6 w-6 text-neutral-300"
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
        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-neutral-900">
          0
        </span>
      </div>
    </motion.nav>
  )
}
