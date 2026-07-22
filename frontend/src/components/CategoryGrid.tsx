import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { ProductoResponse, Categoria } from '../lib/types'
import { CATEGORY_LABEL, CATEGORY_BG } from '../lib/categoryColors'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const },
  },
}

export default function CategoryGrid({
  products,
}: {
  products: ProductoResponse[]
}) {
  const navigate = useNavigate()

  const categoryCounts = new Map<Categoria, number>()
  for (const p of products) {
    categoryCounts.set(p.categoria, (categoryCounts.get(p.categoria) ?? 0) + 1)
  }

  const categories = Array.from(categoryCounts.entries()).filter(
    ([_, count]) => count > 0,
  )

  if (categories.length === 0) return null

  return (
    <section id="categorias" className="px-6 py-24 md:px-12">
      <h2 className="mb-12 text-3xl font-bold text-white md:text-4xl">
        Explorá por categoría
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {categories.map(([cat, count]) => {
          return (
            <motion.div
              key={cat}
              variants={itemVariants}
              onClick={() => navigate(`/categoria/${cat.toLowerCase()}`)}
              className={`cursor-pointer rounded-xl bg-gradient-to-br ${CATEGORY_BG[cat]} border border-white/10 p-8 transition-all duration-300 hover:border-white/30 hover:scale-105`}
            >
              <h3 className="text-2xl font-semibold text-white">{CATEGORY_LABEL[cat]}</h3>
              <p className="mt-2 text-sm font-serif text-neutral-400">
                {count} producto{count !== 1 ? 's' : ''}
              </p>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
