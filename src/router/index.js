import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { auth } from '@/Firebase/Config'; // Import Firebase authentication

const routes = [
  { 
    // page d'accueil
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    // Page de connexion/inscription 
    path: '/sign',
    name: 'sign',
    component: () => import(/* webpackChunkName: "sign" */ '../views/SignView.vue')
  },
  {
    // Page de profil
    // if no id is provided, it will show the current user's profile by rerouting
    path: '/user/:id?',
    name: 'user',
    component: () => import(/* webpackChunkName: "profile" */ '../views/ProfileView.vue')
  },
  {
    // Page de catégorie (the id is optional)
    // if no id is provided, it will show all categories in a list like format
    path: '/category/:id?',
    name: 'category',
    component: () => import(/* webpackChunkName: "category" */ '../views/CategoryView.vue')
  },
  {
    // Page de discussion
    path: '/discussion/:id',
    name: 'discussion',
    component: () => import(/* webpackChunkName: "discussion" */ '../views/DiscussionView.vue')
  },
  {
    // Page de création de discussion 
    path: '/create',
    name: 'create',
    component: () => import(/* webpackChunkName: "create" */ '../views/CreateView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


router.beforeEach((to, from, next) => {
  const user = auth.currentUser;

  // Protect routes that should only be accessed by authenticated users
  if (to.path !== '/sign' && !user) {
    next('/sign');  // Redirect to sign-in page if not authenticated
  } else {
    next();  // Proceed to the requested route
  }

  // inCase the user is already logged in and tries to access the sign-in page
  if (to.path === '/sign' && user) {
    next('/user');  // Redirect to home page if already authenticated
  } else {
    next();  // Proceed to the requested route
  }

});

export default router
