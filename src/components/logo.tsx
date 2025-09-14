import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-label="Carbon Capture Logo"
    >
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#00AEEF', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#9CCA3C', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#9CCA3C', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1A7A3A', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      <circle cx="50" cy="50" r="48" fill="white" stroke="url(#circleGradient)" strokeWidth="4" />
      
      <path d="M-5 75 Q 20 50, 50 65 T 105 75 L 105 105 L -5 105 Z" fill="#00AEEF" />
      <path d="M-5 85 Q 25 65, 50 75 T 105 80 L 105 105 L -5 105 Z" fill="#1A7A3A" opacity="0.8" />

      <text x="50" y="30" fontFamily="Roboto, sans-serif" fontSize="12" fontWeight="bold" textAnchor="middle">
        Carbon Capture
      </text>

      <g id="bubbles">
        <circle cx="50" cy="48" r="5" fill="#9CCA3C" />
        <circle cx="43" cy="55" r="4" fill="#1A7A3A" />
        <circle cx="57" cy="56" r="3" fill="#00AEEF" />
        <circle cx="51" cy="62" r="2" fill="#9CCA3C" />
      </g>
      
      <text x="50" y="75" fontFamily="Roboto, sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">
        CO₂
      </text>
    </svg>
  );
}
