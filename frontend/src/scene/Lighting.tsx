import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { useScrollStore } from '../store/useScrollStore'
import type { DirectionalLight, PointLight } from 'three'

function rimIntensity(progress: number) {
  const peaks = [0.2, 0.45, 0.7]
  let maxIntensity = 0
  for (const peak of peaks) {
    const dist = Math.abs(progress - peak)
    const intensity = Math.max(0, 1 - dist / 0.12)
    maxIntensity = Math.max(maxIntensity, intensity)
  }
  return maxIntensity * 2.5
}

export default function Lighting() {
  const keyRef = useRef<DirectionalLight>(null)
  const rimRef = useRef<PointLight>(null)
  const progress = useScrollStore((s) => s.progress)

  useFrame(() => {
    if (keyRef.current) {
      keyRef.current.intensity = 0.3 + progress * 1.2
    }
    if (rimRef.current) {
      rimRef.current.intensity = rimIntensity(progress)
    }
  })

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight
        ref={keyRef}
        position={[5, 8, 5]}
        intensity={0.3}
      />
      <pointLight
        ref={rimRef}
        position={[0, 2, -4]}
        intensity={0}
        color="#a78bfa"
      />
      <Environment preset="studio" />
    </>
  )
}
