/** The ooca CI's line "Tel" icon: one rounded stroke that takes the text colour and size. */
export default function PhoneIcon({ className = 'icon-phone' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6.6 3.5h2.1c.5 0 .9.3 1 .8l.8 3.4c.1.4-.1.9-.4 1.1l-1.7 1.2a12.2 12.2 0 0 0 5.6 5.6l1.2-1.7c.3-.4.7-.5 1.1-.4l3.4.8c.5.1.8.5.8 1v2.1c0 1.2-1 2.1-2.2 2.1C10.7 19.5 4.5 13.3 4.5 5.7c0-1.2.9-2.2 2.1-2.2Z" />
    </svg>
  )
}
