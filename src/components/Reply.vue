<template>
  
  <div class="reply-card" v-if ="!deleted">
    <!-- Reply Header -->
    <div class="reply-header">
      <img 
        :src="props.reply.userIcon" 
        alt="User Image" 
        class="user-image" 
        @click="router.push(`/user/${props.reply.userId}`)" 
      />
      <div class="user-info">
        <h3 class="user-name">{{ props.reply.Name }}</h3>
        <p class="user-full-name">{{ props.reply.userName }}</p>
        <p class="reply-date">{{ formattedDate }}</p>
      </div>
    </div>

    <!-- Reply Content -->
    <div v-if="editMode">
      <textarea 
        v-model="editContent" 
        class="edit-textarea"
        placeholder="Edit your reply..."
      ></textarea>
      <div class="edit-actions">
        <button class="reply-button save-button" @click="submitEdit">Save</button>
        <button class="reply-button cancel-button" @click="cancelEdit">Cancel</button>
      </div>
    </div>
    <p v-else class="reply-content">{{ props.reply.content }}</p>

    <!-- Reply Footer -->
    <div class="reply-footer" v-if="!editMode">
      <button class="reply-button edit-button" @click="enableEdit" v-if="auth.currentUser.uid == props.reply.userId">Edit</button>
      <button class="reply-button delete-button" @click="handleDelete" v-if="auth.currentUser.uid == props.reply.userId">Delete</button>
      <button class="reply-button visit-button" @click="router.push({ name: 'reply', params: {id : props.reply.id} })">Visit</button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth, db } from '@/Firebase/Config'; // Import your Firebase configuration


// Define props
const props = defineProps({
  reply: {
    type: Object,
    required: true,
  },
});

const currentRoute = useRouter().currentRoute.value.name == "discussion" ? "discussions" : "replies";

const emit = defineEmits(["deleteReply"]);


const router = useRouter();
const editMode = ref(false); // Tracks whether the edit mode is active
const editContent = ref(""); // Stores the edited content
const deleted = ref(false); // Tracks whether the reply is deleted

// Format the date
const formattedDate = computed(() => {
  let date;
  if (props.reply.date && props.reply.date.toDate) {
    date = props.reply.date.toDate();
  } else {
    date = new Date(props.reply.date);
  }

  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

// Enable edit mode
const enableEdit = () => {
  editMode.value = true;
  editContent.value = props.reply.content; // Pre-fill the textarea with the current content
};

// Submit the edited content
const submitEdit = async () => {
  if (editContent.value.trim() === "") {
    alert("Reply content cannot be empty.");
    return;
  }

  try {
    const updateReply = db.collection("replies").doc(props.reply.id); // Get the document reference
    await updateReply.update({
      content: editContent.value,
      date: new Date(), // Update the date to the current time
    });
    props.reply.content = editContent.value; // Update the local reply content
  }
  catch(error){
    console.error("Error updating reply:", error);
    alert("Failed to update the reply. Please try again.");
  } finally {
    editMode.value = false; // Exit edit mode after submission
    editContent.value = ""; // Clear the edit content
  }
};

// Cancel editing
const cancelEdit = () => {
  editMode.value = false;
  editContent.value = ""; // Clear the edit content
};

// Handle delete (placeholder)
const handleDelete = async () => {
  const confirmDelete = confirm("Are you sure you want to delete this reply?");
  if (confirmDelete) {
    try {
      await db.collection("replies").doc(props.reply.id).delete(); // Delete the reply from Firestore
      const REPLIES = db.collection(currentRoute).doc(props.reply.discussionId)// Remove the reply ID from the discussion's replies array;
      let replies = [];
      if (currentRoute == "discussions"){
      replies = (await REPLIES.get()).data().comments|| [];
      const updatedReplies = replies.filter((replyId) => replyId !== props.reply.id);
      await REPLIES.update({ comments: updatedReplies });
      }
      else{
      replies = (await REPLIES.get()).data().responses || []; // Get the current replies array
      const updatedReplies = replies.filter((replyId) => replyId !== props.reply.id);
      await REPLIES.update({ responses: updatedReplies });
      }
      console.log("Replies man wtd" , replies);
  
      console.log("Reply deleted successfully!");
      deleted.value = true; // Mark the reply as deleted in the UI
      
    } catch (error) {
      console.error("Error deleting reply:", error);
      alert("Failed to delete the reply. Please try again.");
    } finally {
      emit("deleteReply"); // Emit an event to notify the parent component about the deletion

    }}}

    onMounted(() => {
      console.log("Current router : " ,currentRoute);
      }
    );
</script>

<style scoped>
.reply-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  margin: 8px auto; /* Center the card horizontally */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  max-width: 600px; /* Limit the width for a more compact look */
}

.reply-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.reply-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.user-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  border: 2px solid #006a71;
  cursor: pointer; /* Makes the cursor a pointer */
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align text to the left */
}

.user-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.user-full-name {
  font-size: 12px;
  color: #555;
  margin: 0;
}

.reply-date {
  font-size: 10px;
  color: #777;
  margin: 0;
}

.reply-content {
  font-size: 14px;
  color: #000000;
  line-height: 1.4;
  margin: 8px 0;
  word-wrap: break-word;
  text-align: left; /* Ensure text starts at the left */
}

.edit-textarea {
  width: 100%;
  height: 80px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Poppins', sans-serif;
  resize: none;
  margin-bottom: 8px;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.reply-button {
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.save-button {
  background-color: #006a71;
  color: white;
}

.save-button:hover {
  background-color: #004d52;
}

.cancel-button {
  background-color: #e0e0e0;
  color: #333;
}

.cancel-button:hover {
  background-color: #ccc;
}

.edit-button {
  background-color: #006a71;
  color: white;
}

.edit-button:hover {
  background-color: #004d52;
}

.delete-button {
  background-color: #e63946;
  color: white;
}

.delete-button:hover {
  background-color: #b71c1c;
}

.visit-button {
  background-color: #007bff; /* Blue background */
  color: white; /* White text */
  padding: 4px 8px; /* Padding for the button */
  font-size: 12px; /* Font size */
  border-radius: 6px; /* Rounded corners */
  border: none; /* Remove border */
  cursor: pointer; /* Pointer cursor on hover */
  transition: background-color 0.3s ease, color 0.3s ease; /* Smooth hover effect */
}

.visit-button:hover {
  background-color: #0056b3; /* Darker blue on hover */
}
</style>