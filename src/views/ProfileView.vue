<template>
    <!-- disconnect button -->
    <button @click="disconnect()">Disconnect</button>
</template>
<script setup>
import { auth } from '@/Firebase/Config'
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'

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

onMounted(() => {
    // if the route doesn't include the id
    // add it as a parameter to the route from auth.currentUser.uid
    if (!useRoute().params.id) {
        router.push({ name: 'user', params: { id: auth.currentUser.uid } })
    }
})

</script>
