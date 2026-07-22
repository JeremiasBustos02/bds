import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassPanel from './GlassPanel'

interface GlassSelectOption {
  value: string
  label: string
}

interface GlassSelectProps {
  value: string
  options: GlassSelectOption[]
  placeholder?: string
  onChange: (value: string) => void
  className?: string
}

export default function GlassSelect({
  value,
  options,
  placeholder = 'Seleccionar…',
  onChange,
  className = '',
}: GlassSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleClickOutside])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-full border border-white/[0.08] bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-colors hover:bg-white/[0.08] focus:border-white/20"
      >
        <span className={selected ? 'text-white' : 'text-neutral-500'}>
          {selected?.label ?? placeholder}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 top-full z-50 mt-1 w-full"
          >
            <GlassPanel variant="dense" className="max-h-60 overflow-y-auto rounded-xl p-1.5 shadow-xl">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value)
                    setOpen(false)
                  }}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    opt.value === value
                      ? 'bg-white/10 text-white'
                      : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
