<template>
    <div class="UserSelector" v-if="!unDefined">
        <div class="signal" v-if="!deleted">
            <div class="user-icon" @click.stop="goToUser">
                <img :src="userIcon" alt="User Icon" />
                <div style="display:flex; flex-direction: column; align-items: flex-start; margin-left:0.4rem; gap:0rem;">
                <p class="name" style="">{{ Name }}</p>
                <p class="username">@{{ userName }}</p>
                </div>
                
            </div>

            <p>{{ signal.reason }}</p>
            <button @click="checkPost">Check Post</button>
            <button @click="deletePost">Delete</button>
        </div>
    </div>
</template>

<script setup>

import { ref, defineProps, defineEmits, onMounted} from 'vue';
import { useRouter } from 'vue-router';
import { db } from '@/Firebase/Config'; // Import your Firebase configuration

//         <Signal v-for="signal in signals" :key="signal.id" :signal="signal" @deleteSignal="deleteSignal(signal.id)"/>
/* this is what a report looks like
{
  "postId": "abc123XYZ",              // ID of the reported discussion post
  "reason": "This post contains spam", // User's input describing the reason
  "reporterId": "user456DEF",          // UID of the user reporting, or "anonymous"
  "timestamp": "2025-04-17T15:32:00.000Z" // ISO date when the report was created
}
*/

const router = useRouter();
const props = defineProps({
    signal: {
        type: Object,
        required: true,
    },
});
const emit = defineEmits(["deleteSignal"]);

const userName = ref("");
const Name = ref("");
const userIcon = ref("https://cdn-icons-png.flaticon.com/512/149/149071.png"); // Default icon if no imageURL
const deleted = ref(false); // Tracks whether the signal is deleted
const unDefined = ref(false);

const goToUser = () => {
  router.push({ name: "user", params: { id: props.signal.reporterId } });
};

const getTheUserIconandName = async () => {
    if(!props.signal.reporterId){
        unDefined.value = true;
        return
    }
    const doc = await db.collection("users").doc(props.signal.reporterId).get();
    if (doc.exists) {
        const userData = doc.data();
        userIcon.value =
        userData.imageURL ||
        "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // Default icon if no imageURL
        userName.value = userData.username || ""; // Default name if no name
        Name.value = userData.name || ""; // Default name if no name
    }
};

const deletePost = () => {
    db.collection("signals").doc(props.signal.id).delete();
    emit("deleteSignal", props.signal.id);
}

const checkPost = () => {
  router.push({ name: 'discussion', params: { id: props.signal.postId } });
};

onMounted(()=>
{
    getTheUserIconandName();
})

</script>

<style scoped>

.UserSelector {
    width: fit-content;
    height: fit-content;
}

.user-icon {
  display: flex;
  align-items: center; /* Align items vertically */
  gap: 0.5rem; /* Space between the image and text */
}

.user-icon img {
  width: 40px; /* Slightly larger for better alignment */
  height: 40px;
  border-radius: 50%;
  border: 2px solid #006a71;
}

.user-icon div {
  display: flex;
  flex-direction: column; /* Stack name and username vertically */
  justify-content: center; /* Center text vertically relative to the image */
}

.user-icon .name {
  margin: 0;
  color: black;
  font-weight: 600;
  font-size: 1.1rem; /* Adjust font size for Name */
}

.user-icon .username {
  margin: 0;
  color: grey;
  font-size: 0.85rem; /* Smaller font size for username */
  font-weight: 400; /* Lighter font weight for username */
}

</style>