<template>
  <div class="discussions-container">
  <div class="discussion-creator" v-if="!auth.currentUser.isAnonymous && (!props.userId || props.userId == auth.currentUser.uid) && props.withCreate">
    <div class="user-info">
      <img v-if="userIcon" :src="userIcon" alt="User Icon" class="user-icon" />
    </div>
    <input v-model="discussionContent" placeholder="What's on your mind?" class="discussion-input" @click="router.push('/create')" />
  </div>
  <div class="discussions-list" v-if="discussions.length > 0">
    <DiscussionCard
      v-for="discussion in discussions"
      :key="discussion.id"
      :discussion="discussion"
    />
  </div>
  <div v-else class="no-discussions-message">
    <p>No discussions found :(.</p>
  </div>
  </div>
</template>

<script setup>
import { ref , onMounted, defineProps , watch} from 'vue';
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
  withCreate: {
    type: Boolean,
    required: false,
  },
  search: {
    type: Object,
    required: false,
    /*
    this will take the format :
    category: array,
    subcategory: array,
    title: string,
    content: string,
    startDate: date,
    endDate: date,
    userId: string
    */
  },
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

//
const fetchDiscussions = async () => {
  const discussionsRef = db.collection('discussions').orderBy('date', 'desc');
  const snapshot = await discussionsRef.get();
  let filtered = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // give it both the id and the data

if (props.userId) {
  filtered = filtered.filter(d => d.userId === props.userId);
}

if (props.saves) {
  const userDoc = await db.collection('users').doc(auth.currentUser.uid).get();
  const saved = userDoc.data().savedPosts || [];
  filtered = filtered.filter(d => saved.includes(d.id));
}

if (props.search) {
  /*
    this will take the format :
    category: array,
    subcategory: array,
    title: string,
    content: string,
    startDate: date,
    endDate: date,
    userId: string
  */
  const { category, subcategory, title, content, startDate, endDate, userId } = props.search;
  console.log('search', props.search);

  if (category?.length) {
    filtered = filtered.filter(d =>
      Array.isArray(d.category)
        ? d.category.every(cat => category.includes(cat))
        : category.includes(d.category)
    );
  }
  if (subcategory?.length) {
    filtered = filtered.filter(d =>
      Array.isArray(d.subcategory)
        ? d.subcategory.every(sub => subcategory.includes(sub))
        : subcategory.includes(d.subcategory)
    );
  }
  
  if (title && !content) {
    filtered = filtered.filter(d => d.title?.toLowerCase().includes(title.toLowerCase()));
  }
  if (content && !title) {
    filtered = filtered.filter(d => d.content?.toLowerCase().includes(content.toLowerCase()));
  }
  if (title && content) {
    filtered = filtered.filter(d => d.title?.toLowerCase().includes(title.toLowerCase()) || d.content?.toLowerCase().includes(content.toLowerCase()));
  }
  if (startDate) {
    filtered = filtered.filter(d => d.date?.toDate() >= new Date(startDate));
  }
  if (endDate) {
    filtered = filtered.filter(d => d.date?.toDate() <= new Date(endDate));
  }
  if (userId) {
    filtered = filtered.filter(d => d.userId === userId);
  }
}

discussions.value = filtered;

}

onMounted(() => {
  fetchDiscussions();
});

watch(() =>
  props,
  (newSearch) => {
    fetchDiscussions();
  },
  {deep: true}
);

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
  margin: auto auto 2rem auto;
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
