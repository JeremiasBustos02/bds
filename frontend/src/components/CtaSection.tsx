import { motion } from 'framer-motion'

export default function CtaSection() {
  return (
    <section className="flex h-[20vh] items-center justify-center bg-neutral-900/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="text-center"
      >
        <p className="text-xl text-neutral-200 md:text-2xl">
          Descubrí toda la colección
        </p>
        <button
          type="button"
          className="mt-4 rounded-full bg-white px-10 py-3 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200 hover:scale-105 active:scale-95"
          onClick={() => {
            const section = document.getElementById('categorias')
            section?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Ver colección
        </button>
      </motion.div>
    </section>
  )
}
