import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const loginWithGoogleOAuth = useAuthStore((s) => s.loginWithGoogleOAuth)
  const llamado = useRef(false)

  useEffect(() => {
    if (llamado.current) return
    llamado.current = true

    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (error) {
      navigate('/login', { replace: true, state: { error } })
      return
    }

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    loginWithGoogleOAuth(token)
      .then(() => navigate('/', { replace: true }))
      .catch(() => navigate('/login', { replace: true }))
  }, [navigate, searchParams, loginWithGoogleOAuth])

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-950">
      <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-700" />
    </div>
  )
}
