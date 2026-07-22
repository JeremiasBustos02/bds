import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import CameraRig from './CameraRig'
import HeroGarment from './HeroGarment'
import Lighting from './Lighting'

export default function Scene3D() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.5, 5], fov: 45 }}
      frameloop="always" /* scroll progress + idle float continua -> always necesario */
      style={{ width: '100%', height: '100%' }}
    >
      <CameraRig />
      <Suspense fallback={null}>
        <HeroGarment />
        <Lighting />
      </Suspense>
    </Canvas>
  )
}
