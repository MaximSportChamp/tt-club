// src/stores/submission.js
import { defineStore } from 'pinia'
import { fetchChallengeVideos, post } from '@/utils/api'

let _id = 1000
const nextId = () => ++_id

export const useSubmissionStore = defineStore('submission', {
  state: () => ({
    submissions: [],
  }),

  getters: {
    /** Все видео пользователя */
    byUser: (state) => (userId) =>
      state.submissions.filter(s => +s.userId === +userId),

    /** Все видео конкретного челленджа */
    byChallenge: (state) => (challengeId) =>
      state.submissions.filter(s => +s.challengeId === +challengeId),

    /** Кол-во работ по челленджу */
    countByChallenge: (state) => (challengeId) =>
      state.submissions.reduce((acc, s) => acc + (+s.challengeId === +challengeId ? 1 : 0), 0),

    /** Сумма лайков по челленджу */
    totalLikesByChallenge: (state) => (challengeId) =>
      state.submissions.reduce(
        (acc, s) => acc + (+s.challengeId === +challengeId ? (s.likes || 0) : 0),
        0,
      ),

    /** Первое видео челленджа — как превью на /votes */
    firstVideoByChallenge: (state) => (challengeId) => {
      const first = state.submissions.find(s => +s.challengeId === +challengeId)
      return first?.videoUrl || null
    },
  },

  actions: {
    async fetchForChallenge(challengeId) {
      const list = await fetchChallengeVideos(challengeId)
      this.submissions = this.submissions.filter(s => +s.challengeId !== +challengeId)
      const mapped = list.map(v => ({
        id: v.id,
        challengeId: +challengeId,
        userId: v.userId ?? 0,
        videoUrl: v.url,
        title: v.title ?? '',
        likes: v.votes ?? 0,
      }))
      this.submissions.push(...mapped)
    },

    /** Добавляет новую работу (возвращает её id) */
    async addSubmission(challengeId, userId, videoUrl, title = 'Моя работа') {
      const body = { userId, url: videoUrl, title }
      const res = await post(`/challenges/${challengeId}/videos`, body)
      const id = res?.id ?? nextId()
      this.submissions.push({
        id,
        challengeId: +challengeId,
        userId: +userId,
        videoUrl,
        title,
        likes: 0,
      })
      return id
    },

    /** Увеличивает лайки у конкретной работы */
    addLike(submissionId) {
      const s = this.submissions.find(x => x.id === submissionId)
      if (s) s.likes++
    },
  },
})
