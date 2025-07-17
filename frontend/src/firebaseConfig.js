// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6b4YNkKMSaVfFzkpQUOQRVd5gErr8sZs",
  authDomain: "blackletter-dev.firebaseapp.com",
  projectId: "blackletter-dev",
  storageBucket: "blackletter-dev.firebasestorage.app",
  messagingSenderId: "177782061735",
  appId: "1:177782061735:web:5359d1358fed243fdab982"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;