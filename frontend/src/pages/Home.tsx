import { useProducts } from '../hooks/useProducts'
import FloatingNavbar from '../components/FloatingNavbar'
import HeroSection from '../components/HeroSection'
import CtaSection from '../components/CtaSection'
import ProductCarousel from '../components/ProductCarousel'
import FatFooter from '../components/FatFooter'

export default function Home() {
  const { products, loading } = useProducts()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <FloatingNavbar />
        <div className="h-8 w-8 animate-pulse rounded-full bg-neutral-700" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <FloatingNavbar />
      <HeroSection products={products} />
      <CtaSection />
      <ProductCarousel products={products} />
      <div className="overflow-x-hidden pb-4 pt-12 md:pb-6">
        <FatFooter />
      </div>
    </div>
  )
}
