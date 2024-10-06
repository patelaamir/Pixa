import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBXEO2VCF-uUsFfyg6kALzHCjPXyE9OU0w",
    authDomain: "pixa-b5cb1.firebaseapp.com",
    projectId: "pixa-b5cb1",
    storageBucket: "pixa-b5cb1.appspot.com",
    messagingSenderId: "1058523351954",
    appId: "1:1058523351954:web:62939890ec44cbdd2e4f4b"
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp)
  const auth = getAuth(firebaseApp)
  const storage = getStorage(firebaseApp)

  /* createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
  });


  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
  });

  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  }); */


  export { db, auth, storage }