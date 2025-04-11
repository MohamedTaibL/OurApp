<template>
  <div>
    <h1>Hello</h1>
    <p>Voici les discussions en cours :</p>
    <button @click="addADoc">Ajouter un document</button>
    <DiscussionsLive/>
  </div>
  <DiscussionsLive/>
</template>

<script setup>
import DiscussionsLive from '@/components/DiscussionsLive.vue'
import { db , auth } from '@/Firebase/Config'
import { ref, onMounted } from 'vue'

// getting the current user
/*const userName = ref(null)

onMounted(() => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      userId.value = user.uid
      userName.value = user.displayName
      userEmail.value = user.email
      userPhoto.value = user.photoURL
      user.value = { id: userId.value, name: userName.value, email: userEmail.value, photo: userPhoto.value }
    } else {
      console.log("No user is signed in")
    }
  })
})

/*
async function addADoc() {
  try{
    let docRef = await db.collection("Discussions").add({
      Contenu: "Ceci est un contenu d'exemple",
      Titre: "Titre d'exemple",
      editeur: "Utilisateur1",
      estResponse: false,
      responses: ["Réponse 1", "Réponse 2"],
    })

    console.log(`Document id added is : ${docRef.id}`)

  }
  catch{
    console.log("There was an error!");

  }
}*/
</script>