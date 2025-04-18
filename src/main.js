import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { auth } from './Firebase/Config'

let app;

auth.onAuthStateChanged((state) => {
    if (!app) {
      app = createApp(App)
      app.use(router)
      app.mount('#app')
    }
    if(!state) {
      router.push({ name: 'sign' })
    }
  });

