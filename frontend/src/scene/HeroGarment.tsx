import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScrollStore } from '../store/useScrollStore'
import type { Mesh } from 'three'
import GarmentModel from './GarmentModel'
import { GARMENT_SCALE } from '../lib/garmentScale'

const ROTATIONS_TOTAL = 1.5

function ProceduralFallback({
  color,
  metalness,
  roughness,
  clearcoat,
}: {
  color: string
  metalness: number
  roughness: number
  clearcoat: number
}) {
  const meshRef = useRef<Mesh>(null)

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

  const progress = useScrollStore((s) => s.progress)
  const currentRot = useRef(0)

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return

    meshRef.current.scale.setScalar(1)

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

export default function HeroGarment({
  color = '#6366f1',
  metalness = 0.6,
  roughness = 0.3,
  clearcoat = 0.4,
  modelo3dUrl,
}: {
  color?: string
  metalness?: number
  roughness?: number
  clearcoat?: number
  modelo3dUrl?: string | null
}) {
  const progress = useScrollStore((s) => s.progress)

  if (modelo3dUrl) {
    return (
      <GarmentModel
        url={modelo3dUrl}
        targetHeight={GARMENT_SCALE.productPage}
        scrollRotation
        scrollProgress={progress}
        idleFloat
      />
    )
  }

  return (
    <ProceduralFallback
      color={color}
      metalness={metalness}
      roughness={roughness}
      clearcoat={clearcoat}
    />
  )
}
