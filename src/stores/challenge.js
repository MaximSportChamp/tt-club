// src/stores/challenge.js
import { defineStore } from 'pinia'
import { fetchChallenges, fetchChallenge, put } from '@/utils/api'

export const useChallengeStore = defineStore('challenge', {
  state: () => ({
    challenges: [],
  }),
  getters: {
    getById: (state) => (id) => state.challenges.find(c => c.id === Number(id)) || null,
  },
  actions: {
    async fetchChallenges() {
      this.challenges = await fetchChallenges()
    },
    async fetchChallenge(id) {
      const challenge = await fetchChallenge(id)
      const idx = this.challenges.findIndex(c => c.id === challenge.id)
      if (idx >= 0) this.challenges[idx] = challenge
      else this.challenges.push(challenge)
      return challenge
    },
    async addParticipant(id) {
      await put(`/challenges/${id}/participants`)
      const c = this.getById(id)
      if (c) c.participants = (c.participants || 0) + 1
    },
  },
})
