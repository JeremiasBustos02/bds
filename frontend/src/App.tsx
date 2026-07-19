import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import Nosotros from './pages/Nosotros'
import CartPage from './pages/CartPage'
import CheckoutPlaceholder from './pages/CheckoutPlaceholder'
import CategoryPage from './pages/CategoryPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AuthCallback from './pages/AuthCallback'
import ProtectedRoute from './components/ProtectedRoute'
import { useEffect } from 'react'
import { useAuthStore } from './store/useAuthStore'

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const restoreSession = useAuthStore((s) => s.restoreSession)

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  return <>{children}</>
}

function MisPedidosPlaceholder() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-center">
      <h1 className="text-3xl font-bold text-white">Mis pedidos</h1>
      <p className="mt-2 text-neutral-400">Próximamente vas a poder ver tus pedidos acá.</p>
      <a href="/" className="mt-6 rounded-full bg-white px-8 py-3 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200">
        Volver al inicio
      </a>
    </div>
  )
}

function AdminPlaceholder() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-center">
      <h1 className="text-3xl font-bold text-white">Panel de administración</h1>
      <p className="mt-2 text-neutral-400">Próximamente vas a poder administrar productos y pedidos acá.</p>
      <a href="/" className="mt-6 rounded-full bg-white px-8 py-3 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-200">
        Volver al inicio
      </a>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthInitializer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:slug" element={<ProductPage />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPlaceholder />} />
          <Route path="/categoria/:nombre" element={<CategoryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/mis-pedidos" element={
            <ProtectedRoute><MisPedidosPlaceholder /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute><AdminPlaceholder /></ProtectedRoute>
          } />
          <Route path="*" element={<Home />} />
        </Routes>
      </AuthInitializer>
    </BrowserRouter>
  )
}
