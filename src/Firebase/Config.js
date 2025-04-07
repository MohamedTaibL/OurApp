import firebase from 'firebase/app'

import 'firebase/firestore'

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
const projectFirestore = firebase.firestore()
//Step 3 : Export projectFirestore
// This will enable the use the firebase in different components
export {projectFirestore}
