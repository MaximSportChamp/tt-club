import { createRouter, createWebHistory } from 'vue-router'

import HomeView            from '@/views/HomeView.vue'
import VoteListView        from '@/views/VoteListView.vue'
import ProfileView         from '@/views/ProfileView.vue'
import ChallengeDetail     from '@/views/ChallengeDetail.vue'
import UploadView          from '@/views/UploadView.vue'
import VoteView            from '@/views/VoteView.vue'
import ChallengeOverview   from '@/views/ChallengeOverview.vue' // ⬅️ новый пустой child
import NotFoundView        from '@/views/NotFoundView.vue'
import { useUserStore }    from '@/stores/user'


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
      { path: 'upload', component: UploadView,  props: true,    name: 'ChallengeUpload', meta: { requiresAuth: true }   },
      { path: 'vote',   component: VoteView,    props: true,    name: 'ChallengeVote', meta: { compactHero: true } },
    ],
  },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView },
  { path: '/profile', component: ProfileView, name: 'Profile', meta: { requiresAuth: true } },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    alert('Пожалуйста, войдите, чтобы продолжить')
    next({ name: 'Home' })
  } else {
    next()
  }
})
