this card will push a query in the router to make it simpler to filter the discussions

this is a singular card, it has :
prop : Category
emit : filter

<template>
    <div class="CategoryCards">
        <div class="card" @click="emit('filter', Category)">
            <h2>{{ Category }}</h2>
        </div>
    </div>
</template>
<script setup>
import { defineEmits, defineProps } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  Category: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["filter"]);
const router = useRouter();
</script>

will take care of the css later