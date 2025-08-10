// src/stores/challenge.js
import { defineStore } from 'pinia'

export const useChallengeStore = defineStore('challenge', {
  state: () => ({
    challenges: [
      {
        id: 1,
        title: 'Трюк №1',
        description: 'Потрясающий флип с мячом',
        participants: 5,
        views: 20,
        // likes если хранишь — оставляй
        isNew: true,
        isHot: false,
        videoUrl: '/videos/trick1.mp4',
        poster: '/img/challenges/1.jpg',                 // ← опционально
        voteEndsAt: '2025-09-30T23:59:59Z',        // ← опционально (ISO-строка)
      },
      {
        id: 2,
        title: 'Трюк №2',
        description: 'Невозможный стиль мастера',
        participants: 8,
        views: 35,
        isNew: false,
        isHot: true,
        videoUrl: '/videos/trick2.mp4',
        poster: '/img/challenges/2.jpg',
        voteEndsAt: '2025-08-09T23:59:59Z',
      },
      {
        id: 3,
        title: 'Трюк №3',
        description: 'Безумный слэш стиль',
        participants: 2,
        views: 10,
        isNew: false,
        isHot: false,
        videoUrl: '/videos/trick3.mp4',
        // можно без постера и даты — поля просто опусти
      },
    ],
  }),
  getters: {
    getById: (state) => (id) => state.challenges.find(c => c.id === Number(id)) || null,
  },
  actions: {
    addParticipant(id) {
      const c = this.getById(id)
      if (c) c.participants++
    }
  }
})

