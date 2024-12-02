import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyAgHwpcRfzNOVeJi8tEmMxPfm_g1I4eJT4",
    authDomain: "sakit-dbms-135c2.firebaseapp.com",
    projectId: "sakit-dbms-135c2",
    storageBucket: "sakit-dbms-135c2.firebasestorage.app",
    messagingSenderId: "1048882625699",
    appId: "1:1048882625699:web:b469ab6a3df154b8bb9316"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

//new addition
const provider = new GoogleAuthProvider();
auth.languageCode = 'en';

function showMessage(message, divId){
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    }, 5000);
}

const submit_signup = document.getElementById('signup_btn');
submit_signup.addEventListener("click", function(event){
    event.preventDefault()
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('regemail').value;
    const password = document.getElementById('regpassword').value;

    const auth = getAuth();
    const userdb = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        const userData = {
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email
        };
        showMessage("Account created susccessfully", "signup_message");
        const docRef = doc(userdb, "users", user.uid);
        setDoc(docRef, userData)
        .then(()=>{
            window.location.href='homepage_upload.html';
        })
        .catch((error)=>{
            console.error("Error writing document", error)
        });
        
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        if(errorCode=='auth/email-already-in-use'){
            showMessage("Email already exists.", "signup_message");
        }
        else{
            const errorMessage = error.message;
            alert(errorMessage)
        }
        
    // ..
    });
})


const submit_signin = document.getElementById('signin_btn');
submit_signin.addEventListener('click', (event)=>{
    event.preventDefault();
    const email = document.getElementById('logemail').value;
    const password = document.getElementById('logpassword').value;
    const auth=getAuth();

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        showMessage("Sign In Successful!", "signin_message");
        const user = userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = 'homepage_upload.html';
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        if(errorCode==='auth/invalid-credential'){
            showMessage('Incorrect Email or Password', 'signin_message');
        }
        else{
            showMessage('Account does not exist', 'signin_message');
        }
        //const errorMessage = error.message;
    });
})

const googlesignin = document.getElementById('signin_google');
const googlesignup = document.getElementById('signup_google');
const google_btns = [googlesignin, googlesignup];

google_btns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default form behavior
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                console.log("Google Sign-In successful:", user);

                // Extract user details
                const email = user.email;
                const displayName = user.displayName || "N/A"; // Display name may not always be present
                const [firstName, lastName] = displayName.split(" "); // Split by space to get first and last name

                // Optionally store user details in Firestore
                const userdb = getFirestore();
                const docRef = doc(userdb, "users", user.uid);
                setDoc(docRef, { email, firstName, lastName }, { merge: true }) // Merge ensures other fields aren't overwritten
                    .then(() => {
                        console.log("User details saved to Firestore.");
                        showMessage("Google Sign-In successful!", "signin_message");
                        window.location.href = "homepage_upload.html"; // Redirect to homepage
                    })
                    .catch((error) => {
                        console.error("Error saving user details to Firestore:", error);
                    });
            })
            .catch((error) => {
                console.error("Google Sign-In failed:", error);
                showMessage("Google Sign-In failed. Please try again.", "signin_message");
            });
    });
});




//---------------MAIN FUNC------------------------------------
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
}); 
