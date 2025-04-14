<template>
    <div class="reply-card">
      <!-- Reply Header -->
      <div class="reply-header">
        <img :src="props.reply.userIcon" alt="User Image" class="user-image" />
        <div class="user-info">
          <h3 class="user-name">{{ props.reply.Name }}</h3>
          <p class="user-full-name">@{{ props.reply.userName }}</p>
          <p class="reply-date">{{ formattedDate }}</p>
        </div>
      </div>
  
      <!-- Reply Content -->
      <p class="reply-content">{{ props.reply.content }}</p>
  
      <!-- Reply Footer -->
    </div>
  </template>
  
  <script setup>
  import { defineProps, computed } from 'vue';
  
  // Define props
  const props = defineProps({
    reply: {
      type: Object,
      required: true,
    },
  });
  
  // Format the date
  const formattedDate = computed(() => {
    let date;
    if (props.reply.date && props.reply.date.toDate) {
      // If the date is a Firestore Timestamp, convert it to a Date object
      date = props.reply.date.toDate();
    } else {
      // Otherwise, assume it's already a Date object or a valid date string
      date = new Date(props.reply.date);
    }
  
    // Format the date
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  });
  </script>
  
  <style scoped>
  .reply-card {
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 16px;
    margin: 12px 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .reply-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  .reply-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .user-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 12px;
    border: 2px solid #006a71;
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
  }
  
  .user-name {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin: 0;
  }
  
  .user-full-name {
    font-size: 14px;
    color: #555;
    margin: 0;
  }
  
  .reply-date {
    font-size: 12px;
    color: #777;
    margin: 0;
  }
  
  .reply-content {
    font-size: 14px;
    color: #000000;
    line-height: 1.6;
    margin: 12px 0;
    word-wrap: break-word;

  }
  
  .reply-footer {
    margin-top: 12px;
    font-size: 12px;
    color: #777;
  }
  
  .reply-meta {
    margin: 0;
  }
  </style>