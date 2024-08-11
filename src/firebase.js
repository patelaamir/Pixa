import firebase from "firebase"

const firebaseConfig = {
    apiKey: "AIzaSyBXEO2VCF-uUsFfyg6kALzHCjPXyE9OU0w",
    authDomain: "pixa-b5cb1.firebaseapp.com",
    projectId: "pixa-b5cb1",
    storageBucket: "pixa-b5cb1.appspot.com",
    messagingSenderId: "1058523351954",
    appId: "1:1058523351954:web:62939890ec44cbdd2e4f4b"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore()
  const auth = firebase.auth()
  const storage = firebase.storage()

  export { db, auth, storage }