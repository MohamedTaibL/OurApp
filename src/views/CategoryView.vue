<template>
  <div class="Category-view">
    <div class="view-header">
      <div class="category-nav">
        <h3>Categories</h3>
        <button class="nav-arrow left-arrow" @click="scrollCategoriesLeft">
          &#8249;
        </button>
        <div class="flex-row">
          <CategoryCards
            v-for="Category in Categories"
            :Category="Category"
            @filter="filterByCategory($event, Category)"
            class="category-card"
          />
        </div>
        <button class="nav-arrow right-arrow" @click="scrollCategoriesRight">
          &#8250;
        </button>
      </div>
      <div class="sub-category-nav">
        <h3>Subcategories</h3>
        <button class="nav-arrow left-arrow" @click="scrollSubCategoriesLeft">
          &#8249;
        </button>
        <div class="flex-row">
          <CategoryCards
            v-for="SubCategory in SubCategories"
            :Category="SubCategory"
            :isSubCategory="true"
            @filter="filterBySubCategory($event, SubCategory)"
            class="sub-category-card"
          />
        </div>
        <button class="nav-arrow right-arrow" @click="scrollSubCategoriesRight">
          &#8250;
        </button>
      </div>
    </div>
    <div class="view-content">
      <div class="live-section">
        <DiscussionsLive :search="search" />
      </div>
      <div class="filter-section">
        <FilterBar @search="searchBy" />
      </div>
    </div>
  </div>
</template>

<script setup>
import CategoryCards from "@/components/CategoryCards.vue";
import FilterBar from "@/components/FilterBar.vue";
import DiscussionsLive from "@/components/DiscussionsLive.vue";
import { useRoute } from "vue-router";
import { db } from "@/Firebase/Config.js";
import { ref, watch, onMounted } from "vue";

const route = useRoute();

const Categories = ref([]);
const SubCategories = ref([]);
const search = ref({
  category: [],
  subcategory: [],
  title: "",
  content: "",
  startDate: null,
  endDate: null,
  userId: null,
});
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
const searchBy = (searchParams) => {
  // reset the title, content, startDate, endDate and userId to null if they are not set in the searchParams
  if (searchParams) {
    search.value.title = searchParams.title || "";
    search.value.content = searchParams.content || "";
    search.value.startDate = searchParams.startDate || null;
    search.value.endDate = searchParams.endDate || null;
    search.value.userId = searchParams.userId || null;
  } else {
    search.value.title = "";
    search.value.content = "";
    search.value.startDate = null;
    search.value.endDate = null;
    search.value.userId = null;
  }
};


const filterByCategory = (set ,category) => {
  // the child will emit the set boolean to the parent, and the parent will push the category to the search object
  if (set) {
    search.value.category.push(category);
  } else {
    const index = search.value.category.indexOf(category);
    if (index > -1) {
      search.value.category.splice(index, 1);
    }
  }
};

const filterBySubCategory = (set, subcategory) => {
  // the child will emit the set boolean to the parent, and the parent will push the subcategory to the search object
  if (set) {
    search.value.subcategory.push(subcategory);
  } else {
    const index = search.value.subcategory.indexOf(subcategory);
    if (index > -1) {
      search.value.subcategory.splice(index, 1);
    }
  }
};

const getCategories = () => {
  db.collection("Categories")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        Categories.value.push(doc.id);
        SubCategories.value.push(...doc.data().subcategories);
      });
    });
};

onMounted(() => {
  getCategories();
});

const scrollCategoriesLeft = () => {
  const container = document.querySelector(".view-header .flex-row");
  container.scrollLeft -= 200;
};

const scrollCategoriesRight = () => {
  const container = document.querySelector(".view-header .flex-row");
  container.scrollLeft += 200;
};

const scrollSubCategoriesLeft = () => {
  const container = document.querySelector(".sub-category-nav .flex-row");
  container.scrollLeft -= 200;
};

const scrollSubCategoriesRight = () => {
  const container = document.querySelector(".sub-category-nav .flex-row");
  container.scrollLeft += 200;
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap");

.Category-view {
  font-family: "Poppins", sans-serif;
  background-color: #f7f7f7;
  border-radius: 12px;
  padding-right: 4rem;
  padding-left: 4rem;
}

/* Headers Layout */
.view-header {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Shared Nav Styles */
.category-nav,
.sub-category-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  overflow: hidden;
  position: relative;
}

/* Arrows */
.nav-arrow {
  font-size: 1.8rem;
  background: none;
  border: none;
  color: #444;
  cursor: pointer;
  transition: color 0.2s ease;
}
.nav-arrow:hover {
  color: #007bff;
}

/* Horizontal Scroll Area */
.flex-row {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  scroll-behavior: smooth;
}
.flex-row::-webkit-scrollbar {
  display: none;
}

/* Headings */
.category-nav h3,
.sub-category-nav h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-right: 1rem;
  white-space: nowrap;
}

/* Main View Content */
.view-content {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

/* Live Discussions + Filter */
.live-section,
.filter-section {
  flex: 1 1 300px;
  background-color: #fff;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

</style>
