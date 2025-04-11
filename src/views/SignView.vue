<template>
    <div class="sign-view" v-if = "!login">
        <h1>Sign In</h1>
        <form @submit.prevent="createUser">
        <input type="email" placeholder="Email" v-model="email" required />
        <input type="password" placeholder="Password" v-model="password" required />
        <button type="submit">Sign In</button>
        </form>

        <button @click = "printLogin">You have an account? Login!</button>
    </div>

    <div class = "login-view" v-else>
        <input type="email" placeholder="Email" v-model="email" required />
        <input type="password" placeholder="Password" v-model="password" required />
        <button @click="createUser">Login</button>
    </div>
</template>



<script setup>

import { onMounted } from 'vue'
import { ref } from 'vue'
import { auth } from '@/Firebase/Config'
import { useRouter } from 'vue-router'
const router = useRouter()
// import { db } from '@/Firebase/Config'
const login = ref(false) 
const email = ref("")
const password = ref("")
async function createUser(){
    try{
        await auth.createUserWithEmailAndPassword(email.value, password.value)
        console.log("User created successfully")
        router.push('/')
    }
    catch(error){
        console.error("Error creating user:", error)
    }
    finally{
        email.value = ''
        password.value = ''
    }

}

onMounted(() => {
    login.value = false;
})

function printLogin(){
    login.value = true
}

</script>