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
    path: '/category',
    name: 'category',
    component: () => import(/* webpackChunkName: "category" */ '../views/CategoryView.vue')
  },
  {
    // Page de discussion
    path: '/discussion/:id',
    name: 'discussion',
    component: () => import(/* webpackChunkName: "discussion" */ '../views/DiscussionView.vue'),
    props: true // Pass route params as props to the component
  },
  {
    // Page de création de discussion 
    path: '/create',
    name: 'create',
    component: () => import(/* webpackChunkName: "create" */ '../views/CreateView.vue')
  },
  {
    path : '/reply/:id',
    name : 'reply',
    component : () => import(/* webpackChunkName: "reply" */ '../views/ReplyView.vue'),

  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

let isLoggedIn = false; // Variable to track if the user is logged in


function isAuthenticated(to, next) {
  if (to.name !== 'sign' && !isLoggedIn) {
    // If the user is not logged in and trying to access a protected route, redirect to sign page
    next({ name: 'sign' });
  } else {
    next(); // Allow navigation to the requested route
  }
}

function isntAuthenticated(to, next) {
  if (to.name === 'sign' && isLoggedIn) {
    // If the user is logged in and trying to access the sign page, redirect to home page
    next({ name: 'home' });
  } else {
    next(); // Allow navigation to the requested route
  }
}

auth.onAuthStateChanged((user) => {
  if (user) {
    isLoggedIn = true; // User is logged in*
    // take the user to the home page if he logged in
    router.push({ name: 'home' });
  } else {
    isLoggedIn = false; // User is logged out
    // take the user to the sign page if he logged out
    router.push({ name: 'sign' });
  }
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'sign') {
    isAuthenticated(to, next); // Check if the user is authenticated for non-sign routes
  } else {
    isntAuthenticated(to, next); // Check if the user is authenticated for sign route
  }
});



export default router
