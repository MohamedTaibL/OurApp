<template>
    <!-- disconnect button -->
    <button @click="disconnect()">Disconnect</button>
</template>
<script setup>
import { auth } from '@/Firebase/Config'
import { useRouter } from 'vue-router'

const router = useRouter()

const disconnect = () => {
    auth.signOut()
        .then(() => {
            console.log('User signed out successfully.')
            router.push('/sign')
        })
        .catch((error) => {
            console.error('Error signing out: ', error)
        })
}

</script>
