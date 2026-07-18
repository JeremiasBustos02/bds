import { motion } from 'framer-motion'
import ProductCarousel3D from '../scene/ProductCarousel3D'
import type { ProductoResponse } from '../lib/types'

export default function HeroSection({
  products,
}: {
  products: ProductoResponse[]
}) {
  function scrollToColeccion() {
    const section = document.getElementById('categorias')
    section?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="flex h-screen w-full flex-col md:flex-row">
      <div className="flex shrink-0 items-center justify-center px-6 pt-16 pb-2 md:w-[30%] md:pl-16 md:pt-0 md:pb-0 md:justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="flex flex-col items-center md:items-start"
        >
          <h1 className="text-[15vw] sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black tracking-tight text-white leading-[0.85]">
            BDS
          </h1>
          <p className="mt-1 md:mt-2 text-center md:text-left text-sm sm:text-base md:text-lg xl:text-xl font-semibold leading-snug text-neutral-300 max-w-56 sm:max-w-64 md:max-w-96">
            Ropa con identidad. Explorá cada prenda en 3D antes de comprar.
          </p>
          <button
            type="button"
            onClick={scrollToColeccion}
            className="mt-4 md:mt-5 rounded-full bg-white px-8 py-3 text-sm font-medium text-neutral-900 transition-all hover:bg-neutral-200 active:scale-95"
          >
            Ver colección
          </button>
        </motion.div>
      </div>

      <div className="flex-1 md:w-[70%]">
        <ProductCarousel3D products={products} />
      </div>
    </section>
  )
}
