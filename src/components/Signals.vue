<template>
    <div class="Signals" v-if="filteredSignals.length != 0">
        <Signal v-for="signal in filteredSignals" :key="signal.id" :signal="{...signal, id : signal.id}" @deleteSignal="deleteSignal" />
    </div>
    <div v-else>
        nothing to see here '_'
    </div>
</template>

<script setup>

import { ref, onMounted, defineProps} from 'vue';
import { db } from '@/Firebase/Config'; // Import your Firebase configuration
import Signal from '@/components/Signal.vue'; // Import your Signal component

const props = defineProps({
    search: {
    type: Object,
    required: false,
    default: () => ({ content: "", user: "" }),
    },
});

/* this is what a report looks like
{
  "postId": "abc123XYZ",              // ID of the reported discussion post
  "reason": "This post contains spam", // User's input describing the reason
  "reporterId": "user456DEF",          // UID of the user reporting, or "anonymous"
  "timestamp": "2025-04-17T15:32:00.000Z" // ISO date when the report was created
}
*/

/*
the search object:
{
content : "", //  the content to be searched for
user: "" // the user name of the person in question
}

*/

import { computed } from 'vue';

const filteredSignals = computed(() => {
    const contentQuery = props.search.content.toLowerCase();
    const userQuery = props.search.user.toLowerCase();

    return signals.value.filter(signal => {
        const contentMatch = signal.reason?.toLowerCase().includes(contentQuery);
        const userMatch = (
            signal.reporterName?.toLowerCase().includes(userQuery) ||
            signal.reporterUsername?.toLowerCase().includes(userQuery)
        );
        return contentMatch && userMatch;
    });
});


const signals = ref([]);
const fetchSignals = async () => {
    signals.value = [];

    const querySnapshot = await db.collection('signals').get();
    const signalPromises = querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const signal = { id: doc.id, ...data };

        // Fetch reporter info
        if (signal.reporterId && signal.reporterId !== "anonymous") {
            const userDoc = await db.collection("users").doc(signal.reporterId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                signal.reporterName = userData.name || "";
                signal.reporterUsername = userData.username || "";
            } else {
                signal.reporterName = "";
                signal.reporterUsername = "";
            }
        } else {
            signal.reporterName = "Anonymous";
            signal.reporterUsername = "anonymous";
        }

        return signal;
    });

    signals.value = await Promise.all(signalPromises);
};

const deleteSignal = async (id) => {
    signals.value = signals.value.filter(signal => signal.id !== id); // Remove the deleted signal from the array
};


onMounted(() => {
    fetchSignals();
});
</script>

<style scoped>

</style>