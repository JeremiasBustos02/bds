import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { ProductoResponse, Categoria } from '../lib/types'

const CATEGORY_INFO: Record<
  Categoria,
  { label: string; color: string; bgClass: string }
> = {
  REMERAS: {
    label: 'Remeras',
    color: '#6366f1',
    bgClass: 'from-indigo-900/40 to-indigo-950/40',
  },
  BUZOS: {
    label: 'Buzos',
    color: '#8b5cf6',
    bgClass: 'from-violet-900/40 to-violet-950/40',
  },
  PANTALONES: {
    label: 'Pantalones',
    color: '#f59e0b',
    bgClass: 'from-amber-900/40 to-amber-950/40',
  },
  ACCESORIOS: {
    label: 'Accesorios',
    color: '#10b981',
    bgClass: 'from-emerald-900/40 to-emerald-950/40',
  },
}

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
          const info = CATEGORY_INFO[cat]
          return (
            <motion.div
              key={cat}
              variants={itemVariants}
              onClick={() => navigate(`/categoria/${cat.toLowerCase()}`)}
              className={`cursor-pointer rounded-xl bg-gradient-to-br ${info.bgClass} border border-white/10 p-8 transition-all duration-300 hover:border-white/30 hover:scale-[1.02]`}
            >
              <h3 className="text-2xl font-bold text-white">{info.label}</h3>
              <p className="mt-2 text-sm text-neutral-400">
                {count} producto{count !== 1 ? 's' : ''}
              </p>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
