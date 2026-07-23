import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface GarmentModelProps {
  url: string
  targetHeight?: number
  position?: [number, number, number]
  rotationOffset?: [number, number, number]
  scrollRotation?: boolean
  scrollProgress?: number
  idleFloat?: boolean
}

function logSceneStructure(label: string, obj: THREE.Object3D) {
  const meshes: string[] = []
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const geo = child.geometry
      const posAttr = geo?.getAttribute('position')
      meshes.push(
        `${child.name || '(unnamed)'}: geo=${geo?.constructor.name} posAttr=${posAttr ? `${posAttr.count} verts` : 'NONE'}`,
      )
    }
  })
  console.log(`[GarmentModel] ${label}: children=${obj.children.length}, meshes=[${meshes.join('; ')}]`)
}

function GarmentModelInner({
  url,
  targetHeight = 2.5,
  position = [0, 0, 0],
  rotationOffset = [0, 0, 0],
  scrollRotation = false,
  scrollProgress = 0,
  idleFloat = false,
}: GarmentModelProps) {
  const { scene } = useGLTF(url)
  const groupRef = useRef<THREE.Group>(null)
  const currentRot = useRef(0)

  const { clonedScene, centerOffset, computedScale } = useMemo(() => {
    logSceneStructure('scene BEFORE clone', scene)

    const cloned = scene.clone(true) as THREE.Group

    logSceneStructure('cloned AFTER clone', cloned)

    const box = new THREE.Box3().setFromObject(cloned)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    const s = targetHeight / size.y

    console.log(`[GarmentModel] url=${url}`, {
      bboxMin: box.min.toArray(),
      bboxMax: box.max.toArray(),
      bboxSize: size.toArray(),
      center: center.toArray(),
      centerVec: [-center.x, -center.y, -center.z],
      computedScale: s,
    })

    return { clonedScene: cloned, centerOffset: center, computedScale: s }
  }, [scene, targetHeight, url])

  useEffect(() => {
    return () => {
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose()
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose())
          } else if (child.material) {
            child.material.dispose()
          }
        }
      })
    }
  }, [clonedScene])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    if (scrollRotation) {
      const targetRot = scrollProgress * Math.PI * 2 * 1.5
      const lerpFactor = 1 - Math.exp(-3 * delta)
      currentRot.current += (targetRot - currentRot.current) * lerpFactor
      groupRef.current.rotation.y = currentRot.current
    }

    if (idleFloat) {
      const t = performance.now() / 1000
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.08
    }
  })

  const centerVec = useMemo(
    () => new THREE.Vector3(-centerOffset.x, -centerOffset.y, -centerOffset.z),
    [centerOffset],
  )

  return (
    <group ref={groupRef} position={position} rotation={rotationOffset}>
      <group position={centerVec}>
        <primitive object={clonedScene} scale={computedScale} />
      </group>
    </group>
  )
}

export default function GarmentModel(props: GarmentModelProps) {
  return <GarmentModelInner {...props} />
}
