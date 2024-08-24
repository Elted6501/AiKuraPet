import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase/app";

import serviceAccount from "../serviceAccount.json" assert { type: "json" };

const appfire = initializeApp({
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,

});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();

export { db, appfire };