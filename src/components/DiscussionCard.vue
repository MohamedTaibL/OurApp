<template>
</template>
<script setup>
// getting the discussion passed from the parent component
import { defineProps } from 'vue'

defineProps({
  discussion: {
    type: Object,
    required: true,
  },
})
</script>