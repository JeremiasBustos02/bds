import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

function RotatingCube() {
  const meshRef = useRef<Mesh>(null)

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6366f1" />
    </mesh>
  )
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <RotatingCube />
      <OrbitControls />
    </Canvas>
  )
}
