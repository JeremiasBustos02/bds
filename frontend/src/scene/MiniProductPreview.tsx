import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import GarmentModel from './GarmentModel'
import { GARMENT_SCALE } from '../lib/garmentScale'

function ProceduralMesh({ color }: { color: string }) {
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

  useFrame((_state, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += delta * 0.5
    meshRef.current.rotation.x += delta * 0.12
  })

  return (
    <mesh ref={meshRef} scale={0.55}>
      <torusKnotGeometry args={[1, 0.3, 48, 12]} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.4}
        roughness={0.3}
        clearcoat={0.3}
      />
    </mesh>
  )
}

function SceneContent({ color, modelo3dUrl }: { color: string; modelo3dUrl?: string | null }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      {modelo3dUrl ? (
        <Suspense fallback={null}>
          <GarmentModel
            url={modelo3dUrl}
            targetHeight={GARMENT_SCALE.miniPreview}
          />
        </Suspense>
      ) : (
        <ProceduralMesh color={color} />
      )}
    </>
  )
}

export default function MiniProductPreview({
  color,
  modelo3dUrl,
}: {
  color: string
  modelo3dUrl?: string | null
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 3.2], fov: 40 }}
      frameloop="always" /* rotación continua en useFrame -> necesita always */
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      gl={{ antialias: false, alpha: true }}
    >
      <SceneContent color={color} modelo3dUrl={modelo3dUrl} />
    </Canvas>
  )
}
