<template>
  <div class="adminView">
    <div class="section card">
      <h2>Filter</h2>
      <div class="inputGroup">
        <label for="searchSignals">Content</label>
        <input
          id="searchSignals"
          v-model="searchSignals"
          placeholder="Search for signals by content..."
        />
      </div>
      <div class="inputGroup">
        <label for="searchUsers">User</label>
        <input
          id="searchUsers"
          v-model="searchUsers"
          placeholder="Search for accounts..."
        />
      </div>
    </div>

    <div class="section card">
      <h2>Reports</h2>
      <Signals :search="{ content: searchSignals, user: searchUsers }" />
    </div>

    <div class="section card">
      <h2>Accounts</h2>
      <div class="checkboxGroup">
        <label class="checkboxItem">
          <input type="checkbox" v-model="blocked" @click="showBlocked" />
          <span>Show blocked accounts</span>
        </label>
        <label class="checkboxItem">
          <input type="checkbox" v-model="nonBlocked" @click="showNonBlocked" />
          <span>Show non-blocked accounts</span>
        </label>
        <label class="checkboxItem">
          <input type="checkbox" v-model="admins" @click="showAdmins" />
          <span>Show admins</span>
        </label>
      </div>
      <Accounts :search="searchUsersObject"/>
    </div>
  </div>
</template>

<script setup>
import Signals from '@/components/Signals.vue';
import Accounts from '@/components/Accounts.vue';
import { ref, computed, watch } from 'vue';

const searchSignals = ref("");
const searchUsers = ref("");
const blocked = ref(false);
const nonBlocked = ref(false);
const admins = ref(false);

const showBlocked = () =>
{
  // can't have all three checked at once
  if (blocked.value ||  nonBlocked.value || admins.value) {
    nonBlocked.value = false;
    admins.value = false;
  }
  blocked.value = !blocked.value;
};

const showNonBlocked = () =>
{
  // can't have all three checked at once
  if (blocked.value || nonBlocked.value || admins.value) {
    blocked.value = false;
    admins.value = false;
  }
  nonBlocked.value = !nonBlocked.value;
};

const showAdmins = () =>
{
  // can't have all three checked at once
  if (admins.value || nonBlocked.value || blocked.value) {
    blocked.value = false;
    nonBlocked.value = false;
  }
  admins.value = !admins.value;
}

const searchUsersObject = computed(() => {
  return {
    name: searchUsers.value,
    blocked: blocked.value,
    nonBlocked:  nonBlocked.value,
    admins: admins.value,
  };
});

</script>

<style scoped>
.adminView {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  background-color: #f9fafb;
}

.section {
  display: flex;
  flex-direction: column;
}

.card {
  background-color: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

h2 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.inputGroup {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.inputGroup label {
  margin-bottom: 0.4rem;
  font-weight: 600;
  color: #374151;
}

.inputGroup input {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 1rem;
  transition: border 0.3s ease, box-shadow 0.3s ease;
}

.inputGroup input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
  outline: none;
}

.checkboxGroup {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.checkboxItem {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #374151;
  background-color: #f3f4f6;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: background-color 0.2s;
  cursor: pointer;
}

.checkboxItem input {
  accent-color: #2563eb;
}
</style>
