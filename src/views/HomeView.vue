<template>
  <div>
    <button @click="addADoc">Add Document</button>
    <button @click="readDocs">Read Documents</button>
  </div>
</template>

<script setup>
<<<<<<< HEAD


import { auth , db} from '@/Firebase/Config'
import { useRouter } from 'vue-router'

const router = useRouter()

auth.onAuthStateChanged((user) => {
  if (!user) {
    router.push('/sign')
  } else {
    console.log("User is signed in:", user.email);
  }
});
=======
import {db} from '@/Firebase/Config'
>>>>>>> d9de5bc616c7ea97cee624e3e7fc922da58801e3

function readDocs() {
  db.collection("Discussions")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} =>`, doc.data());
      });
    })
    .catch((error) => {
      console.error("Error reading documents:", error);
    });
}

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
}
</script>