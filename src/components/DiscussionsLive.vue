<template>
  <div class="discussions-container">
  <div class="discussion-creator" v-if="!auth.currentUser.isAnonymous && (!props.userId || props.userId == auth.currentUser.uid) && props.withCreate">
    <div class="user-info">
      <img v-if="userIcon" :src="userIcon" alt="User Icon" class="user-icon" />
    </div>
    <input v-model="discussionContent" placeholder="What's on your mind?" class="discussion-input" @click="router.push('/create')" />
  </div>
  <div class="discussions-list">
    <DiscussionCard
      v-for="discussion in discussions"
      :key="discussion.id"
      :discussion="discussion"
    />
  </div>
  </div>
</template>

<script setup>
import { ref , onMounted, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { db, auth } from '@/Firebase/Config';
import DiscussionCard from '@/components/DiscussionCard.vue';

const router = useRouter();
const discussionContent = ref('');
const discussions = ref([]);
const userIcon = ref('https://cdn-icons-png.flaticon.com/512/149/149071.png');

const props = defineProps({
  userId: {
    type: String,
    required: false,
  },
  saves: {
    type: Boolean,
    required: false,
  },
  Category: {
    type: Array,
    required: false,
  },
  withCreate: {
    type: Boolean,
    required: false,
  }
});

// Fetch user data
auth.onAuthStateChanged(async (user) => {
  if (user && !user.isAnonymous) {
    const userDoc = await db.collection('users').doc(user.uid).get();
    if (userDoc.exists) {
      userIcon.value = userDoc.data().imageURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    }
  }
});

const fetchDiscussions = async () => {
  const discussionsRef = db.collection('discussions').orderBy('date', 'desc');
  const snapshot = await discussionsRef.get();
  // in case the userId is passed we want to filter the discussions by the userId
  discussions.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // give it both the id and the data
  if (props.userId) {
    discussions.value = discussions.value.filter((discussion) => discussion.userId === props.userId);
  }
  if (props.saves) {
    // get the saves from the db using the userId
    const userDoc = await db.collection('users').doc(auth.currentUser.uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      if (userData.savedPosts) {
        discussions.value = discussions.value.filter((discussion) => userData.savedPosts.includes(discussion.id));
      }
    }
  }
  if (props.Category) {
    discussions.value = discussions.value.filter((discussion) => discussion.category.some(cat => props.Category.includes(cat)));
  }
  // to add the rest of the filtering later
};

onMounted(() => {
  fetchDiscussions();
});

</script>

<style scoped>
/* Import Google Font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
.discussion-container{
  height: 100%;
}
/* General container styling */
.discussion-creator {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(242, 239, 231, 0.69); /* Matches the SignView background */
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  width: 800px;
  margin: 2rem auto;
  font-family: 'Poppins', sans-serif;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.discussion-input {
  width: 100%;
  padding: 0.8rem 1.2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  resize: none;
  transition: background 0.3s ease;
  font-family: 'Poppins', sans-serif;
}

.discussions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
