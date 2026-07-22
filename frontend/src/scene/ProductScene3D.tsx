import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import CameraRig from './CameraRig'
import HeroGarment from './HeroGarment'
import Lighting from './Lighting'
import { CATEGORY_COLORS } from '../lib/categoryColors'
import type { ProductoResponse } from '../lib/types'

export default function ProductScene3D({ product }: { product: ProductoResponse }) {
  const primaryVariant = product.variantes[0]
  const color = CATEGORY_COLORS[product.categoria] ?? '#6366f1'

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.5, 5], fov: 45 }}
      frameloop="always" /* scroll progress + idle float continua -> always necesario */
      style={{ width: '100%', height: '100%' }}
    >
      <CameraRig />
      <Suspense fallback={null}>
        <HeroGarment
          color={color}
          metalness={primaryVariant?.color.toLowerCase().includes('metal') ? 0.8 : 0.4}
        />
        <Lighting />
      </Suspense>
    </Canvas>
  )
}
