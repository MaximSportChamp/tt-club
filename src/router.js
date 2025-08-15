import { createRouter, createWebHistory } from 'vue-router'

import HomeView            from '@/views/HomeView.vue'
import VoteListView        from '@/views/VoteListView.vue'
import ProfileView         from '@/views/ProfileView.vue'
import ChallengeDetail     from '@/views/ChallengeDetail.vue'
import UploadView          from '@/views/UploadView.vue'
import VoteView            from '@/views/VoteView.vue'
import ChallengeOverview   from '@/views/ChallengeOverview.vue' // ⬅️ новый пустой child
import NotFoundView        from '@/views/NotFoundView.vue'

const routes = [
  { path: '/',       component: HomeView,     name: 'Home' },
  { path: '/votes',  component: VoteListView, name: 'Votes' },
  {
    path: '/challenge/:id',
    component: ChallengeDetail,
    props: true,
    name: 'ChallengeDetail',
    // ⬇️ Больше НЕТ redirect на vote — по умолчанию открывается обзор (большая карточка)
    children: [
      { path: '',       component: ChallengeOverview,           name: 'ChallengeOverview' }, // дефолт
      { path: 'upload', component: UploadView,  props: true,    name: 'ChallengeUpload'   },
      { path: 'vote',   component: VoteView,    props: true,    name: 'ChallengeVote', meta: { compactHero: true } },
    ],
  },
  { path: '/profile', component: ProfileView, name: 'Profile' },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
