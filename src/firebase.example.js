/* REPLACE APPROPIATE VALUES FROM THIS FILE WITH YOUR OWN CONFIGURATION
FROM FIREBASE. ONCE DONE, RENAME IT TO "firebase.js" AND YOU ARE GOOD TO GO */


import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/database';
import 'firebase/auth';

var firebaseConfig = {
    apiKey: "REPLACE WITH API KEY",
    authDomain: "REPLACE WITH AUTH DOMAIN",
    databaseURL: "REPLACE WITH DATABASE URL",
    projectId: "REPLACE WITH PROJECT ID",
    storageBucket: "REPLACE WITH STORAGE BUCKET URL",
    messagingSenderId: "REPLACE WITH MESSAGING SENDER ID",
    appId: "REPLACE WITH APP ID",
    measurementId: "OPTIONALLY REPLACE WITH MEASUREMENT ID"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;
