export default function Spacecraft() {
  return (
    <div className="spacecraft" aria-hidden="true">
      <div className="spacecraft__trail" />
      <svg viewBox="0 0 64 24" className="spacecraft__svg">
        <ellipse cx="10" cy="12" rx="9" ry="3.2" fill="rgba(244, 233, 216, 0.55)" />
        <path
          d="M14 12 L52 12 L60 8 L60 16 L52 12 Z"
          fill="#F4E9D8"
        />
        <path d="M24 9 L34 3 L40 9 Z" fill="#C9A227" opacity="0.9" />
        <path d="M24 15 L34 21 L40 15 Z" fill="#C9A227" opacity="0.9" />
        <circle cx="44" cy="12" r="2.4" fill="#0B1220" opacity="0.6" />
      </svg>
    </div>
  )
}
