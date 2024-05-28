import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB_hnS4lNNtLK7z-qxM154korEEBSrobXc',
  authDomain: 'nexmo-381b7.firebaseapp.com',
  databaseURL: 'https://nexmo-381b7-default-rtdb.firebaseio.com',
  projectId: 'nexmo-381b7',
  storageBucket: 'nexmo-381b7.appspot.com',
  messagingSenderId: '289657931150',
  appId: '1:289657931150:web:1c664165ea5d1d146950df',
  measurementId: 'G-QPMSJP8KH9',
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);
