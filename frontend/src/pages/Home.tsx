import { useRef, useEffect } from 'react'
import { useScrollStore } from '../store/useScrollStore'
import { createScrollAnimation } from '../lib/scrollSetup'
import Scene3D from '../scene/Scene3D'
import ScrollOverlay from '../components/ScrollOverlay'

function DebugProgress() {
  const progress = useScrollStore((s) => s.progress)

  return (
    <div className="fixed bottom-3 left-3 z-50 font-mono text-[10px] text-white/25">
      {Math.round(progress * 100)}%
    </div>
  )
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const setProgress = useScrollStore((s) => s.setProgress)

  useEffect(() => {
    if (!containerRef.current) return
    const cleanup = createScrollAnimation(containerRef.current, setProgress)
    return cleanup
  }, [setProgress])

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '400vh' }}>
      <div className="fixed inset-0 z-0">
        <Scene3D />
      </div>

      <DebugProgress />

      <div className="relative z-10 w-full h-full">
        <ScrollOverlay
          checkpoint={0}
          className="left-1/2 top-[50vh] -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <h1 className="text-5xl font-bold text-white md:text-7xl">
            BDS
          </h1>
          <p className="mt-4 text-lg text-neutral-300 md:text-xl">
            Explorá cada detalle en 3D
          </p>
        </ScrollOverlay>

        <ScrollOverlay
          checkpoint={0.2}
          align="right"
          indicator
          className="right-[8%] top-[110vh] -translate-y-1/2 text-right max-w-xs"
        >
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            Material
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white md:text-3xl">
            Tela premium
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-300">
            Algodón peinado de fibra larga con tejido jersey de 240 g/m².
            Suavidad y durabilidad en cada puntada.
          </p>
        </ScrollOverlay>

        <ScrollOverlay
          checkpoint={0.45}
          align="left"
          indicator
          className="left-[8%] top-[185vh] -translate-y-1/2 text-left max-w-xs"
        >
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            Fit
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white md:text-3xl">
            Corte oversize
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-300">
            Hombros caídos y silueta relajada. Pensado para el movimiento
            sin perder estructura.
          </p>
        </ScrollOverlay>

        <ScrollOverlay
          checkpoint={0.7}
          align="right"
          indicator
          className="right-[8%] top-[260vh] -translate-y-1/2 text-right max-w-xs"
        >
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            Terminación
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white md:text-3xl">
            Detalles de costura
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-300">
            Costuras reforzadas con doble aguja y remaches internos.
            Cada unión está diseñada para resistir.
          </p>
        </ScrollOverlay>

        <ScrollOverlay
          checkpoint={0.95}
          className="left-1/2 top-[335vh] -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <p className="text-lg font-semibold text-white md:text-2xl">
            $ 49.990
          </p>
          <button
            className="mt-4 rounded-full bg-white px-10 py-3 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200 hover:scale-105 active:scale-95"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            type="button"
          >
            Ver producto
          </button>
        </ScrollOverlay>
      </div>
    </div>
  )
}
