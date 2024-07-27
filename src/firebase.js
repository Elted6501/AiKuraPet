import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase/app";

import serviceAccount from "../firebase.json" assert { type: "json" };

const appfire = initializeApp({
  apiKey: "AIzaSyCuo9Orvair3x-DQyTpg0VeeBbG4xq-emk",
  authDomain: "aikurapet-2170d.firebaseapp.com",
  projectId: "aikurapet-2170d",
  storageBucket: "aikurapet-2170d.appspot.com",
  messagingSenderId: "1048058522187",
  appId: "1:1048058522187:web:ef09e9bd2c7e7e85a3fbce"
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();

export { db, appfire };