<template>
  <div>
    <button @click="addADoc">Add Document</button>
    <button @click="readDocs">Read Documents</button>
  </div>
</template>

<script setup>
import { auth , db} from '@/Firebase/Config'
import { useRouter } from 'vue-router'

auth.onAuthStateChanged((user) => {
  if (!user) {
    const router = useRouter()
    router.push('/sign')
  } else {
    console.log("User is signed in:", user.email);
  }
});

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