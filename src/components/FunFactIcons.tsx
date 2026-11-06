type IconProps = { size?: number }

export function EggplantIcon({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M14 6c1-2 3-3 4-2s0 3-1 4" stroke="#495a3f" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="16" cy="19" rx="9" ry="11" fill="#8a5a8c" />
      <ellipse cx="13" cy="14" rx="3" ry="4" fill="#a878aa" opacity="0.6" />
    </svg>
  )
}

export function SquashIcon({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 5v4" stroke="#495a3f" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="16" cy="20" rx="10" ry="9" fill="#cd7d5a" />
      <path d="M8 20c2-5 6-8 8-8s6 3 8 8" stroke="#bc6240" strokeWidth="1.2" fill="none" />
    </svg>
  )
}

export function MelonIcon({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="17" r="11" fill="#e3ead0" />
      <circle cx="16" cy="17" r="11" fill="none" stroke="#b2c7a2" strokeWidth="1" />
    </svg>
  )
}

export function WatermelonIcon({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="17" rx="12" ry="9" fill="#93ad80" />
      <path d="M6 13c3-1.5 17-1.5 20 0M5 17h22M6 21c3 1.5 17 1.5 20 0" stroke="#5e7350" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

export function MilestoneIcon({ size = 32 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 4l2.8 7.2L26 14l-7.2 2.8L16 24l-2.8-7.2L6 14l7.2-2.8Z"
        fill="#bc6240"
      />
      <circle cx="25" cy="7" r="1.6" fill="#778f64" />
      <circle cx="6" cy="23" r="1.2" fill="#778f64" />
    </svg>
  )
}

export const FUN_FACT_ICONS = {
  eggplant: EggplantIcon,
  squash: SquashIcon,
  melon: MelonIcon,
  watermelon: WatermelonIcon,
  milestone: MilestoneIcon,
}
