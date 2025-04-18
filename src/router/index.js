import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { auth, db } from '@/Firebase/Config'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/sign', name: 'sign', component: () => import('../views/SignView.vue') },
  { path: '/user/:id?', name: 'user', component: () => import('../views/ProfileView.vue') },
  { path: '/category', name: 'category', component: () => import('../views/CategoryView.vue') },
  { path: '/discussion/:id', name: 'discussion', component: () => import('../views/DiscussionView.vue'), props: true },
  { path: '/create', name: 'create', component: () => import('../views/CreateView.vue') },
  { path: '/reply/:id', name: 'reply', component: () => import('../views/ReplyView.vue') },
  { path: '/admin', name: 'admin', component: () => import('../views/AdminView.vue') },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Track user state
let isLoggedIn = false
let isAdmin = false
let isBlocked = false // 👈 Track blocked status

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.name !== 'sign') {
    if (!isLoggedIn) {
      next({ name: 'sign' })
    } else if (isBlocked && to.name !== 'sign') {
      alert("you are blocked, contact admins for more info")
    } else if (to.name === 'admin' && !isAdmin) {
      next({ name: 'home' })
      console.log('You are not an admin!')
    } else {
      next()
    }
  } else {
    if (isLoggedIn && !isBlocked) {
      next({ name: 'home' })
    } else {
      next()
    }
  }
})

// Auth listener
auth.onAuthStateChanged(async (user) => {
  if (user) {
    isLoggedIn = true
    const userId = user.uid
    const userDoc = await db.collection('users').doc(userId).get()
    if (userDoc.exists) {
      const userData = userDoc.data()
      isAdmin = userData.isAdmin || false
      isBlocked = userData.blocked || false // 👈 Load blocked status
    } else {
      isAdmin = false
      isBlocked = false
    }
  } else {
    isLoggedIn = false
    isAdmin = false
    isBlocked = false
  }
})

export default router
