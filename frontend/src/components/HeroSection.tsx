import { motion } from 'framer-motion'
import ProductCarousel3D from '../scene/ProductCarousel3D'
import type { ProductoResponse } from '../lib/types'

export default function HeroSection({
  products,
}: {
  products: ProductoResponse[]
}) {
  return (
    <section className="flex h-screen w-full">
      <div className="flex w-[30%] items-center justify-center pl-8 md:pl-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        >
          <h1 className="text-6xl font-bold tracking-tight text-white md:text-8xl">
            BDS
          </h1>
          <p className="mt-4 text-lg text-neutral-400 md:text-xl">
            Moda en 3D
          </p>
        </motion.div>
      </div>

      <div className="w-[70%]">
        <ProductCarousel3D products={products} />
      </div>
    </section>
  )
}
