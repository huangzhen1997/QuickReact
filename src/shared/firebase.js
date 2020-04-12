import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA6tv5CMsoMYnix9FPZ8RFJeI_yY4iRzjg",
    authDomain: "quickreact-5337d.firebaseapp.com",
    databaseURL: "https://quickreact-5337d.firebaseio.com",
    projectId: "quickreact-5337d",
    storageBucket: "quickreact-5337d.appspot.com",
    messagingSenderId: "395861710079",
    appID: "quickreact-5337d",
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase;