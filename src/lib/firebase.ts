'use client';

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: 'chattyface-awsc4',
  appId: '1:213942287593:web:01dd90eba9523e745dc478',
  storageBucket: 'chattyface-awsc4.firebasestorage.app',
  apiKey: 'AIzaSyBFzKGqbuQaYy43TJRRdh3gICO8oDBGboQ',
  authDomain: 'chattyface-awsc4.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '213942287593',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
