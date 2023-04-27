import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyCx5rFhZxaT2ZbDAf-zC6KY657FaKAahQw",
    authDomain: "five-chefs-catering-app.firebaseapp.com",
    projectId: "five-chefs-catering-app",
    storageBucket: "five-chefs-catering-app.appspot.com",
    messagingSenderId: "478827609272",
    appId: "1:478827609272:web:fcd2ce3b14a6908e8f884d",
    measurementId: "G-K157F0JT93"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
export {auth,provider};