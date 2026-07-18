import { motion } from 'framer-motion'
import FloatingNavbar from '../components/FloatingNavbar'
import FatFooter from '../components/FatFooter'
import GlassPanel from '../components/GlassPanel'

const MILESTONES = [
  {
    year: '2020',
    title: 'Fundación',
    desc: 'BDS nace en Buenos Aires con una idea clara: ropa que no necesita explicación. Sin temporadas, sin tendencias.',
    align: 'left' as const,
  },
  {
    year: '2021',
    title: 'Primer drop',
    desc: 'La colección inaugural se agota en semanas. El boca a boca y una estética que no buscaba gustarle a todos encienden lo que sigue.',
    align: 'right' as const,
  },
  {
    year: '2023',
    title: 'Experiencia 3D',
    desc: 'Incorporamos visualización 3D para que cada prenda pueda explorarse desde cualquier ángulo antes de comprar. Un paso adelante en e-commerce de indumentaria.',
    align: 'left' as const,
  },
  {
    year: '2025',
    title: 'Nuevos horizontes',
    desc: 'Expandimos la línea de productos y llegamos a nuevos mercados, manteniendo la producción local y el control sobre cada detalle.',
    align: 'right' as const,
  },
]

const VALUES = [
  {
    title: 'Diseño consciente',
    desc: 'Cada prenda se produce en lotes acotados. Pensamos en términos de colecciones, no de temporadas. La calidad sobre la cantidad no es un eslogan, es cómo funciona el taller.',
    size: 'large' as const,
  },
  {
    title: 'Identidad local',
    desc: 'Todo se diseña, produce y empaca en Argentina. Trabajamos con talleres locales porque el control del proceso y el impacto en el entorno importan.',
    size: 'small' as const,
  },
  {
    title: 'Innovación',
    desc: 'Exploramos herramientas digitales —modelado 3D, realidad aumentada— para que la experiencia de compra esté a la altura del producto. El siguiente paso es siempre técnico.',
    size: 'medium' as const,
  },
]

function FadeIn({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function Nosotros() {
  return (
    <>
      <FloatingNavbar />

      {/* ── Hero ── */}
      <section className="relative flex min-h-screen items-end pb-20 pt-32">
        <GlassPanel className="absolute -left-6 top-[18%] h-[55%] w-[60%] rounded-[3rem] sm:-left-12 sm:w-[50%]" />
        <div className="relative z-10 flex w-full flex-col px-6 sm:px-12 md:px-16">
          <FadeIn>
            <h1 className="text-8xl font-black leading-[0.85] tracking-tighter text-white sm:text-[10rem] md:text-[14rem]">
              BDS
            </h1>
          </FadeIn>
          <FadeIn>
            <p className="-mt-2 max-w-xl text-xl font-serif italic leading-relaxed text-neutral-300 sm:-mt-4 sm:text-2xl md:ml-32 md:max-w-2xl md:text-3xl">
              Ropa con identidad. Hecha en Argentina, pensada para el mundo.
            </p>
          </FadeIn>
          <FadeIn>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-neutral-500 sm:text-base md:ml-32">
              No seguimos temporadas. No fabricamos para llenar stock. Cada prenda existe porque alguien la pensó, la cortó y la cosió acá.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Manifiesto ── */}
      <section className="px-6 py-28 sm:px-12 md:px-16 md:py-36">
        <FadeIn className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
            Nuestra filosofía
          </p>
          <div className="mt-6 space-y-5 text-lg font-serif leading-[1.7] text-neutral-300 md:text-xl md:leading-[1.8]">
            <p>
              BDS no es una marca de temporada. No nos interesa empujar diez colecciones al año ni convencerte de que necesitás algo nuevo cada mes. Hacemos ropa para que dure: en construcción, en forma, en sentido.
            </p>
            <p>
              Cada prenda arranca en un tablero de dibujo, pasa por una mesa de corte en un taller de Avellaneda, y llega a tus manos sin intermediarios que le agreguen precio pero no valor. Sabemos quién cose cada modelo. Eso no es marketing, es cómo funciona la cadena cuando la acortás lo suficiente.
            </p>
            <p>
              La experiencia 3D no es un agregado tecnológico para parecer modernos. Es una decisión de producto: que puedas ver la prenda desde todos los ángulos antes de comprarla, que sepas exactamente lo que estás recibiendo. Menos devoluciones, menos desperdicio, menos ruido.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* ── Timeline ── */}
      <section className="px-6 py-20 sm:px-12 md:px-16 md:py-28">
        <FadeIn className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
            Hitos
          </p>
          <div className="mt-10 space-y-16 md:space-y-24">
            {MILESTONES.map((m, i) => (
              <FadeIn key={m.year}>
                <div
                  className={`flex flex-col gap-4 md:flex-row md:gap-10 ${
                    m.align === 'right' ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <div className="shrink-0 md:w-1/2">
                    <p className="text-7xl font-black leading-[0.85] tracking-tighter text-white/10 md:text-8xl">
                      {m.year}
                    </p>
                  </div>
                  <div className="md:w-1/2">
                    <h3
                      className={`text-2xl font-bold text-white md:text-3xl ${
                        m.align === 'right' ? 'md:text-right' : ''
                      }`}
                    >
                      {m.title}
                    </h3>
                    <p
                      className={`mt-3 font-serif leading-relaxed text-neutral-400 text-base md:text-lg ${
                        m.align === 'right' ? 'md:text-right' : ''
                      }`}
                    >
                      {m.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── Valores ── */}
      <section className="px-6 py-20 sm:px-12 md:px-16 md:py-28">
        <FadeIn className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-500">
            Pilares
          </p>
        </FadeIn>

        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2">
          {VALUES.map((v, i) => {
            const span = v.size === 'large'
              ? 'md:col-span-2 md:row-span-2'
              : v.size === 'medium'
                ? 'md:col-span-2 md:row-span-1'
                : 'md:col-span-2 md:row-span-1'

            return (
              <FadeIn key={v.title} className={span}>
                <GlassPanel
                  variant="dense"
                  className={`flex h-full flex-col justify-between rounded-2xl p-6 md:p-8 ${
                    i === 0 ? 'md:p-10' : ''
                  }`}
                >
                  <h3
                    className={`font-bold text-white ${
                      i === 0 ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
                    }`}
                  >
                    {v.title}
                  </h3>
                  <p
                    className={`mt-4 font-serif leading-relaxed text-neutral-400 ${
                      i === 0 ? 'text-base md:text-lg' : 'text-sm md:text-base'
                    }`}
                  >
                    {v.desc}
                  </p>
                </GlassPanel>
              </FadeIn>
            )
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="flex min-h-[40vh] items-center justify-center px-6 py-20 sm:px-12 md:px-16">
        <FadeIn className="text-center">
          <p className="text-3xl font-bold leading-tight text-white md:text-5xl md:leading-tight">
            Esto recién empieza.
            <br />
            Descubrí lo que viene.
          </p>
          <a
            href="/"
            className="mt-6 inline-block text-base font-medium text-white/40 underline underline-offset-4 transition-colors hover:text-white md:text-lg"
          >
            Ver colección →
          </a>
        </FadeIn>
      </section>

      <FatFooter />
    </>
  )
}
