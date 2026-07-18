import { motion, AnimatePresence } from 'framer-motion'

export default function Toast({
  show,
  message,
}: {
  show: boolean
  message: string
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          className="pointer-events-none fixed bottom-6 left-1/2 z-[60] -translate-x-1/2"
        >
          <div
            className="rounded-full border border-white/[0.08] bg-neutral-900/80 px-6 py-3 shadow-lg backdrop-blur-2xl"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}
          >
            <p className="text-sm font-medium text-white">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
