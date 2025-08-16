const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Некорректный запрос',
  401: 'Требуется авторизация',
  403: 'Доступ запрещён',
  404: 'Не найдено',
  500: 'Ошибка сервера',
}

async function request<T>(path: string, options: RequestInit, retries: number): Promise<T> {
  const url = BASE_URL + path
  try {
    const res = await fetch(url, options)
    if (!res.ok) {
      const mapped = STATUS_MESSAGES[res.status]
      const message = mapped || (await res.text().catch(() => res.statusText))
      const err = new Error(message || res.statusText)
      ;(err as any).status = res.status
      throw err
    }
    return (await res.json()) as T
  } catch (err) {
    if (retries > 0 && options.method && options.method !== 'POST') {
      console.warn(`Retry ${options.method} ${url}, attempts left: ${retries}`)
      return request<T>(path, options, retries - 1)
    }
    console.error('API request error:', err)
    throw err
  }
}

export const get = <T>(path: string, retries = 3) =>
  request<T>(path, { method: 'GET' }, retries)

export const post = <T>(path: string, body?: any) =>
  request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  }, 0)

export const put = <T>(path: string, body?: any, retries = 3) =>
  request<T>(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  }, retries)

export const del = <T>(path: string, retries = 3) =>
  request<T>(path, { method: 'DELETE' }, retries)

// Types
export interface Challenge {
  id: number
  title: string
  description?: string
  participants?: number
  views?: number
  isNew?: boolean
  isHot?: boolean
  videoUrl?: string
  poster?: string
  voteEndsAt?: string
}

export interface Video {
  id: number
  url: string
  votes: number
}

// Entity helpers
export const fetchChallenges = () => get<Challenge[]>('/challenges')
export const fetchChallenge = (id: number | string) => get<Challenge>(`/challenges/${id}`)
export const fetchChallengeVideos = (id: number | string) => get<Video[]>(`/challenges/${id}/videos`)
export const voteVideo = (id: number | string) => post<void>(`/videos/${id}/vote`)
