<template>
  <div class="FilterBar">
    <div class="search-bar">
      <input
        type="text"
        placeholder="Search by title..."
        @input="searchBy({ search: $event.target.value })"
      />
    </div>
    <div class="select-focus">
      <input
        type="radio"
        name="focus"
        value="title"
        @change="toggleTitle"
        checked
      />
      Title
      <input
        type="radio"
        name="focus"
        value="content"
        @change="toggleContent"
        checked
      />
      Content
    </div>
    <div class="date-range">
      <input
        type="date"
        @change="searchBy({ startDate: $event.target.value })"
      />
      <input type="date" @change="searchBy({ endDate: $event.target.value })" />
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

const toggleTitle = () => {
  title.value = !title.value;
  emit("search", { title: title.value });
};

const toggleContent = () => {
  content.value = !content.value;
  searchBy("content", content.value);
};

const searchBy = (searchParams) => {
  if (searchParams.search) {
    if (title.value) {
      search.value.title = searchParams.search;
    }
    if (content.value) {
      search.value.content = searchParams.search;
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
  emit("search", search.value);
};
</script>

till i work out the css
<style scoped>

</style>