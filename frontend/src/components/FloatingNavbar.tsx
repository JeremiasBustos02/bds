import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import GlassPanel from './GlassPanel'

export default function FloatingNavbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center pt-4 transition-all duration-300"
    >
      <GlassPanel className="flex w-full max-w-2xl items-center justify-between rounded-full px-6 py-3">
        <Link to="/" className="text-lg font-extrabold tracking-tight text-white">
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
          <Link
            to="/nosotros"
            className="text-sm text-neutral-400 transition-colors hover:text-white"
          >
            Nosotros
          </Link>
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
          <span className="absolute -right-2 -top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[9px] font-medium text-neutral-900">
            0
          </span>
        </div>
      </GlassPanel>
    </motion.nav>
  )
}
