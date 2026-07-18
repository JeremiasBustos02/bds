import { useState } from 'react'
import type { VarianteConStock } from '../lib/types'

export default function SizeSelector({
  variantes,
  precioBase,
  onAddToCart,
}: {
  variantes: VarianteConStock[]
  precioBase: number
  onAddToCart: (variante: VarianteConStock) => void
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = variantes.find((v) => v.id === selectedId) ?? null

  const totalPrice = selected
    ? precioBase + selected.precioAdicional
    : precioBase

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {variantes.map((v) => {
          const outOfStock = v.stockDisponible <= 0
          const isSelected = v.id === selectedId

          return (
            <button
              key={v.id}
              type="button"
              disabled={outOfStock}
              onClick={() => setSelectedId(v.id)}
              className={`min-w-[3rem] rounded-md border px-3 py-2 text-sm font-medium transition-all
                ${
                  isSelected
                    ? 'border-white bg-white text-neutral-900'
                    : outOfStock
                      ? 'border-neutral-700 text-neutral-600 line-through cursor-not-allowed'
                      : 'border-neutral-600 text-neutral-300 hover:border-neutral-400'
                }`}
            >
              {v.talle}
            </button>
          )
        })}
      </div>

      <p className="text-sm text-neutral-400">
        {selected
          ? `${selected.color} · ${selected.talle}`
          : 'Seleccioná un talle'}
      </p>

      <button
        type="button"
        disabled={!selected}
        onClick={() => {
          if (!selected) return
          onAddToCart(selected)
        }}
        className={`w-full rounded-full px-8 py-3 text-sm font-semibold transition-all
          ${
            selected
              ? 'bg-white text-neutral-900 hover:bg-neutral-200 hover:scale-105 active:scale-95'
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
          }`}
      >
        Agregar al carrito — ${totalPrice.toLocaleString('es-AR')}
      </button>
    </div>
  )
}
