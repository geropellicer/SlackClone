import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/database';
import 'firebase/auth';

var firebaseConfig = {
    apiKey: "AIzaSyDvmj7dxyqlRFl85mfHtaIogXQo-Kuoifs",
    authDomain: "slackclone-gero.firebaseapp.com",
    databaseURL: "https://slackclone-gero.firebaseio.com",
    projectId: "slackclone-gero",
    storageBucket: "slackclone-gero.appspot.com",
    messagingSenderId: "426330309623",
    appId: "1:426330309623:web:52fabf27a776febaf0a4f2",
    measurementId: "G-CKBV9VQB9P"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;
