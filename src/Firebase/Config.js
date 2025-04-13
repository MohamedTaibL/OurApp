import firebase from 'firebase/app'

import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDIX0rn8kY-34hJ_Z7AHTI4iu8LBrsmXHo",
    authDomain: "fir-fec62.firebaseapp.com",
    projectId: "fir-fec62",
    storageBucket: "fir-fec62.firebasestorage.app",
    messagingSenderId: "795165833794",
    appId: "1:795165833794:web:58800cf2e42b6078f10bdb"
  };


firebase.initializeApp(firebaseConfig)

// Step 2 : Init the firestore service
// If we want to do any communication with the firestore db (eg. add documents)
// we can use projectFirestore variable
const db = firebase.firestore()
const auth = firebase.auth()

auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(() => {
    // Existing and future Auth states are now persisted in the current session only.
    // Closing the window would clear any existing state even if a user forgets to sign out.
    console.log('Persistence set to LOCAL')
  }).catch((error) => {
    // Handle Errors here.
    console.log(error);
  }); 

//Step 3 : Export projectFirestore
// This will enable the use the firebase in different components
export {auth , db}
