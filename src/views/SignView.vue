<template>
    <div class="sign-container">
      <div class="sign-view" v-if="!login">
        <h1>Sign Up</h1>
        <form @submit.prevent="createUser" class="form">
          <input type="email" placeholder="Email" v-model="email" required />
          <input type="password" placeholder="Password" v-model="password" required />
          <input type="password" placeholder="Confirm Password" v-model="password" required />
          <input type="text" placeholder="Username" v-model="username" required />
          <input type="text" placeholder="Name" v-model="Name" required />
          <button type="submit" class="btn">Sign Up</button>
        </form>
        <button @click="printLogin" class="switch-btn">Already have an account? Login!</button>
      </div>
  
      <div class="login-view" v-else>
        <h1>Login</h1>
        <form @submit.prevent="createUser" class="form">
          <input type="email" placeholder="Email" v-model="email" required />
          <input type="password" placeholder="Password" v-model="password" required />
          <button type="submit" class="btn">Login</button>
        </form>
        <button @click="printLogin" class="switch-btn">Don't have an account? Sign Up!</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { auth } from '@/Firebase/Config'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const login = ref(false)
  const email = ref("")
  const password = ref("")
  const username = ref("")
  const Name = ref("")
  
  async function createUser() {
    try {
      await auth.createUserWithEmailAndPassword(email.value, password.value)
      console.log("User created successfully")
      router.push('/')
    } catch (error) {
      console.error("Error creating user:", error)
    } finally {
      email.value = ''
      password.value = ''
    }
  }
  
  onMounted(() => {
    login.value = false
  })
  
  function printLogin() {
    login.value = !login.value
  }
  </script>
  
  <style scoped>
/* Import Google Font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

/* General container styling */
.sign-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #24cb11, #d6e819);
  background-size: 400% 400%;
  animation: gradientAnimation 10s ease infinite;
  font-family: 'Poppins', sans-serif;
}

/* Gradient animation */
@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Form container */
.sign-view, .login-view {
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem; /* Adds spacing between inputs */
}

/* Form styling */
.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form input {
  width: 100%;
  max-width: 350px;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
}

.form input:focus {
  outline: none;
  border-color: #6a11cb;
  box-shadow: 0 0 5px rgba(106, 17, 203, 0.5);
}

/* Button styling */
.btn {
  width: 100%;
  max-width: 350px;
  padding: 0.8rem;
  margin-top: 1rem;
  background: #6a11cb;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.btn:hover {
  background: #2575fc;
  transform: scale(1.05);
}

.switch-btn {
  margin-top: 1rem;
  background: none;
  border: none;
  color: #6a11cb;
  font-size: 0.9rem;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  text-decoration: underline;
}

.switch-btn:hover {
  color: #2575fc;
}

/* Headings */
h1 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.8rem;
  font-weight: 600;
}
</style>