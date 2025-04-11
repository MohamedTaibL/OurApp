<template>
    <div class="sign-view">
        <h1>Sign In</h1>
        <form @submit.prevent="createUser">
        <input type="email" placeholder="Email" v-model="email" required />
        <input type="password" placeholder="Password" v-model="password" required />
        <button type="submit">Sign In</button>
        </form>
    </div>
</template>



<script setup>
import { ref } from 'vue'
import { auth } from '@/Firebase/Config'
import { useRouter } from 'vue-router'
const router = useRouter()
// import { db } from '@/Firebase/Config' 
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

</script>