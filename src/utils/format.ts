export const defaultLikes = (s?: { likes?: number | null }) =>
  typeof s?.likes === 'number' && isFinite(s.likes) ? s.likes : 0

const numberFormatter = new Intl.NumberFormat('ru-RU')

export const formatNumber = (value?: number | null) =>
  typeof value === 'number' && isFinite(value)
    ? numberFormatter.format(value)
    : '0'
