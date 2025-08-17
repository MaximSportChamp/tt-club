// src/stores/user.js

import { defineStore } from 'pinia'
import { post, setAuthToken } from '@/utils/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    // Уникальный идентификатор пользователя
    id: 1,

    // Отображаемое имя
    name: 'Игрок',

    // URL аватара
    avatar: '/avatar.png',

    // Список ID челленджей, в которых пользователь участвовал
    participated: [],

    // Список полученных бейджей
    badges: ['Новичок'],

    // Набранные очки
    points: 0,

    // Флаг аутентификации
    isAuthenticated: false,

    // Токен сессии (при необходимости можно заменить на session)
    token: null,

    // Роли пользователя
    roles: []
  }),

  getters: {
    // Статус входа пользователя
    isLoggedIn: (state) => state.isAuthenticated,
    // Текущий уровень по набранным очкам
    currentLevel: (state) => {
      const levels = [
        { name: 'Новичок',    threshold:   0 },
        { name: 'Любитель',    threshold:  50 },
        { name: 'Атакующий',   threshold: 150 },
        { name: 'Контролёр',   threshold: 300 },
        { name: 'Маэстро',     threshold: 500 }
      ]
      let lvl = levels[0]
      for (const l of levels) {
        if (state.points >= l.threshold) {
          lvl = l
        }
      }
      return lvl.name
    },

    // Процент прогресса до следующего уровня
    levelProgress: (state) => {
      const levels = [
        { name: 'Новичок',    threshold:   0 },
        { name: 'Любитель',    threshold:  50 },
        { name: 'Атакующий',   threshold: 150 },
        { name: 'Контролёр',   threshold: 300 },
        { name: 'Маэстро',     threshold: 500 }
      ]
      // Найти индекс текущего уровня
      const idx = levels.findIndex((l) => state.points < l.threshold) - 1
      const current = levels[Math.max(idx, 0)]
      const next = levels[idx + 1] || current
      // Если нет следующего уровня, прогресс 100%
      if (!levels[idx + 1]) return 100
      // Вычисляем относительный прогресс
      return Math.min(
        Math.max(
          ((state.points - current.threshold) / (next.threshold - current.threshold)) * 100,
          0
        ),
        100
      )
    },

    // Количество бейджей, ещё не просмотренных пользователем
    unreadBadges: (state) => {
      // Здесь можно хранить структуру badge: { name, read }, 
      // но пока предполагаем, что все бейджи — прочитаны
      return 0
    },

    // Статус аутентификации
    isAuth: (state) => state.isAuthenticated,

    // Список ролей пользователя
    userRoles: (state) => state.roles,

    // Проверка наличия роли
    hasRole: (state) => (role) => state.roles.includes(role)
  },

  actions: {
    /**
     * Добавляет ID челленджа в participated и начисляет очки.
     * @param {number} challengeId
     */
    addParticipation(challengeId) {
      if (!this.participated.includes(challengeId)) {
        this.participated.push(challengeId)
        // Дать 10 очков за участие
        this.points += 10
      }
    },

    /**
     * Добавляет новый бейдж, если его ещё нет.
     * @param {string} badge
     */
    addBadge(badge) {
      if (!this.badges.includes(badge)) {
        this.badges.push(badge)
      }
    },

    /**
     * Начисляет указанное количество очков.
     * @param {number} amount
     */
    addPoints(amount) {
      this.points += amount
    },

    /**
     * Сбрасывает все достижения (для тестирования).
     */
    resetProfile() {
      this.participated = []
      this.badges = []
      this.points = 0
    },

    /**
     * Устанавливает данные пользователя.
     * @param {Object} user
     */
    setUser(user) {
      if (user.id !== undefined) this.id = user.id
      if (user.name !== undefined) this.name = user.name
      if (user.avatar !== undefined) this.avatar = user.avatar
      if (user.participated !== undefined) this.participated = user.participated
      if (user.badges !== undefined) this.badges = user.badges
      if (user.points !== undefined) this.points = user.points
      if (user.roles !== undefined) this.roles = user.roles
    },

    /**
     * Авторизация через VK: отправляет VK access_token на сервер,
     * сохраняет выданный JWT и помечает пользователя как аутентифицированного.
     * @param {string} accessToken VK access_token
     */
    async login(accessToken) {
      const res = await post('/auth/vk', { access_token: accessToken })
      const token = res?.token || null
      if (token) {
        this.token = token
        this.isAuthenticated = true
        setAuthToken(token)
        localStorage.setItem('token', token)
      }
    },

    /**
     * Выход из системы: очищает токен и данные пользователя (серверных вызовов нет).
     */
    async logout() {
      this.token = null
      this.isAuthenticated = false
      setAuthToken(null)
      localStorage.removeItem('token')
      this.setUser({
        id: null,
        name: '',
        avatar: '/avatar.png',
        participated: [],
        badges: [],
        points: 0,
        roles: []
      })
    }
  }
})
