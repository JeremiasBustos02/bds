import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RolUsuario } from '../lib/types'
import { isTokenExpired } from '../lib/jwt'

export interface AuthUser {
  id: string
  email: string
  nombre: string
  apellido: string
  telefono?: string
  rol: RolUsuario
  tienePassword: boolean
}

interface RegisterData {
  email: string
  password: string
  nombre: string
  apellido: string
}

interface AuthResponse {
  id: string
  token: string
  email: string
  nombre: string
  apellido: string
  rol: RolUsuario
}

interface AuthState {
  token: string | null
  usuario: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  registro: (data: RegisterData) => Promise<void>
  logout: () => void
  restoreSession: () => Promise<void>
  loginWithGoogleOAuth: (token: string) => Promise<void>
  updateUser: (fields: Partial<AuthUser>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      usuario: null,
      loading: false,

      login: async (email, password) => {
        set({ loading: true })
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })

          if (!res.ok) {
            const err = await res.json()
            throw new Error(err.mensaje || 'Error al iniciar sesión')
          }

          const data: AuthResponse = await res.json()
          set({
            token: data.token,
            usuario: {
              id: data.id,
              email: data.email,
              nombre: data.nombre,
              apellido: data.apellido,
              rol: data.rol,
              tienePassword: true,
            },
            loading: false,
          })
        } catch (e) {
          set({ loading: false })
          throw e
        }
      },

      registro: async (data) => {
        set({ loading: true })
        try {
          const res = await fetch('/api/auth/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })

          if (!res.ok) {
            const err = await res.json()
            throw new Error(err.mensaje || 'Error al registrarse')
          }

          const authRes: AuthResponse = await res.json()
          set({
            token: authRes.token,
            usuario: {
              id: authRes.id,
              email: authRes.email,
              nombre: authRes.nombre,
              apellido: authRes.apellido,
              rol: authRes.rol,
              tienePassword: true,
            },
            loading: false,
          })
        } catch (e) {
          set({ loading: false })
          throw e
        }
      },

      loginWithGoogleOAuth: async (token) => {
        set({ token, loading: true })
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (!res.ok) throw new Error('Token inválido')
          const user: AuthUser = await res.json()
          set({ usuario: user, loading: false })
        } catch {
          set({ token: null, usuario: null, loading: false })
          throw new Error('Error al validar sesión con Google')
        }
      },

      logout: () => {
        set({ token: null, usuario: null })
      },

      updateUser: (fields) => {
        const { usuario } = get()
        if (usuario) {
          set({ usuario: { ...usuario, ...fields } })
        }
      },

      restoreSession: async () => {
        const { token } = get()
        if (!token) return

        if (isTokenExpired(token)) {
          set({ token: null, usuario: null })
          return
        }

        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (!res.ok) {
            set({ token: null, usuario: null })
            return
          }

          const user: AuthUser = await res.json()
          set({ usuario: user })
        } catch {
          set({ token: null, usuario: null })
        }
      },
    }),
    {
      name: 'bds-auth',
      partialize: (state) => ({ token: state.token }),
    },
  ),
)
