import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import FloatingNavbar from '../components/FloatingNavbar'
import GlassPanel from '../components/GlassPanel'
import FatFooter from '../components/FatFooter'

export default function CheckoutPlaceholder() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-neutral-950">
      <FloatingNavbar />
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="max-w-md"
        >
          <GlassPanel variant="dense" className="rounded-2xl p-8 sm:p-10">
            <svg
              className="mx-auto mb-5 h-14 w-14 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h1 className="text-2xl font-bold text-white">Próximamente</h1>
            <p className="mt-3 text-base text-neutral-400 leading-relaxed">
              El proceso de pago estará disponible pronto. Mientras tanto, seguí armando tu
              carrito con más prendas.
            </p>
            <button
              type="button"
              onClick={() => navigate('/carrito')}
              className="mt-6 w-full rounded-full bg-white px-8 py-3 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200 active:scale-[0.98]"
            >
              Volver al carrito
            </button>
          </GlassPanel>
        </motion.div>
      </div>
      <FatFooter />
    </div>
  )
}
