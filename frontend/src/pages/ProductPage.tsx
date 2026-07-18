import { useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useScrollStore } from '../store/useScrollStore'
import { createScrollAnimation } from '../lib/scrollSetup'
import { useProduct } from '../hooks/useProduct'
import ProductScene3D from '../scene/ProductScene3D'
import ScrollOverlay from '../components/ScrollOverlay'
import PurchasePanel from '../components/PurchasePanel'
import FloatingNavbar from '../components/FloatingNavbar'
import FatFooter from '../components/FatFooter'

function DebugProgress() {
  const progress = useScrollStore((s) => s.progress)
  return (
    <div className="fixed bottom-3 left-3 z-50 font-mono text-[10px] text-white/25">
      {Math.round(progress * 100)}%
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex h-screen items-center justify-center bg-neutral-950">
      <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-700" />
    </div>
  )
}

function NotFoundState() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-neutral-950 text-center">
      <h1 className="text-3xl font-bold text-white">Producto no encontrado</h1>
      <p className="mt-2 font-serif text-neutral-400">
        El producto que buscás no existe o fue desactivado.
      </p>
      <a
        href="/"
        className="mt-6 rounded-full bg-white px-8 py-3 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200"
      >
        Volver al inicio
      </a>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-neutral-950 text-center">
      <h1 className="text-2xl font-bold text-white">Error</h1>
      <p className="mt-2 font-serif text-neutral-400">{message}</p>
      <a
        href="/"
        className="mt-6 rounded-full bg-white px-8 py-3 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200"
      >
        Volver al inicio
      </a>
    </div>
  )
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { product, loading, error } = useProduct(slug)
  const containerRef = useRef<HTMLDivElement>(null)
  const setProgress = useScrollStore((s) => s.setProgress)

  useEffect(() => {
    if (!containerRef.current) return
    if (!product) return
    setProgress(0)
    const cleanup = createScrollAnimation(containerRef.current, setProgress)
    return cleanup
  }, [setProgress, product])

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!product) return <NotFoundState />

  return (
    <>
      <div ref={containerRef} className="relative w-full" style={{ height: '400vh' }}>
        <FloatingNavbar />

        <div className="fixed inset-0 z-0">
          <ProductScene3D product={product} />
        </div>

        <DebugProgress />

        <div className="relative z-10 w-full h-full">
            <ScrollOverlay
              checkpoint={0}
              className="left-1/2 top-[50vh] -translate-x-1/2 -translate-y-1/2 text-center px-4"
            >
              <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-7xl">
                {product.nombre}
              </h1>
              <p className="mt-2 text-base leading-relaxed text-neutral-300 sm:text-lg md:text-xl lg:text-2xl">
                {product.descripcion}
              </p>
            </ScrollOverlay>

          {product.detalleTela && (
            <ScrollOverlay
              checkpoint={0.2}
              align="right"
              indicator
              className="right-[5%] sm:right-[8%] top-[110vh] -translate-y-1/2 text-right max-w-[45vw] sm:max-w-md"
            >
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-neutral-400">
                Material
              </p>
              <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
                Tela premium
              </h2>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg leading-relaxed text-neutral-300">
                {product.detalleTela}
              </p>
            </ScrollOverlay>
          )}

          {product.detalleCorte && (
            <ScrollOverlay
              checkpoint={0.45}
              align="left"
              indicator
              className="left-[5%] sm:left-[8%] top-[185vh] -translate-y-1/2 text-left max-w-[45vw] sm:max-w-md"
            >
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-neutral-400">
                Fit
              </p>
              <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
                Corte
              </h2>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg leading-relaxed text-neutral-300">
                {product.detalleCorte}
              </p>
            </ScrollOverlay>
          )}

          {product.detalleCostura && (
            <ScrollOverlay
              checkpoint={0.7}
              align="right"
              indicator
              className="right-[5%] sm:right-[8%] top-[260vh] -translate-y-1/2 text-right max-w-[45vw] sm:max-w-md"
            >
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-neutral-400">
                Terminación
              </p>
              <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
                Detalles de costura
              </h2>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg leading-relaxed text-neutral-300">
                {product.detalleCostura}
              </p>
            </ScrollOverlay>
          )}

          <div className="absolute left-0 right-0 z-10 flex justify-center px-4" style={{ top: '315vh' }}>
            <PurchasePanel product={product} />
          </div>
        </div>
      </div>

      <div className="pb-4 pt-12 md:pb-6">
        <FatFooter />
      </div>
    </>
  )
}
