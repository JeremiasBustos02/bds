import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import GlassPanel from './GlassPanel'

const container = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] as const },
  },
}

export default function FatFooter() {
  return (
    <motion.footer
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="mx-4 md:mx-8 lg:mx-12"
    >
      <GlassPanel variant="dense" className="rounded-t-[2rem] px-6 py-12 sm:px-10 md:px-16 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="text-lg font-extrabold tracking-tight text-white">
              BDS
            </Link>
            <p className="mt-3 max-w-xs text-sm font-serif leading-relaxed text-neutral-400">
              Ropa con identidad. Explorá cada prenda en 3D antes de comprar.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Navegación
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link to="/" className="text-sm font-medium text-neutral-400 transition-colors hover:text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <span className="cursor-pointer text-sm font-medium text-neutral-400 transition-colors hover:text-white">
                  Colección
                </span>
              </li>
              <li>
                <span className="cursor-pointer text-sm font-medium text-neutral-400 transition-colors hover:text-white">
                  Nosotros
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Categorías
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <span className="cursor-pointer text-sm font-medium text-neutral-400 transition-colors hover:text-white">
                  Remeras
                </span>
              </li>
              <li>
                <span className="cursor-pointer text-sm font-medium text-neutral-400 transition-colors hover:text-white">
                  Buzos
                </span>
              </li>
              <li>
                <span className="cursor-pointer text-sm font-medium text-neutral-400 transition-colors hover:text-white">
                  Pantalones
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Newsletter
            </h4>
            <div className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="tu@email.com"
                className="min-w-0 flex-1 rounded-full border border-white/[0.08] bg-white/5 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-white/20"
              />
              <button
                type="button"
                className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition-all hover:bg-neutral-200 active:scale-95"
              >
                Suscribirme
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/[0.06] pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs font-serif text-neutral-400">
              &copy; {new Date().getFullYear()} BDS. Todos los derechos reservados.
            </p>
            <div className="flex gap-4">
              <span className="cursor-pointer text-neutral-400 transition-colors hover:text-white">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </span>
              <span className="cursor-pointer text-neutral-400 transition-colors hover:text-white">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.11 2.525c.636-.247 1.363-.416 2.427-.465C8.83 2.013 9.175 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </span>
              <span className="cursor-pointer text-neutral-400 transition-colors hover:text-white">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
      </GlassPanel>
    </motion.footer>
  )
}
