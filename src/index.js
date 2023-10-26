import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAxEHm4x4qntzLNs1sFJe3W73aWfeNAGEQ",
  authDomain: "pokemons-c0a02.firebaseapp.com",
  projectId: "pokemons-c0a02",
  storageBucket: "pokemons-c0a02.appspot.com",
  messagingSenderId: "1075692170269",
  appId: "1:1075692170269:web:8a4c9dc3ca269098d42af4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
