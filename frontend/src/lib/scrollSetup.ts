import { gsap, ScrollTrigger } from './gsap-setup'

export function createScrollAnimation(
  container: HTMLElement,
  onUpdate: (progress: number) => void,
) {
  const dummy = { value: 0 }

  const tl = gsap.to(dummy, {
    value: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
    },
    onUpdate: () => {
      onUpdate(dummy.value)
    },
  })

  return () => {
    tl.kill()
    ScrollTrigger.getAll().forEach((st) => st.kill())
  }
}
