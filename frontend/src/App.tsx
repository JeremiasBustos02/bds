import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthStore } from './store/useAuthStore'
import AdminLayout from './components/admin/AdminLayout'

const Home = lazy(() => import('./pages/Home'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const Nosotros = lazy(() => import('./pages/Nosotros'))
const CartPage = lazy(() => import('./pages/CartPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))
const MisPedidosPage = lazy(() => import('./pages/MisPedidosPage'))
const PedidoDetallePage = lazy(() => import('./pages/PedidoDetallePage'))
const MiCuentaPage = lazy(() => import('./pages/MiCuentaPage'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProductos = lazy(() => import('./pages/admin/AdminProductos'))
const AdminProductoForm = lazy(() => import('./pages/admin/AdminProductoForm'))
const AdminPedidos = lazy(() => import('./pages/admin/AdminPedidos'))

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const restoreSession = useAuthStore((s) => s.restoreSession)

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthInitializer>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/producto/:slug" element={<ProductPage />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/categoria/:nombre" element={<CategoryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/mis-pedidos" element={
              <ProtectedRoute><MisPedidosPage /></ProtectedRoute>
            } />
            <Route path="/mis-pedidos/:id" element={
              <ProtectedRoute><PedidoDetallePage /></ProtectedRoute>
            } />
            <Route path="/mi-cuenta" element={
              <ProtectedRoute><MiCuentaPage /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="ADMIN"><AdminLayout /></ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="productos/nuevo" element={<AdminProductoForm />} />
              <Route path="productos/:id/editar" element={<AdminProductoForm />} />
              <Route path="pedidos" element={<AdminPedidos />} />
            </Route>
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </AuthInitializer>
    </BrowserRouter>
  )
}
