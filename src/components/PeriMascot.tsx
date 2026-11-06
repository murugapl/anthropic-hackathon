export default function PeriMascot({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* tail */}
      <ellipse cx="50" cy="42" rx="10" ry="7" fill="#cd7d5a" />
      {/* body */}
      <ellipse cx="30" cy="38" rx="20" ry="16" fill="#dc9f80" />
      {/* belly */}
      <ellipse cx="30" cy="42" rx="13" ry="10" fill="#fbf3ef" />
      {/* feet */}
      <ellipse cx="20" cy="52" rx="5" ry="3" fill="#bc6240" />
      <ellipse cx="38" cy="52" rx="5" ry="3" fill="#bc6240" />
      {/* head */}
      <ellipse cx="18" cy="26" rx="13" ry="11" fill="#dc9f80" />
      {/* bill */}
      <path d="M4 26c0-4 4-7 10-7s10 2 10 6-4 6-10 6S4 30 4 26Z" fill="#778f64" />
      <path d="M5 27c3 1.5 11 1.5 14 0" stroke="#5e7350" strokeWidth="1.2" strokeLinecap="round" />
      {/* eyes */}
      <circle cx="14" cy="21" r="2" fill="#2a2622" />
      <circle cx="23" cy="21" r="2" fill="#2a2622" />
      {/* cheeks */}
      <circle cx="12" cy="26" r="2.5" fill="#f5e2d8" opacity="0.8" />
      <circle cx="25" cy="26" r="2.5" fill="#f5e2d8" opacity="0.8" />
    </svg>
  )
}
