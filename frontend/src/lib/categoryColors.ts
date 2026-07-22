import type { Categoria } from '../lib/types'

export const CATEGORY_COLORS: Record<Categoria, string> = {
  REMERAS: '#6366f1',
  BUZOS: '#8b5cf6',
  PANTALONES: '#f59e0b',
  ACCESORIOS: '#10b981',
}

export const CATEGORY_BG: Record<Categoria, string> = {
  REMERAS: 'from-indigo-600/20 to-indigo-900/30',
  BUZOS: 'from-violet-600/20 to-violet-900/30',
  PANTALONES: 'from-amber-600/20 to-amber-900/30',
  ACCESORIOS: 'from-emerald-600/20 to-emerald-900/30',
}

export const CATEGORY_TAG_BG: Record<Categoria, string> = {
  REMERAS: 'bg-indigo-500/20 text-indigo-300',
  BUZOS: 'bg-violet-500/20 text-violet-300',
  PANTALONES: 'bg-amber-500/20 text-amber-300',
  ACCESORIOS: 'bg-emerald-500/20 text-emerald-300',
}

export const CATEGORY_LABEL: Record<Categoria, string> = {
  REMERAS: 'Remeras',
  BUZOS: 'Buzos',
  PANTALONES: 'Pantalones',
  ACCESORIOS: 'Accesorios',
}

export const CATEGORY_SLUG: Record<Categoria, string> = {
  REMERAS: 'remeras',
  BUZOS: 'buzos',
  PANTALONES: 'pantalones',
  ACCESORIOS: 'accesorios',
}

export const CATEGORY_GALLERY: Record<Categoria, string[]> = {
  REMERAS: [
    'from-indigo-600/20 to-indigo-900/30',
    'from-indigo-500/15 to-indigo-800/35',
    'from-indigo-700/25 to-indigo-950/40',
  ],
  BUZOS: [
    'from-violet-600/20 to-violet-900/30',
    'from-violet-500/15 to-violet-800/35',
    'from-violet-700/25 to-violet-950/40',
  ],
  PANTALONES: [
    'from-amber-600/20 to-amber-900/30',
    'from-amber-500/15 to-amber-800/35',
    'from-amber-700/25 to-amber-950/40',
  ],
  ACCESORIOS: [
    'from-emerald-600/20 to-emerald-900/30',
    'from-emerald-500/15 to-emerald-800/35',
    'from-emerald-700/25 to-emerald-950/40',
  ],
}
