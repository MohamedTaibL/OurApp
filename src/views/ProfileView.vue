<template>
    <div class="profile-view">
        <h1>User Profile</h1>
        <div class="profile-info">
        <img :src="userIcon" alt="User Icon" class="user-icon" />
        <h2>{{ userName }}</h2>
        </div>
        <!-- disconnect button -->
        <button @click="auth.signOut()">Disconnect</button>
        <div class="user-discussions">
        <h3>Your Discussions</h3>
        <ul>
            <li v-for="discussion in userDiscussions" :key="discussion.id">
            {{ discussion.title }}
            </li>
        </ul>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { auth, db } from '@/Firebase/Config'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'

// in case the route is /user, make it /user/:id <- id of the user
const route = useRoute()
const router = useRouter()
const userId = route.params.id || auth.currentUser.uid // get the user id from the route or from the auth object
const userIcon = ref(null)
const userName = ref('')
const userDiscussions = ref([])
const getUserIcon = async (uid) => {
    const userDoc = await db.collection('users').doc(uid).get()
    if (userDoc.exists) {
        return userDoc.data().icon
    } else {
        console.log('No such document!')
        return null
    }
}
const getUserName = async (uid) => {
    const userDoc = await db.collection('users').doc(uid).get()
    if (userDoc.exists) {
        return userDoc.data().name
    } else {
        console.log('No such document!')
        return null
    }
}
const getUserDiscussions = async (uid) => {
    const querySnapshot = await db.collection('discussions').where('userId', '==', uid).get()
    userDiscussions.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }))
}

onMounted(() => {
    getUserIcon(userId)
        .then((icon) => {
            userIcon.value = icon // getting the user icon from the db using his uid
        })
        .catch((error) => {
            console.error('Error getting user icon: ', error)
        })
    getUserName(userId)
        .then((name) => {
            userName.value = name // getting the user name from the db using his uid
        })
        .catch((error) => {
            console.error('Error getting user name: ', error)
        })
    getUserDiscussions(userId)
        .then(() => {
            console.log(userDiscussions.value) // getting the user discussions from the db using his uid
        })
        .catch((error) => {
            console.error('Error getting user discussions: ', error)
        })
})

</script>
