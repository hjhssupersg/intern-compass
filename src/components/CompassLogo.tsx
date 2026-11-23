interface CompassLogoProps {
  className?: string
}

export function CompassLogo({ className = 'h-9 w-9' }: CompassLogoProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="compass-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#compass-ring)" />
      <circle cx="24" cy="24" r="16.5" fill="#eef2ff" />
      <g stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round">
        <line x1="24" y1="9.5" x2="24" y2="12.5" />
        <line x1="24" y1="35.5" x2="24" y2="38.5" />
        <line x1="9.5" y1="24" x2="12.5" y2="24" />
        <line x1="35.5" y1="24" x2="38.5" y2="24" />
      </g>
      <g transform="rotate(35 24 24)">
        <polygon points="24,10 28,24 20,24" fill="#4f46e5" />
        <polygon points="24,38 28,24 20,24" fill="#94a3b8" />
      </g>
      <circle cx="24" cy="24" r="3" fill="#ffffff" stroke="#4f46e5" strokeWidth="1.5" />
    </svg>
  )
}