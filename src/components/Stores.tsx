import { t, type Lang } from '../content'
import { heal } from '../heal-content'
import { APP_STORE_URL, PLAY_STORE_URL, platform } from './store-links'

/** App store buttons: both on a computer, only the matching one on an iPhone or Android phone */
export default function Stores({ lang }: { lang: Lang }) {
  const T = (s: Record<Lang, string>) => t(s, lang)
  const os = platform()
  return (
    <div className="stores">
      {os !== 'android' && (
        <a
          className="store"
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${T(heal.downloadOn)} ${T(heal.appStore)}`}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path
              fill="currentColor"
              d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.9-.9-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.5 3 2.4 1.2 0 1.6-.8 3.1-.8s1.8.8 3.1.8c1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7 0 0-2.7-1-2.7-4.1zM14.1 5.5c.6-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z"
            />
          </svg>
          <span>
            <small>{T(heal.downloadOn)}</small>
            {T(heal.appStore)}
          </span>
        </a>
      )}
      {os !== 'ios' && (
        <a
          className="store"
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${T(heal.getItOn)} ${T(heal.playStore)}`}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path fill="#34A853" d="M3.6 2.3 13.4 12 3.6 21.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1z" />
            <path fill="#FBBC04" d="m16.6 15.2-3.2-3.2 3.2-3.2 3.6 2.1c1 .6 1 1.6 0 2.2l-3.6 2.1z" />
            <path fill="#4285F4" d="M16.6 15.2 13.4 12l-9.8 9.7c.4.2.9.2 1.4-.1l11.6-6.4z" />
            <path fill="#EA4335" d="M16.6 8.8 5 2.4c-.5-.3-1-.3-1.4-.1l9.8 9.7 3.2-3.2z" />
          </svg>
          <span>
            <small>{T(heal.getItOn)}</small>
            {T(heal.playStore)}
          </span>
        </a>
      )}
    </div>
  )
}
