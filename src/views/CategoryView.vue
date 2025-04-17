<template>
  <div class="Category-view">
    <div class="view-header">
      <CategoryCards
        v-for="Category in Categories"
        :Category="Category"
        @filter="filterByCategory"
        class="Cards"
      />
      <CategoryCards
        v-for="SubCategory in SubCategories"
        :Category="SubCategory"
        :isSubCategory="true"
        @filter="filterBySubCategory"
        class="Cards"
      />
    </div>
    <div class="view-content">
      <FilterBar class="to-the-right" @search="searchBy" />
      <DiscussionsLive :search="search" />
    </div>
  </div>
</template>
<script setup>
import CategoryCards from "@/components/CategoryCards.vue";
import FilterBar from "@/components/FilterBar.vue";
import DiscussionsLive from "@/components/DiscussionsLive.vue";
import { useRoute } from "vue-router";
import { db } from "@/Firebase/Config.js";
import { ref , computed} from "vue";

const route = useRoute();

const Categories = ref([]); // this is just a list of categorynames, (that's the same as their ids in the collection)
const SubCategories = computed(() => {
  return Categories.value.map((category) => {
    // get the values from the db.collection("categories") and map them to the subcategories
    return db.collection("categories").doc(category).get().then((doc) => {
      return doc.subcategories
    });
  });
}); // this is just a list of subcategorynames, (that's the same as their ids in the collection)
const search = ref({}); // object with the filtering params

/*
the search object will take the format :
    {
    category: array, --> taken care of by the CategoryCards
    subcategory: array, --> taken care of by the CategoryCards
    title: string, 
    content: string, 
    startDate: date,
    endDate: date,
    userId: string
    }
*/

const searchBy = (searchParams) => {
  search.value = searchParams;
};

const filterByCategory = (category) => {
  if (search.value.category) {
    search.value.category.push(category);
  } else {
    search.value.category = [category];
  }
};

const filterBySubCategory = (subcategory) => {
  if (search.value.subcategory) {
    search.value.subcategory.push(subcategory);
  } else {
    search.value.subcategory = [subcategory];
  }
};

</script>
<style scoped>
.Category-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.view-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 20%;
}
.Cards {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}
.view-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80%;
}

.to-the-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.to-the-right > * {
  margin-left: 20px;
}
</style>
