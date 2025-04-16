<template>
    <div>
    <div v-if="!showReplyInput">
      <div class="reply-card">
        <!-- Reply Header -->
        <div class="reply-header">
          <img 
            :src="currentReply.userIcon" 
            alt="User Image" 
            class="user-image" 
          />
          <div class="user-info">
            <h3 class="user-name">{{ currentReply.userName }}</h3>
            <p class="user-full-name">{{ currentReply.Name }}</p>
            <p class="reply-date">{{ formattedDate }}</p>
          </div>
        </div>
    
        <!-- Reply Content -->
        <p class="reply-content">{{ currentReply.content }}</p>
    
        <!-- Reply Footer -->
        <div class="reply-footer">
          <button class="reply-button transparent-button" @click="showReplyInput = true">Reply</button>
        </div>
      </div>
    </div>
    <div v-else>
      <!-- Add your reply input logic here -->
      <textarea v-model="newContent" placeholder="Write your reply..." class="edit-textarea"></textarea>
      <div class="edit-actions">
        <button class="reply-button save-button" @click="submitReply">Post</button>
        <button class="reply-button cancel-button" @click="showReplyInput = false">Cancel</button>
      </div>
    </div>
    <Reply v-for="reply in Replies" :key="reply.id" :reply="reply"  />
</div>
  </template>




<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted , defineEmits} from 'vue';
import { db } from '@/Firebase/Config'; // Import your Firebase configuration
import { auth } from '@/Firebase/Config'; // Import your Firebase configuration
import Reply from '@/components/Reply.vue'; // Import your Reply component


const router = useRouter();
const route = useRoute();
const showReplyInput = ref(false);
const newContent = ref("")

const currentReply = ref({
    id: null,
    content: "",
    date: null,
    userId: null,
    discussionId: null,
    userIcon : null,
    responses : [],
    userName : null,
    Name : null,
}
)

const Replies = ref([])



const fetchReply = async () => {
    const docRef = db.collection('replies').doc(route.params.id);
    const doc = await docRef.get();
    if (doc.exists) {
        currentReply.value = { id: doc.id, ...doc.data() };
        const repliesRef = db.collection("replies").where("discussionId", "==", route.params.id);
        const snapshot = await repliesRef.get();
        Replies.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Replies data after all that mf fetching:", Replies.value);
    } else {
        console.log("No such document!");
    }
}

const refresh = async () => {
  const docRef = db.collection('replies').doc(route.params.id);
  const doc = await docRef.get();
  if (doc.exists) {
    currentReply.value = { id: doc.id, ...doc.data() };

    const repliesRef = db.collection("replies").where("discussionId", "==", route.params.id);
    const snapshot = await repliesRef.get();

    // Map and sort replies by date in descending order
    Replies.value = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => b.date.toMillis() - a.date.toMillis()); // Sort by date descending

    console.log("Replies data after sorting:", Replies.value);
  } else {
    console.log("No such document!");
  }
};


const submitReply = async () => {
  try { // Get the reply content
    const userId = auth.currentUser.uid;

    // Fetch user data
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();
    const userName = userData.username;
    const userIcon = userData.imageURL;
    const Name = userData.name;
    const date = new Date();

    // Create the new reply object
    const newReply = {
      content: newContent.value,
      date: date,
      userId: userId,
      discussionId: currentReply.value.id,
      userIcon: userIcon,
      responses: [], // Initialize with an empty responses array
      userName: userName,
      Name: Name,
    };

    console.log(newReply);
    // Add the new reply to the 'replies' collection
    const newReplyRef = await db.collection("replies").add(newReply);
    const newReplyId = newReplyRef.id; // Get the ID of the newly created reply

    // Update the 'responses' array of the current reply
    const currentReplyRef = db.collection("replies").doc(route.params.id);
    await currentReplyRef.update({
      responses: [...currentReply.value.responses, newReplyId],
    }

);

    // Update the local state
    currentReply.value.responses.push(newReplyId); // Add the new reply ID to the local state
    newContent.value = ""; // Clear the input field
    showReplyInput.value = false; // Hide the reply input field
    console.log("Reply submitted successfully!");
    refresh();

  } catch (error) {
    console.error("Error submitting reply:", error);
  }
};




onMounted(() => {
    fetchReply();
    console.log("Reply data:", currentReply.value);
    window.scrollTo(0, 0); // Scroll to the top of the page when the component is mounted
    
});

</script>


<style scoped>
.reply-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px; /* Slightly larger border radius */
  padding: 16px; /* Increased padding */
  margin: 12px auto; /* Slightly larger margin */
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1); /* Slightly larger shadow */
  max-width: 650px; /* Increased max width */
}

.reply-card:hover {
  transform: translateY(-3px); /* Slightly larger hover effect */
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15); /* Slightly larger shadow on hover */
}

.reply-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px; /* Increased spacing */
}

.user-image {
  width: 50px; /* Larger image size */
  height: 50px; /* Larger image size */
  border-radius: 50%;
  margin-right: 12px; /* Increased spacing */
  border: 2px solid #006a71;
  cursor: pointer;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-size: 16px; /* Slightly larger font size */
  font-weight: bold;
  color: #333;
  margin: 0;
}

.user-full-name {
  font-size: 14px; /* Slightly larger font size */
  color: #555;
  margin: 0;
}

.reply-date {
  font-size: 12px; /* Slightly larger font size */
  color: #777;
  margin: 0;
}

.reply-content {
  font-size: 16px; /* Slightly larger font size */
  color: #000000;
  line-height: 1.6; /* Increased line height */
  margin: 12px 0; /* Increased spacing */
  word-wrap: break-word;
  text-align: left;
}

.edit-textarea {
  width: 100%;
  height: 60px; /* Reduced height */
  padding: 8px; /* Slightly smaller padding */
  border: 1px solid #ccc;
  border-radius: 6px; /* Slightly smaller border radius */
  font-size: 14px; /* Slightly smaller font size */
  font-family: 'Poppins', sans-serif;
  resize: none;
  margin-bottom: 8px; /* Reduced spacing */
  width:50%;
}

.edit-actions{
  display: flex;
  justify-content: center;
  gap: 10px; /* Increased gap */
}

.reply-button {
  padding: 6px 12px; /* Increased padding */
  font-size: 14px; /* Slightly larger font size */
  border-radius: 8px; /* Slightly larger border radius */
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.reply-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px; /* Add spacing above the footer */
}

.transparent-button {
  background-color: transparent; /* Transparent background */
  color: #006a71; /* Text color */
  border: 1px solid #006a71; /* Border with the same color */
  padding: 6px 12px; /* Button padding */
  font-size: 14px; /* Font size */
  border-radius: 8px; /* Rounded corners */
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.transparent-button:hover {
  background-color: #006a71; /* Add background color on hover */
  color: white; /* Change text color on hover */
}
</style>





