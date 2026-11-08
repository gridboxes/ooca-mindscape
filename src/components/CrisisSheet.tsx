import { useEffect, useRef } from 'react'
import { t, ui, type Lang } from '../content'

export default function CrisisSheet({ lang, open, onClose }: { lang: Lang; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  const lines = [
    { num: '1323', label: ui.hotline1323 },
    { num: '1669', label: ui.hotline1669 },
    { num: '02-113-6789', label: ui.samaritans },
  ]

  return (
    <dialog
      ref={ref}
      className="sheet"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="crisis-title"
    >
      <div className="sheet__inner">
        <span className="sheet__grip" aria-hidden="true" />
        <h2 id="crisis-title" className="sheet__title">
          {t(ui.crisisTitle, lang)}
        </h2>
        <p className="sheet__body">{t(ui.crisisBody, lang)}</p>
        <ul className="hotlines">
          {lines.map((l) => (
            <li key={l.num}>
              <a href={`tel:${l.num.replace(/-/g, '')}`} className="hotline">
                <span className="hotline__num">{l.num}</span>
                <span className="hotline__label">{t(l.label, lang)}</span>
                <span className="hotline__call" aria-hidden="true">☎</span>
              </a>
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn--secondary btn--block" onClick={onClose}>
          {t(ui.close, lang)}
        </button>
      </div>
    </dialog>
  )
}
