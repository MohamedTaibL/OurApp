<template>
  <div>
    <button @click="addADoc">Add Document</button>
    <button @click="readDocs">Read Documents</button>
  </div>
  <DiscussionsLive/>
</template>

<script setup>
import DiscussionsLive from '@/components/DiscussionsLive.vue'

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