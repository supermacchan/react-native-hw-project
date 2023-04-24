// import firebase from "firebase/app";
// import "firebase/auth";
// import "firebase/firestore";
// import "firebase/storage";
// import storage from '@react-native-firebase/storage';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth/react-native';



const firebaseConfig = {
  apiKey: "AIzaSyDTs5rDhjDGFV9S8hCPhX1lUgm8ikgqUSE",
  authDomain: "rn-homework-be25c.firebaseapp.com",
  projectId: "rn-homework-be25c",
  storageBucket: "rn-homework-be25c.appspot.com",
  messagingSenderId: "720599749035",
  appId: "1:720599749035:web:52fd8f1f12ad7cfe9a42ee",
  measurementId: "G-JHKJELYPJD"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
// export const storage = firebase.storage();
// export default db