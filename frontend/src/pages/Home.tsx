import { useProducts } from '../hooks/useProducts'
import FloatingNavbar from '../components/FloatingNavbar'
import HeroSection from '../components/HeroSection'
import CtaSection from '../components/CtaSection'
import CategoryGrid from '../components/CategoryGrid'

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
      <CategoryGrid products={products} />
    </div>
  )
}
