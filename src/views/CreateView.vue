<template>
  <div class="create-view">
    <div class="create-container">
      <h1>Create a New Discussion</h1>
      <form @submit.prevent="createDiscussion" class="form">
        <input
          type="text"
          v-model="title"
          placeholder="Discussion Title"
          required
        />
        <textarea
          v-model="content"
          placeholder="Discussion Content"
          rows="5"
          required
        ></textarea>

        <!-- Category Selector Component -->
        <CategorySelector @update="onCategorySelect"/>

        <button type="submit" class="btn">Create Discussion</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth, db } from '@/Firebase/Config';
import CategorySelector from '@/components/CategorySelector.vue'; // Import the CategorySelector component
import { useRouter } from 'vue-router';

const router = useRouter();

const title = ref('');
const content = ref('');
const selectedCategory = ref([]);
const selectedSubcategory = ref([]);

async function createDiscussion() {
  const user = auth.currentUser;
  if (!user) {
    alert('You must be logged in.');
    return;
  }

  // no category or subcategory selected is ok

  console.log('Selected Category:', selectedCategory.value);
  console.log('Selected Subcategory:', selectedSubcategory.value);
  const discussionData = {
    userId: user.uid,
    title: title.value.trim(),
    category: selectedCategory.value,
    subcategory: selectedSubcategory.value,
    content: content.value.trim(),
    date: new Date(),
    comments: [], // an array to the comments ids
    likes: [], // an array to the users who liked the discussion
    signals: [], // an array of objects containing the userId and the type of signal
  };

  try {
    await db.collection('discussions').add(discussionData);

    alert('Discussion created!');
    router.push('/'); // Redirect to the home page or discussions page
  } catch (err) {
    console.error('Error:', err);
    alert('Failed to create discussion.');
  }
}

function onCategorySelect({ categories, subcategories }) {
  selectedCategory.value = categories;
  selectedSubcategory.value = subcategories;
}

</script>

<style scoped>
/* Import Google Font */
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap");

.create-view {
  background: linear-gradient(135deg, rgb(242, 239, 231), #48a6a7); /* Gradient background */
  animation: gradientAnimation 10s ease infinite;
  width: 100%;
  min-height: Calc(100vh - 100px);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* General container styling */
.create-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #F2EFE7; /* Gradient background for the container */
  background-size: 400% 400%;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  height: auto;
  max-width: 600px;
  margin: 2rem auto;
  font-family: "Poppins", sans-serif;
}

h1 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
}

.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form input,
.form textarea {
  width: calc(100% - 1.6rem); /* Subtract 0.8rem from the width */
  border: 1px solid #ccc;
  padding: 0.8rem;
  border-radius: 5px;
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
}

.form select{
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
}

.form textarea {
  resize: none;
}

.form input:focus,
.form select:focus,
.form textarea:focus {
  outline: none;
  border-color: #006a71;
  box-shadow: 0 0 5px rgba(0, 106, 113, 0.5);
}

.btn {
  padding: 0.8rem;
  background: linear-gradient(135deg, #85DE7C, #48a6a7); /* Gradient background for the button */
  animation: gradientAnimation 10s ease infinite;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.btn:hover {
  transform: scale(1.05);
}

/* Gradient animation */
@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
