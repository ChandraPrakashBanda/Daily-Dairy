// Import stylesheets
import "./style.css";
// Firebase App (the core Firebase SDK) is always required
// and must be listed first
import firebase from "firebase/app";
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import * as firebaseui from "firebaseui";
//https://firebase.google.com/docs/web/setup#available-libraries -->
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyA8IqD8cF2YJOLgER0PuwNmprKKpN0NnEc",
  authDomain: "daily-diary-afc92.firebaseapp.com",
    projectId: "daily-diary-afc92",
    storageBucket: "daily-diary-afc92.appspot.com",
    messagingSenderId: "843476945395",
    appId: "1:843476945395:web:96ac96f25e873fcf962a86"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
 const db = firebase.firestore();
 let submitButton = document.getElementById('submit');
 let myEntriesButton = document.getElementById('myEntries');
let dateElement = document.getElementById('date');
let timeElement = document.getElementById('text');
let dailyDairyText = document.getElementById('maintext');
let previousInterface = document.getElementById('previous');
const entriesListInterface = document.querySelector('#entriesList');

 //getting data from database

      

function buildInterface(doc){
    let li = document.createElement('li');
    li.setAttribute('data-id', doc.id);
    let mainText = document.createElement('span');
    let dateElement = document.createElement('span');
    let deleteButton = document.createElement('button');
    deleteButton.textContent='x';
    mainText.textContent=doc.data().dailyDairy;
    dateElement.textContent=doc.data().Date;
    li.appendChild(mainText);
    li.appendChild(dateElement);
    li.appendChild(deleteButton);
    
    entriesListInterface.appendChild(li);

    deleteButton.addEventListener('click',(e)=>{
          e.stopPropagation();
          let id = e.target.parentElement.getAttribute('data-id');
          db.collection('Dairy').doc(id).delete();

    });
}
  


const ui = new firebaseui.auth.AuthUI(firebase.auth());
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    
    signInOptions: [
      // Email / Password Provider.
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      }
    }
  
  };
let startRsvpButton = document.getElementById("SignIn");
let form = document.getElementById("mainForm");
startRsvpButton.addEventListener("click",
 () => {
    if (firebase.auth().currentUser) {
      // User is signed in; allows user to sign out
      firebase.auth().signOut();
    } else {
      // No user is signed in; allows user to sign in
      ui.start("#firebaseui-auth-container", uiConfig);
    }
});
firebase.auth().onAuthStateChanged((user)=> {
  if (user) {
    
    startRsvpButton.textContent = "LOGOUT"; 
    submitButton.addEventListener('click',e=>{
      db.collection('Dairy').add({
        Date :dateElement.value,
        dailyDairy : dailyDairyText.value,
        Time : timeElement.value,
        userId : user.uid
      });
      dateElement.value='';
      dailyDairyText.value='';
            timeElement.value='';
}); 

db.collection('Dairy').get().then((snapshot)=>{
   snapshot.docs.forEach(doc =>{
     if(user.uid==doc.data().userId){
     buildInterface(doc);  
     }
   });
  });


     
  }
  else {
    startRsvpButton.textContent = "Login";
     previousInterface.style.display='NONE';

  }
});



