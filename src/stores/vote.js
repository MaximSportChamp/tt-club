// src/stores/vote.js
import { defineStore } from 'pinia'

export const useVotesStore = defineStore('votes', {
  state: () => ({
    // карта: challengeId -> массив уникальных submissionId, за которые уже проголосовали
    votesByChallenge: /** @type {Record<number, number[]>} */ ({}),
    // лимит голосов на один челлендж
    limitPerChallenge: 3,
  }),
  getters: {
    // сколько голосов осталось на этот челлендж
    remainingVotes: (state) => (challengeId) => {
      const cid = Number(challengeId)
      const used = state.votesByChallenge[cid]?.length ?? 0
      return Math.max(0, state.limitPerChallenge - used)
    },
    // есть ли голос за конкретную работу
    hasVotedFor: (state) => (challengeId, submissionId) => {
      const cid = Number(challengeId)
      const sid = Number(submissionId)
      return (state.votesByChallenge[cid] ?? []).includes(sid)
    },
    // совместимость со старым кодом: true, если голоса кончились
    hasVoted() {
      return (challengeId) => this.remainingVotes(challengeId) === 0
    },
    // список уже выбранных сабмишнов в пределах челленджа
    votedIds: (state) => (challengeId) => state.votesByChallenge[Number(challengeId)] ?? [],
  },
  actions: {
    // попытка проголосовать за работу
    vote(challengeId, submissionId) {
      const cid = Number(challengeId)
      const sid = Number(submissionId)

      // нельзя больше лимита
      if (this.remainingVotes(cid) <= 0) return false
      // нельзя дважды за одну работу
      const arr = this.votesByChallenge[cid] ?? (this.votesByChallenge[cid] = [])
      if (arr.includes(sid)) return false

      arr.push(sid)
      return true
    },
    // сброс голосов по челленджу (на всякий случай админская утилита)
    resetChallengeVotes(challengeId) {
      const cid = Number(challengeId)
      this.votesByChallenge[cid] = []
    },
  },
})
