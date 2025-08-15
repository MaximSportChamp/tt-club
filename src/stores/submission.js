// src/stores/submission.js
import { defineStore } from 'pinia'
import { defaultLikes } from '@/utils/format'

let _id = 1000
const nextId = () => ++_id

export const useSubmissionStore = defineStore('submission', {
  state: () => ({
    // Тестовый сид, чтобы /votes и превью сразу ожили
    // (challengeId: 1 и 2 имеют по 2 работы; 3 — пустой)
    submissions: [
      // challenge 1
      { id: nextId(), challengeId: 1, userId: 1, title: 'Флип в упор',         videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', likes: 7 },
      { id: nextId(), challengeId: 1, userId: 2, title: 'Трюк под столом',     videoUrl: 'https://www.w3schools.com/html/movie.mp4',   likes: 3 },
      // challenge 2
      { id: nextId(), challengeId: 2, userId: 1, title: 'Смэш на вылет',       videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', likes: 5 },
      { id: nextId(), challengeId: 2, userId: 3, title: 'Контрудар со стенки', videoUrl: 'https://www.w3schools.com/html/movie.mp4',   likes: 2 },
      // challenge 3 — оставляем пустым
    ]
  }),

  getters: {
    /**
     * Все видео пользователя
     */
    byUser: (state) => (userId) =>
      state.submissions.filter(s => +s.userId === +userId),

    /**
     * Все видео конкретного челленджа
     */
    byChallenge: (state) => (challengeId) =>
      state.submissions.filter(s => +s.challengeId === +challengeId),

    /**
     * Кол-во работ по челленджу (для /votes)
     */
    countByChallenge: (state) => (challengeId) =>
      state.submissions.reduce((acc, s) => acc + (+s.challengeId === +challengeId ? 1 : 0), 0),

    /**
     * Сумма лайков по челленджу (для агр. метрики)
     */
    totalLikesByChallenge: (state) => (challengeId) =>
      state.submissions.reduce(
        (acc, s) => acc + (+s.challengeId === +challengeId ? defaultLikes(s) : 0),
        0
      ),

    /**
     * Первое видео челленджа — удобно как превью на /votes
     */
    firstVideoByChallenge: (state) => (challengeId) => {
      const first = state.submissions.find(s => +s.challengeId === +challengeId)
      return first?.videoUrl || null
    }
  },

  actions: {
    /**
     * Добавляет новую работу (возвращает её id)
     */
    addSubmission(challengeId, userId, videoUrl, title = 'Моя работа') {
      const id = nextId()
      this.submissions.push({
        id,
        challengeId: +challengeId,
        userId: +userId,
        videoUrl,
        title,
        likes: 0
      })
      return id
    },

    /**
     * Увеличивает лайки у конкретной работы
     */
    addLike(submissionId) {
      const s = this.submissions.find(x => x.id === submissionId)
      if (s) s.likes++
    }
  }
})
