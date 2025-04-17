<template>
  <div class="FilterBar">
    <div class="search-bar">
      <input
        type="text"
        placeholder="Search for ..."
        @keydown="searchBy({ search: $event.target.value })"
        @keyup="searchBy({ search: $event.target.value })"
        @keypress="searchBy({ search: $event.target.value })"
        v-model="search_term"
      />
    </div>
    <div class="select-focus">
      <input
        type="checkbox"
        name="focus"
        value="title"
        @change="toggleTitle"
        checked
      />
      Title
      <input
        type="checkbox"
        name="focus"
        value="content"
        @change="toggleContent"
        checked
      />
      Content
    </div>
    <!-- Date Range -->
    <div class="date-range">
      <label for="startDate">Start Date:</label>
      <input
        type="date"
        @change="searchBy({ startDate: $event.target.value })"
      />
      <label for="endDate">End Date:</label>
      <input 
        type="date"
        @change="searchBy({ endDate: $event.target.value })"
      />
    </div>
    <div class="user-selector">
      <!-- first a search bar to show the users, then a list of users with their icons and names -->
      <input
        type="text"
        placeholder="Search for users..."
        v-model="userfilter"
      />
      <UserSelector @select="searchBy({ userId: $event })" :filter="userfilter" />
    </div>
  </div>
</template>

<script setup>
import UserSelector from "@/components/UserSelector.vue";
import { defineEmits } from "vue";
import { ref } from "vue";

const emit = defineEmits(["search"]);

// the search by function will take care of creating the search objectand emiting every time
const userfilter = ref("");
const title = ref(true);
const content = ref(true);
const search = ref({}); // object with the filtering params
const search_term = ref("");

const toggleTitle = () => {
  title.value = !title.value;
  searchBy();
};

const toggleContent = () => {
  content.value = !content.value;
  searchBy();
};

const searchBy = (searchParams) => {
  if (searchParams == undefined) {
    if(!title.value) {
      delete search.value.title;
    }
    else{
      search.value.title = search_term.value;
    }
    if(!content.value) {
      delete search.value.content;
    }
    else{
      search.value.content = search_term.value;
    }
  }
  else {
    if (searchParams.search) {
    if (title.value) {
      search.value.title = searchParams.search;
    }
    else{
      delete search.value.title;
    }
    if (content.value) {
      search.value.content = searchParams.search;
    }
    else{
      delete search.value.content;
    }
    }
    if (searchParams.startDate) {
      search.value.startDate = searchParams.startDate;
    }
    if (searchParams.endDate) {
      search.value.endDate = searchParams.endDate;
    }
    if (searchParams.userId) {
      search.value.userId = searchParams.userId;
    }
    else{
      delete search.value.userId;
    }
  }
  emit("search", search.value);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

.FilterBar {
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-start;
  background-color: #fff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Common input style */
.FilterBar input[type="text"],
.FilterBar input[type="date"] {
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: border 0.2s ease;
  width: 100%;
  max-width: 200px;
}

.FilterBar input[type="text"]:focus,
.FilterBar input[type="date"]:focus {
  border-color: #007bff;
}

/* Search Bar */
.search-bar {
  flex: 1 1 200px;
}

/* Select Focus Radios */
.select-focus {
  flex: 1 1 150px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  white-space: nowrap;
}

.select-focus input[type="radio"] {
  margin-right: 0.3rem;
}

/* Date Range */
.date-range {
  flex: 1 1 250px;
  display: flex;
  gap: 0.5rem;
}

/* User Selector Area */
.user-selector {
  flex: 1 1 250px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
