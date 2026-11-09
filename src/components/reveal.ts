import { createElement, useEffect, useRef, type HTMLAttributes } from 'react'

/**
 * For content that appears below what you just tapped (a follow-up question, the hold button):
 * on a phone it can land below the fold or under the sticky Next bar, so bring it into view.
 * Only scrolls when it isn't already fully visible.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const id = window.setTimeout(() => {
      const foot = document.querySelector<HTMLElement>('.ms__card .step-foot')
      const bottomLimit = foot ? foot.getBoundingClientRect().top : window.innerHeight
      const r = el.getBoundingClientRect()
      if (r.bottom <= bottomLimit && r.top >= 0) return
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollIntoView({ block: 'end', behavior: still ? 'auto' : 'smooth' })
    }, 120)
    return () => window.clearTimeout(id)
  }, [])
  return ref
}

/** A section that scrolls itself into view when it first appears */
export function Reveal({ as = 'section', ...props }: { as?: 'section' | 'div' } & HTMLAttributes<HTMLElement>) {
  const ref = useReveal<HTMLElement>()
  return createElement(as, { ...props, ref })
}
