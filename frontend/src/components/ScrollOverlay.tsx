import { useScrollStore } from '../store/useScrollStore'
import { type ReactNode } from 'react'

export default function ScrollOverlay({
  checkpoint,
  children,
  className = '',
  align = 'center',
  indicator = false,
}: {
  checkpoint: number
  children: ReactNode
  className?: string
  align?: 'center' | 'left' | 'right'
  indicator?: boolean
}) {
  const progress = useScrollStore((s) => s.progress)
  const distance = Math.abs(progress - checkpoint)
  const isVisible = distance < 0.2

  const opacity = Math.max(0, 1 - distance / 0.15)
  const offset = 25 * (1 - opacity)

  const transform = `translateY(${offset}px)`

  return (
    <div
      className={`absolute z-10 ${className}`}
      style={{
        opacity,
        transform,
        pointerEvents: isVisible ? 'auto' : 'none',
        visibility: isVisible ? 'visible' : 'hidden',
      }}
    >
      {indicator && align !== 'center' && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 ${align === 'right' ? '-left-3' : '-right-3'} flex items-center gap-2`}
        >
          <div
            className={`h-px w-6 bg-gradient-to-l ${align === 'right' ? 'from-white/50 to-transparent' : 'from-transparent to-white/50'}`}
          />
          <div className="h-1.5 w-1.5 rounded-full bg-white/50" />
        </div>
      )}
      {children}
    </div>
  )
}
