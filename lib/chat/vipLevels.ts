export function getVipLevelName(vipLevel?: number): string {
  const level = Math.max(1, Math.min(10, vipLevel ?? 1))
  if (level <= 1) return 'Bronze'
  if (level === 2) return 'Silver'
  if (level === 3) return 'Gold'
  if (level === 4) return 'Platinum'
  if (level === 5) return 'Diamond'
  if (level === 6) return 'Elite'
  if (level === 7) return 'Black'
  return 'Obsidian'
}

export function getVipLevelTagTone(vipLevel?: number): {
  chipClass: string
  chipStyle: { backgroundColor: string; borderColor: string; color: string }
  iconStyle: { color: string }
} {
  const levelName = getVipLevelName(vipLevel)
  switch (levelName) {
    case 'Bronze':
      return {
        chipClass: 'border',
        chipStyle: { backgroundColor: 'rgba(245, 158, 11, 0.14)', borderColor: 'rgba(251, 191, 36, 0.52)', color: '#fcd34d' },
        iconStyle: { color: '#fcd34d' },
      }
    case 'Silver':
      return {
        chipClass: 'border',
        chipStyle: { backgroundColor: 'rgba(148, 163, 184, 0.14)', borderColor: 'rgba(203, 213, 225, 0.52)', color: '#e2e8f0' },
        iconStyle: { color: '#e2e8f0' },
      }
    case 'Gold':
      return {
        chipClass: 'border',
        chipStyle: { backgroundColor: 'rgba(250, 204, 21, 0.14)', borderColor: 'rgba(253, 224, 71, 0.52)', color: '#fde047' },
        iconStyle: { color: '#fde047' },
      }
    case 'Platinum':
      return {
        chipClass: 'border',
        chipStyle: { backgroundColor: 'rgba(34, 211, 238, 0.14)', borderColor: 'rgba(103, 232, 249, 0.52)', color: '#67e8f9' },
        iconStyle: { color: '#67e8f9' },
      }
    case 'Diamond':
      return {
        chipClass: 'border',
        chipStyle: { backgroundColor: 'rgba(59, 130, 246, 0.14)', borderColor: 'rgba(147, 197, 253, 0.52)', color: '#93c5fd' },
        iconStyle: { color: '#93c5fd' },
      }
    case 'Elite':
      return {
        chipClass: 'border',
        chipStyle: { backgroundColor: 'rgba(168, 85, 247, 0.14)', borderColor: 'rgba(196, 181, 253, 0.52)', color: '#c4b5fd' },
        iconStyle: { color: '#c4b5fd' },
      }
    case 'Black':
      return {
        chipClass: 'border',
        chipStyle: { backgroundColor: 'rgba(82, 82, 91, 0.22)', borderColor: 'rgba(212, 212, 216, 0.52)', color: '#e4e4e7' },
        iconStyle: { color: '#e4e4e7' },
      }
    case 'Obsidian':
    default:
      return {
        chipClass: 'border',
        chipStyle: { backgroundColor: 'rgba(124, 58, 237, 0.16)', borderColor: 'rgba(196, 181, 253, 0.52)', color: '#c4b5fd' },
        iconStyle: { color: '#c4b5fd' },
      }
  }
}

