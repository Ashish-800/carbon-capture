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
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(174, 63%, 30%)', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M50 95C50 95 5 65 5 40C5 15 25 5 50 25C75 5 95 15 95 40C95 65 50 95 50 95Z"
        fill="url(#leafGradient)"
        stroke="hsl(var(--primary))"
        strokeWidth="3"
      />
       <path
        d="M50 94L50 25"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
