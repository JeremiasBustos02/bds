import { useRef, useState } from 'react'
import { useFrame, Canvas } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import type { Mesh, Group } from 'three'
import type { ProductoResponse, Categoria } from '../lib/types'

const CATEGORY_COLORS: Record<Categoria, string> = {
  REMERAS: '#6366f1',
  BUZOS: '#8b5cf6',
  PANTALONES: '#f59e0b',
  ACCESORIOS: '#10b981',
}

const ARC_START = -0.6
const ARC_END = 0.6
const RADIUS = 2.8
const MAX_MOUSE_ROTATION = 0.25

function CarouselItem({
  product,
  index,
  total,
}: {
  product: ProductoResponse
  index: number
  total: number
}) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  const angle = ARC_START + (index / Math.max(total - 1, 1)) * (ARC_END - ARC_START)
  const x = Math.sin(angle) * RADIUS
  const z = -Math.cos(angle) * RADIUS + 1.5

  const color = CATEGORY_COLORS[product.categoria] ?? '#6366f1'
  const minPrice = product.precioBase

  const idleRot = useRef(0)

  useFrame((_state, delta) => {
    if (!meshRef.current) return
    idleRot.current += delta * 0.4
    meshRef.current.rotation.y = idleRot.current
  })

  return (
    <group position={[x, 0.2, z]}>
      <mesh
        ref={meshRef}
        scale={hovered ? 1.08 : 1}
        onPointerOver={() => {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
        onClick={() => navigate(`/producto/${product.slug}`)}
      >
        <torusKnotGeometry args={[0.6, 0.18, 64, 16]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.5}
          roughness={0.3}
          clearcoat={0.3}
          emissive={hovered ? color : '#000000'}
          emissiveIntensity={hovered ? 0.15 : 0}
        />
      </mesh>

      {hovered && (
        <Html position={[0, 0.9, 0]} center>
          <div className="pointer-events-none whitespace-nowrap rounded-lg bg-neutral-900/90 px-3 py-2 text-center backdrop-blur-sm">
            <p className="text-xs font-medium text-white">{product.nombre}</p>
            <p className="text-xs text-neutral-400">
              ${minPrice.toLocaleString('es-AR')}
            </p>
          </div>
        </Html>
      )}
    </group>
  )
}

function CarouselContent({
  products,
}: {
  products: ProductoResponse[]
}) {
  const groupRef = useRef<Group>(null)
  const currentRot = useRef(0)

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const targetRot = state.pointer.x * MAX_MOUSE_ROTATION
    const lerpFactor = 1 - Math.exp(-5 * delta)
    currentRot.current += (targetRot - currentRot.current) * lerpFactor
    groupRef.current.rotation.y = currentRot.current
  })

  const visible = products.slice(0, 5)

  return (
    <group ref={groupRef}>
      {visible.map((product, i) => (
        <CarouselItem
          key={product.id}
          product={product}
          index={i}
          total={visible.length}
        />
      ))}
    </group>
  )
}

export default function ProductCarousel3D({
  products,
}: {
  products: ProductoResponse[]
}) {
  if (products.length === 0) return null

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.5, 5], fov: 40 }}
      frameloop="always"
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, 2, 4]} intensity={0.4} />
      <CarouselContent products={products} />
    </Canvas>
  )
}
