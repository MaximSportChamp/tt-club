export const defaultLikes = (s?: { likes?: number | null }) =>
  typeof s?.likes === 'number' && isFinite(s.likes) ? s.likes : 0
