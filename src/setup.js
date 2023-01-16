/*
    Initializes the firebase app and exports instances of Firestore and Storage services
*/
const { getFirestore} = require("firebase/firestore");
const firebase = require('firebase/app');
const firebaseConfig = require("../firebase-config.json")
const { getStorage } = require("firebase/storage");

const app = firebase.initializeApp(firebaseConfig);
const database = getFirestore(app);
const storage = getStorage(app);

module.exports = {app, database, storage};