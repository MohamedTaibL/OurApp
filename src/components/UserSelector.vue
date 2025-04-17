<template>
  <div class="UserSelector" v-if="!set">
    <div
      class="user-card"
      v-for="user in filteredUsers"
      :key="user.id"
      @click="toggleUser(user)"
    >
      <img :src="user.imageURL" alt="User Icon" />
      <span>{{ user.name }}</span>
    </div>
  </div>
  <div v-else class="user-card" @click="toggleUser(chosenUser)" style="cursor: pointer; border: 1px solid #007bff; background-color: #e9f2ff;"> 
    <img :src="chosenUser.imageURL" alt="User Icon" />
    <span>{{ chosenUser.name }}</span>
  </div>  
</template>

<script setup>
import { ref, defineEmits, defineProps, watch, computed } from "vue";
import { db } from "@/Firebase/Config.js";

const emit = defineEmits(["select"]);
const props = defineProps({
  filter: {
    type: String,
    required: false,
    default: "",
  },
});

const users = ref([]);
const set = ref(false);
const chosenUser = ref({});
/* the users data is done like this: 
{
    id: string, genrated by firebase,
    name: string, // the name of the user
    username: string, // the username of the user
    email: string, // the email of the user
    birthdate: date, // the birthdate of the user
    gender: string, // male or female only
    savedPosts: array, // the posts saved by the user
    imageURL: string, // the image URL of the user    
}
*/

// Fetch users once on mount
db.collection("users")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        users.value.push({ id: doc.id, ...doc.data() })
    });
  });

// Filtered users based on the filter prop
const filteredUsers = computed(() => {
  if (!props.filter) return users.value;
  return users.value.filter((user) =>
    user.name.toLowerCase().includes(props.filter.toLowerCase())
  );
});

const toggleUser = (user) => {
  if (!set.value) {
    set.value = true;
    chosenUser.value = user;
    emit("select", user.id);
  } else {
    set.value = false;
    chosenUser.value = {};
    emit("select", null);
  }
};

</script>

<style scoped>
.UserSelector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
}

/* User Card */
.user-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.6rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.user-card:hover {
  background-color: #e9f2ff;
}

.user-card img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.user-card span {
  font-size: 0.85rem;
  color: #333;
}
</style>
