import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useRef } from 'react'
import { useScrollStore } from '../store/useScrollStore'

const DOLLY_CHECKPOINTS = [
  { checkpoint: 0, pos: [0, 1.5, 5.0] as const },
  { checkpoint: 0.2, pos: [0, 1.5, 4.2] as const },
  { checkpoint: 0.45, pos: [0, 1.8, 4.4] as const },
  { checkpoint: 0.7, pos: [0, 1.2, 3.8] as const },
  { checkpoint: 0.95, pos: [0, 1.5, 4.0] as const },
] as const

function getDolly(progress: number) {
  const clamped = Math.min(Math.max(progress, 0), 1)
  const total = DOLLY_CHECKPOINTS.length - 1
  const rawIndex = clamped * total
  const i = Math.min(Math.max(Math.floor(rawIndex), 0), total - 1)
  const t = rawIndex - i

  const a = DOLLY_CHECKPOINTS[i]
  const b = DOLLY_CHECKPOINTS[i + 1]
  if (!a || !b) return [0, 1.5, 5.0] as const

  return [
    a.pos[0] + (b.pos[0] - a.pos[0]) * t,
    a.pos[1] + (b.pos[1] - a.pos[1]) * t,
    a.pos[2] + (b.pos[2] - a.pos[2]) * t,
  ] as const
}

export default function CameraRig() {
  const progress = useScrollStore((s) => s.progress)
  const currentPos = useRef(new Vector3(0, 1.5, 5))

  useFrame(({ camera }, delta) => {
    const target = getDolly(progress)
    const targetPos = new Vector3(target[0], target[1], target[2])

    const lerpFactor = 1 - Math.exp(-4 * delta)
    currentPos.current.lerp(targetPos, lerpFactor)
    camera.position.copy(currentPos.current)

    camera.lookAt(0, 0.3, 0)
  })

  return null
}
