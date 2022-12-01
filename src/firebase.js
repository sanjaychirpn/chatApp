import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const App = initializeApp({

    apiKey: "AIzaSyBvw39taPTvnj4AUP9FOwmLS48hTD817gY",
    authDomain: "aye-analytics-3dbd6.firebaseapp.com",
    projectId: "aye-analytics-3dbd6",
    storageBucket: "aye-analytics-3dbd6.appspot.com",
    messagingSenderId: "415732369559",
    appId: "1:415732369559:web:79ad7330e2925df52c41d2"
    
});

const Auth = getAuth();
const Db = getFirestore(App);

export { App, Auth, Db }