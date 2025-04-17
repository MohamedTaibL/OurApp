this card will push a query in the router to make it simpler to filter the discussions

this is a singular card, it has :
prop : Category
emit : filter

<template>
    <div class="CategoryCards">
        <div class="card" @click="toggleClick" :class="set ? 'chosen' : ''">
            <h2>{{ Category }}</h2>
        </div>
    </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from "vue";

const props = defineProps({
  Category: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["filter"]);
const set = ref(false);

const toggleClick = () => {
  set.value = !set.value;
  if(set.value) {
    emit("filter", true);
  } else {
    emit("filter", false);
  }
};
</script>
<style scoped>
.CategoryCards {
  flex: 0 0 auto;
}

/* Card Base: Small and Clickable */
.card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  width: 100px;
  height: 40px; /* Much smaller height */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  padding: 0.25rem 0.5rem;
}

/* Hover/Active State */
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #eef7ff;
}

/* Text Styling: Smaller Font */
.card h2 {
  font-size: 0.75rem;
  font-weight: 500;
  color: #333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chosen {
  background-color: #007bff;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
