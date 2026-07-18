import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import Nosotros from './pages/Nosotros'
import CartPage from './pages/CartPage'
import CheckoutPlaceholder from './pages/CheckoutPlaceholder'
import CategoryPage from './pages/CategoryPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/producto/:slug" element={<ProductPage />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPlaceholder />} />
        <Route path="/categoria/:nombre" element={<CategoryPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
