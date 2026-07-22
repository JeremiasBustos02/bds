import { type ReactNode, type HTMLAttributes } from 'react'

type GlassVariant = 'default' | 'dense'

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: GlassVariant
  bgOpacity?: number
}

const BG_CLASSES: Record<GlassVariant, string> = {
  default: 'bg-white/[0.06]',
  dense: 'bg-neutral-900/70',
}

const BG_RGB: Record<GlassVariant, string> = {
  default: '255,255,255',
  dense: '23,23,23',
}

export default function GlassPanel({
  children,
  className = '',
  variant = 'default',
  style,
  bgOpacity,
  ...rest
}: GlassPanelProps) {
  const baseStyle: React.CSSProperties = {
    backdropFilter: 'blur(32px) saturate(180%)',
    WebkitBackdropFilter: 'blur(32px) saturate(180%)',
    backgroundClip: 'padding-box',
    border: '1px solid transparent',
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -2px 6px rgba(0,0,0,0.15), 0 12px 40px rgba(0,0,0,0.30)',
  }

  return (
    <div
      {...rest}
      className={`relative ${bgOpacity !== undefined ? '' : BG_CLASSES[variant]} ${className}`}
      style={{
        ...baseStyle,
        ...(bgOpacity !== undefined
          ? { backgroundColor: `rgba(${BG_RGB[variant]},${bgOpacity})` }
          : {}),
        ...style,
      }}
    >
      {/* Lens refraction — simula curvatura convexa de vidrio */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: 'inherit',
          background:
            'radial-gradient(ellipse 85% 65% at 50% 25%, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.06) 100%)',
        }}
      />

      {/* Borde con luz dinámica — conic-gradient con brillo alternado */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: 'inherit',
          border: '1px solid transparent',
          background:
            'conic-gradient(from 180deg at 50% 50%, rgba(255,255,255,0.01) 0deg, rgba(255,255,255,0.05) 70deg, rgba(255,255,255,0.14) 130deg, rgba(255,255,255,0.18) 180deg, rgba(255,255,255,0.12) 230deg, rgba(255,255,255,0.04) 290deg, rgba(255,255,255,0.01) 360deg) border-box',
          WebkitMask:
            'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Highlight especular superior */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          borderRadius: 'inherit',
          height: '2px',
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 10%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.08) 90%, transparent 100%)',
        }}
      />
      {children}
    </div>
  )
}
