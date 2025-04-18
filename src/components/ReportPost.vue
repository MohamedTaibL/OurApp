<template>
  <div class="report-overlay" @click.self="emitClose">
    <div class="report-container">
      <h3>Report Post</h3>
      <p>Please let us know why you're reporting this post:</p>
      <textarea
        v-model="reason"
        placeholder="Type your reason here..."
        rows="5"
      ></textarea>

      <div class="actions">
        <button class="cancel" @click="emitClose">Cancel</button>
        <button class="submit" :disabled="!reason.trim()" @click="submitReport">
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/*
an example of the report object that will be sent to the database:
{
  "postId": "abc123XYZ",              // ID of the reported discussion post
  "reason": "This post contains spam", // User's input describing the reason
  "reporterId": "user456DEF",          // UID of the user reporting, or "anonymous"
  "timestamp": "2025-04-17T15:32:00.000Z" // ISO date when the report was created
}
*/

import { ref } from "vue";
import { db, auth } from "@/Firebase/Config";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  postId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const reason = ref("");

const emitClose = () => {
  emit("close");
};

const submitReport = async () => {
  const userId = auth.currentUser?.uid || "anonymous";
  const reportData = {
    postId: props.postId,
    reason: reason.value.trim(),
    reporterId: userId,
    timestamp: new Date(),
  };

  await db.collection("signals").add(reportData);

  alert("Thank you for reporting. Our team will review the post.");
  emitClose();
};
</script>

<style scoped>
.report-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.report-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 450px;
  box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.25);
  text-align: left;
  font-family: "Poppins", sans-serif;
}

.report-container h3 {
  margin-top: 0;
  color: #e63946;
}

.report-container textarea {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: none;
}

.actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

button.cancel {
  background: #ccc;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

button.submit {
  background: #006a71;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

button.submit:disabled {
  background: #aaa;
  cursor: not-allowed;
}
</style>
