import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import Nosotros from './pages/Nosotros'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/producto/:slug" element={<ProductPage />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
