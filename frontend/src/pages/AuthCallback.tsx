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

    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      navigate('/login', { replace: true, state: { error } })
      return
    }

    if (!code) {
      navigate('/login', { replace: true })
      return
    }

    async function exchangeCode(code: string) {
      try {
        const res = await fetch('/api/auth/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        })

        if (!res.ok) throw new Error('Código inválido o expirado')

        const data = await res.json() as { token: string }
        if (!data.token) throw new Error('Token no recibido')

        await loginWithGoogleOAuth(data.token)
        navigate('/', { replace: true })
      } catch {
        navigate('/login', { replace: true })
      }
    }

    exchangeCode(code)
  }, [navigate, searchParams, loginWithGoogleOAuth])

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-950">
      <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-700" />
    </div>
  )
}
