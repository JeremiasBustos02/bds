import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

function FloatingModel({
  position,
  color,
  speed = 1,
  children,
}: {
  position: [number, number, number]
  color: string
  speed?: number
  children: ReactNode
}) {
  const meshRef = useRef<Mesh>(null)

  useFrame((_state, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += delta * 0.3 * speed
    meshRef.current.rotation.y += delta * 0.5 * speed
  })

  return (
    <mesh ref={meshRef} position={position}>
      {children}
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
    </mesh>
  )
}

export default function PlaceholderModels() {
  return (
    <group>
      <FloatingModel position={[-2.5, 0.5, 0]} color="#6366f1" speed={1}>
        <dodecahedronGeometry args={[0.8, 0]} />
      </FloatingModel>

      <FloatingModel position={[0, 1.2, -2.5]} color="#f59e0b" speed={0.7}>
        <torusKnotGeometry args={[0.6, 0.2, 64, 16]} />
      </FloatingModel>

      <FloatingModel position={[2.5, -0.3, 1.5]} color="#10b981" speed={1.3}>
        <icosahedronGeometry args={[0.7, 0]} />
      </FloatingModel>
    </group>
  )
}
