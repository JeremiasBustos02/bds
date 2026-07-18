import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScrollStore } from '../store/useScrollStore'
import type { Mesh } from 'three'

const ROTATIONS_TOTAL = 1.5
const REFERENCE_SIZE = 1080
const MIN_SCALE = 0.35
const MAX_SCALE = 1.1

export default function HeroGarment({
  color = '#6366f1',
  metalness = 0.6,
  roughness = 0.3,
  clearcoat = 0.4,
}: {
  color?: string
  metalness?: number
  roughness?: number
  clearcoat?: number
}) {
  const meshRef = useRef<Mesh>(null)
  const progress = useScrollStore((s) => s.progress)
  const currentRot = useRef(0)
  const { size } = useThree()

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return

    const base = Math.min(size.width, size.height)
    const scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, base / REFERENCE_SIZE))
    meshRef.current.scale.setScalar(scale)

    const targetRot = progress * Math.PI * 2 * ROTATIONS_TOTAL
    const lerpFactor = 1 - Math.exp(-3 * delta)
    currentRot.current += (targetRot - currentRot.current) * lerpFactor
    meshRef.current.rotation.y = currentRot.current

    const floatY = Math.sin(clock.elapsedTime * 0.8) * 0.08
    meshRef.current.position.y = floatY
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusKnotGeometry args={[1, 0.35, 128, 32]} />
      <meshPhysicalMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        clearcoat={clearcoat}
      />
    </mesh>
  )
}
