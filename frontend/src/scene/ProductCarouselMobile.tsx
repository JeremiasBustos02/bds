import { useRef, useState, useCallback, useEffect } from 'react'
import { useFrame, useThree, Canvas } from '@react-three/fiber'
import { useNavigate } from 'react-router-dom'
import type { Mesh, Group } from 'three'
import type { ProductoResponse } from '../lib/types'
import { CATEGORY_COLORS } from '../lib/categoryColors'
import GarmentModel from './GarmentModel'
import { GARMENT_SCALE } from '../lib/garmentScale'

const CATEGORY_PICK_ORDER: Categoria[] = ['REMERAS', 'BUZOS', 'PANTALONES']
const SLIDE_SPACING = 3.2
const SWIPE_THRESHOLD = 40

function pickRepresentativeProducts(products: ProductoResponse[]) {
  const picked: ProductoResponse[] = []
  for (const cat of CATEGORY_PICK_ORDER) {
    const found = products.find((p) => p.categoria === cat)
    if (found) picked.push(found)
  }
  return picked
}

function MobileCarouselItem({
  product,
  swipeGuard,
}: {
  product: ProductoResponse
  swipeGuard: React.MutableRefObject<boolean>
}) {
  const meshRef = useRef<Mesh>(null)
  const groupRef = useRef<Group>(null)

  useEffect(() => {
    const mesh = meshRef.current
    return () => {
      if (mesh) {
        mesh.geometry.dispose()
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose())
        } else {
          mesh.material.dispose()
        }
      }
    }
  }, [])

  const navigate = useNavigate()
  const color = CATEGORY_COLORS[product.categoria] ?? '#6366f1'

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4
    } else if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4
    }
  })

  const handleClick = () => {
    if (!swipeGuard.current) navigate(`/producto/${product.slug}`)
  }

  if (product.modelo3dUrl) {
    return (
      <group ref={groupRef} onClick={handleClick}>
        <GarmentModel
          url={product.modelo3dUrl}
          targetHeight={GARMENT_SCALE.heroCarouselMobile}
        />
      </group>
    )
  }

  return (
    <mesh
      ref={meshRef}
      onClick={handleClick}
    >
      <torusKnotGeometry args={[0.75, 0.22, 64, 16]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.5}
        roughness={0.3}
        clearcoat={0.3}
      />
    </mesh>
  )
}

function CameraRig({ currentIndex }: { currentIndex: number }) {
  const { camera } = useThree()
  const smoothX = useRef(0)

  useFrame((_state, delta) => {
    const target = currentIndex * SLIDE_SPACING
    const lerpFactor = 1 - Math.exp(-6 * delta)
    smoothX.current += (target - smoothX.current) * lerpFactor
    camera.position.x = smoothX.current
    camera.lookAt(smoothX.current, 0, 0)
  })

  return null
}

export default function ProductCarouselMobile({
  products,
}: {
  products: ProductoResponse[]
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const swipeGuard = useRef(false)

  const visible = pickRepresentativeProducts(products)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    swipeGuard.current = false
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const dx = touchStartX.current - e.changedTouches[0].clientX
      const dy = touchStartY.current - e.changedTouches[0].clientY

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
        swipeGuard.current = true
        if (dx > 0 && currentIndex < visible.length - 1) {
          setCurrentIndex((i) => i + 1)
        } else if (dx < 0 && currentIndex > 0) {
          setCurrentIndex((i) => i - 1)
        }
      }
    },
    [currentIndex, visible.length],
  )

  if (visible.length === 0) return null

  const current = visible[currentIndex]

  return (
    <div className="flex h-full flex-col">
      <div
        className="min-h-0 flex-1 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 5], fov: 42 }}
          frameloop="always" /* rotación idle continua de MobileCarouselItem -> always necesario */
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-3, 2, 4]} intensity={0.4} />
          <pointLight position={[-2, 1, -3]} intensity={0.5} color="#818cf8" />
          <pointLight position={[0, -2, 2]} intensity={0.25} color="#c084fc" />
          <CameraRig currentIndex={currentIndex} />
          {visible.map((product, i) => (
            <group key={product.id} position={[i * SLIDE_SPACING, 0, 0]}>
              <MobileCarouselItem product={product} swipeGuard={swipeGuard} />
            </group>
          ))}
        </Canvas>
      </div>

      <div className="shrink-0 pb-6 pt-2 text-center">
        <p className="px-4 text-sm font-semibold text-white">
          {current.nombre}
        </p>
        <p className="text-xs text-neutral-400">
          ${current.precioBase.toLocaleString('es-AR')}
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          {visible.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-5 bg-white'
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
