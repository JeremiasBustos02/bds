import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { isTokenExpired } from '../lib/jwt'
import type { RolUsuario } from '../lib/types'

export default function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode
  requiredRole?: RolUsuario
}) {
  const token = useAuthStore((s) => s.token)
  const usuario = useAuthStore((s) => s.usuario)
  const logout = useAuthStore((s) => s.logout)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (isTokenExpired(token)) {
    logout()
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (requiredRole) {
    if (!usuario) {
      return (
        <div className="flex h-screen items-center justify-center bg-neutral-950">
          <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-700" />
        </div>
      )
    }
    if (usuario.rol !== requiredRole) {
      return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}
