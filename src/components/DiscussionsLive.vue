<template>
    <div class="discussion-maker">
    </div>
    <div class="discussions-container">
        <div class="discussions-list">
            <DiscussionCard v-for="discussion in discussions" :key="discussion.id" :discussion="discussion" />
        </div>
    </div>
</template>
<script setup>
import { db, auth } from '@/Firebase/Config'
import { ref, onMounted } from 'vue'
import DiscussionCard from '@/components/DiscussionCard.vue'

// getting the discussions from the db
const discussions = ref([]);
const icon = ref(null);

const getDiscussions = async () => {
  const querySnapshot = await db.collection('discussions').get()
  discussions.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// get the user icon and name from the db using his uid
const getUserIcon = async (uid) => {
    const userDoc = await db.collection('users').doc(uid).get()
    if (userDoc.exists) {
        return userDoc.data()
    } else {
        console.log("No such document!")
        return null
    }
}

onMounted(() => {
    getDiscussions().then(() => {
        console.log(discussions.value) // getting the discussions from the db
    }).catch((error) => {
        console.error("Error getting discussions: ", error)
    })
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            icon = await getUserIcon(user.uid) // getting the user icon from the db using his uid
        } else {
            console.log("No user is signed in.")
        }
    })
})

</script>