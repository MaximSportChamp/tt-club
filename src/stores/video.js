import { defineStore } from 'pinia'

export const useVideoStore = defineStore('video', {
  state: () => ({ byCh: {}, nextId: 1 }),
  actions: {
    upload({ file, chId }) {
      const url = URL.createObjectURL(file)
      const entry = { id: this.nextId++, fileUrl: url, name: file.name }
      ;(this.byCh[chId] ||= []).push(entry)
      return entry
    },
    list(chId) {
      return this.byCh[chId] || []
    }
  }
})