<template>
<!-- Wrap card structure similar to discussion card -->
<div class="reply-card" v-if="!deleted">
  <!-- Reply Header -->
  <div class="reply-header">
    <div class="user-icon" @click="router.push(`/user/${props.reply.userId}`)">
      <img :src="props.reply.userIcon" alt="User Icon" />
      <div style="display: flex; flex-direction: column; gap: 2px; align-items: flex-start;">
        <h3 class="user-name">{{ props.reply.Name }}</h3>
        <p>{{ props.reply.userName }}</p>
      </div>
    </div>
    <div class="reply-meta">
      <p class="reply-date">{{ formattedDate }}</p>
    </div>
  </div>

  <!-- Reply Body -->
  <div class="reply-body">
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
  </div>

  <!-- Footer Actions -->
  <hr style="width: 100%; border: 1px solid #eee; margin: 0.5rem 0;" />
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
/* Match the discussion card look */
.reply-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 16px;
  margin: 12px auto;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.2s ease;
}

.reply-card:hover {
  transform: translateY(-2px);
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-icon {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.user-icon img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #006a71;
}

.user-icon p {
  font-size: 13px;
  color: #444;
  margin: 0;
}

.reply-meta {
  text-align: right;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: #222;
}

.reply-date {
  font-size: 11px;
  color: #888;
  margin-top: 4px;
}

.reply-body {
  text-align: left;
}

.reply-content {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.edit-textarea {
  width: 100%;
  height: 80px;
  border-radius: 8px;
  padding: 10px;
  font-family: 'Poppins', sans-serif;
  border: 1px solid #ccc;
  font-size: 14px;
  resize: none;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.reply-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.reply-button {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
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
  background-color: #007bff;
  color: white;
}

.visit-button:hover {
  background-color: #0056b3;
}

</style>