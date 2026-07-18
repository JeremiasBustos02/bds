import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../lib/types'

interface CartState {
  items: CartItem[]
  agregarItem: (item: Omit<CartItem, 'cantidad'> & { cantidad?: number }) => void
  quitarItem: (varianteId: string) => void
  actualizarCantidad: (varianteId: string, cantidad: number) => void
  vaciarCarrito: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      agregarItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.varianteId === item.varianteId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.varianteId === item.varianteId
                  ? { ...i, cantidad: i.cantidad + (item.cantidad ?? 1) }
                  : i,
              ),
            }
          }
          return { items: [...state.items, { ...item, cantidad: item.cantidad ?? 1 }] }
        }),

      quitarItem: (varianteId) =>
        set((state) => ({
          items: state.items.filter((i) => i.varianteId !== varianteId),
        })),

      actualizarCantidad: (varianteId, cantidad) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.varianteId === varianteId ? { ...i, cantidad: Math.max(1, cantidad) } : i,
          ),
        })),

      vaciarCarrito: () => set({ items: [] }),
    }),
    { name: 'bds-cart' },
  ),
)

export const selectCantidadTotal = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.cantidad, 0)

export const selectPrecioTotal = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.precio * i.cantidad, 0)
