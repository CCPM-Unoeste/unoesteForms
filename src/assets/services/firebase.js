import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';
import 'firebase/storage';

firebase.initializeApp({
    apiKey: "AIzaSyDycWorAMEXefgq3anP-B2OC0d616TdGbU",
    authDomain: "unoesteforms.firebaseapp.com",
    databaseURL: "https://unoesteforms.firebaseio.com",
    projectId: "unoesteforms",
    storageBucket: "unoesteforms.appspot.com",
    messagingSenderId: "706187520284",
    appId: "1:706187520284:web:4870d7f4d26d63b1c9b2d9",
    measurementId: "G-NZSFTZQ9XL"
});

export const auth = firebase.auth;
export const database = firebase.database();
export const functions = firebase.functions();
export const storage = firebase.storage();