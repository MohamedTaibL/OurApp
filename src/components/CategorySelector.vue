// made this a component because it has a lot of details
<template>
  <div class="p-4 rounded shadow bg-white space-y-4">
    <!-- CATEGORY SELECTION -->
    <div>
      <label class="font-semibold">Select Categories</label>
      <div class="p-2 max-h-48 overflow-y-auto">
        <div
          v-for="cat in categories"
          :key="cat.name"
          class="items-center flex flex-space-x-2 rounded border"
        >
          <div class="items-center flex space-x-2">
          <input
            type="checkbox"
            :value="cat.name"
            v-model="selectedCategories"
            @change="updateSubcategories"
          />
          <span>{{ cat.name }}</span>
        </div>
          <!-- ADD SUBCATEGORY -->
          <div class="flex space-x-2 max-h-48" v-if="selectedCategories.includes(cat.name)">
            <br>
            <input
              v-model="subcategoryInputs[cat.name]"
              placeholder="New subcategory"
              class="border p-1 rounded"
              @keyup.enter="addNewSubcategory(cat)"
            />

            <button
              @click="addNewSubcategory(cat)"
              class="bg-blue-500 text-white px-2 rounded"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ADD CATEGORY -->
    <div class="flex space-x-2 max-h-48">
      <input
        v-model="newCategory"
        placeholder="New category"
        class="border p-1 rounded flex-1"
        @keyup.enter="addNewCategory"
      />
      <button
        @click="addNewCategory"
        class="bg-blue-500 text-white px-2 rounded"
      >
        Add
      </button>
    </div>

    <!-- SUBCATEGORY SELECTION -->
    <div>
      <label class="font-semibold" v-if="selectedCategories.length || availableSubcategories.length">Select Subcategories</label>
      <div class="border rounded p-2 max-h-48 overflow-y-auto" v-if="availableSubcategories.length">
        <div
          v-for="sub in availableSubcategories"
          :key="sub"
          class="flex items-center space-x-2"
        >
          <input type="checkbox" :value="sub" v-model="selectedSubcategories" />
          <span>{{ sub }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { db } from "@/Firebase/Config";

const emit = defineEmits(["update"]);

const categories = ref([]);
const selectedCategories = ref([]);
const selectedSubcategories = ref([]);
const availableSubcategories = ref([]);

const newCategory = ref("");
const subcategoryInputs = ref({}); // Store subcategory inputs for each category

onMounted(async () => {
  await fetchCategories();
});

watch([selectedCategories, selectedSubcategories], () => {
  emit("update", {
    categories: selectedCategories.value,
    subcategories: selectedSubcategories.value
  });
});

async function fetchCategories() {
  const querySnapshot = await db.collection("Categories").get();
  categories.value = querySnapshot.docs.map((doc) => ({
    name: doc.id,
    subcategories: doc.data().subcategories || [],
  }));
}

function updateSubcategories() {
  const allSubs = new Set();
  selectedCategories.value.forEach((catName) => {
    const cat = categories.value.find((c) => c.name === catName);
    cat?.subcategories?.forEach((sub) => allSubs.add(sub));
  });
  availableSubcategories.value = Array.from(allSubs);
}

async function addNewCategory() {
  const name = newCategory.value.trim();
  if (!name || categories.value.find((c) => c.name === name)) return;

  await db.collection("Categories").doc(name).set({
    subcategories: [],
  });
  categories.value.push({ name, subcategories: [] });
  selectedCategories.value.push(name);
  newCategory.value = "";
  updateSubcategories();
}
async function addNewSubcategory(category) {
  const catName = category.name;
  const sub = (subcategoryInputs.value[catName] || "").trim();

  if (!sub) return;

  const cat = categories.value.find((c) => c.name === catName);
  if (!cat) return;
  if (cat.subcategories.includes(sub)) return;
  if (availableSubcategories.value.includes(sub)) return;

  await db.collection("Categories").doc(catName).update({
    subcategories: [...cat.subcategories, sub],
  });

  cat.subcategories.push(sub); // Update local cache
  selectedSubcategories.value.push(sub);
  availableSubcategories.value.push(sub);
  subcategoryInputs.value[catName] = ""; // Clear input
}
</script>

<style scoped>

/* styles.css */
.p-4 {
  padding: 1rem;
}

.rounded {
  border-radius: 0.375rem;
}

.shadow {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
}

.bg-white {
  background-color: white;
}

.space-y-4 {
  margin-bottom: 1rem;
}

.font-semibold {
  font-weight: 600;
}

.border {
  border: 1px solid #ccc;
}

.p-2 {
  padding: 0.5rem;
}

.max-h-48 {
  max-height: 12rem;
}

.overflow-y-auto {
  overflow-y: auto;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.space-x-2 {
  margin-right: 0.5rem;
}

.text-white {
  color: white;
}

.bg-blue-500 {
  background-color: #3b82f6;
}

.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.rounded {
  border-radius: 0.375rem;
}

.flex-1 {
  flex: 1;
}

.flex-space-x-2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

input{
  height: 30px;
}
</style>