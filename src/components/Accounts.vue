<template>
  <div class="accounts-container">
    <div v-if="filteredUsers.length" class="account-list">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="account-card"
      >
        <img :src="user.imageURL" alt="User Icon" />
        <div class="account-info">
          <h3>{{ user.name }}</h3>
          <p>{{ user.email }}</p>
        </div>
        <button
          class="block-btn"
          :class="{ blocked: user.blocked }"
          @click="toggleBlock(user)"
        >
          {{ user.blocked ? 'Unblock' : 'Block' }}
        </button>
        <button
          class="admin-btn"
          :class="{ admin: user.isAdmin }"
          @click="setAdmin(user)"
        >
          {{ user.isAdmin ? 'unset admin' : 'set admin' }}
        </button>
      </div>
    </div>
    <p v-else class="no-users">No users found :(</p>
  </div>
</template>

<script setup>
/*
the search object is of this form:
  name: searchUsers.value,
  blocked: showBlocked.value,
  nonBlocked: showNonBlocked.value,
  admins: showAdmins.value
*/


import { ref, computed, defineProps } from 'vue';
import { db } from '@/Firebase/Config.js';

const props = defineProps({
  search: {
    type: String,
    required: false,
    default: {
      name: '',
      blocked: true,
      nonBlocked: true,
      admins: true
    }
  }
});

const users = ref([]);

const fetchUsers = async () => {
  const snapshot = await db.collection('users').get();
  users.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const toggleBlock = async (user) => {
  if (user.isAdmin) {
    alert("You can't block or unblock an admin.");
    return;
  }

  const updatedStatus = !user.blocked;
  await db.collection('users').doc(user.id).update({ blocked: updatedStatus });
  user.blocked = updatedStatus;
};

const setAdmin = async (user) => {
  // in case a problem arises it can still be done manually using the db

  const updatedStatus = !user.isAdmin;
  await db.collection('users').doc(user.id).update({ isAdmin: updatedStatus });
  user.isAdmin = updatedStatus;
}

const filteredUsers = computed(() => {

  if (!props.search) return users.value;

  return users.value.filter((user) =>
    user.name.toLowerCase().includes(props.search.name.toLowerCase()) &&
    (props.search.blocked ? user.blocked : true) &&
    (props.search.nonBlocked ? !user.blocked : true) &&
    (props.search.admins ? user.isAdmin : true)
  );

});

fetchUsers();
</script>

<style scoped>
.accounts-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: 'Poppins', sans-serif;
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.account-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.account-card img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.account-info {
  flex: 1;
  margin-left: 1rem;
}

.account-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.account-info p {
  margin: 0;
  font-size: 0.85rem;
  color: #777;
}

.block-btn {
  background-color: #ff4d4f;
  color: white;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 0.85rem;
}

.block-btn.blocked {
  background-color: #4caf50;
}

.block-btn:hover {
  opacity: 0.9;
}

.admin-btn {
  background-color: #ff4d4f;
  color: white;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 0.85rem;
}

.admin-btn.admin {
  background-color: #4caf50;
}

.admin-btn:hover {
  opacity: 0.9;
}


.no-users {
  text-align: center;
  color: #888;
  font-style: italic;
}
</style>
