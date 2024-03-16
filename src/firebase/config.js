import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBJkSpe4Sv0prlRngWFWGUILAkh200SHwk",
  authDomain: "recipes-de5be.firebaseapp.com",
  projectId: "recipes-de5be",
  storageBucket: "recipes-de5be.appspot.com",
  messagingSenderId: "773654201025",
  appId: "1:773654201025:web:2f683840881526dbe84a40"
};

const collectionNames = {
  recipes: "recipes",
  users: "users"
};

// init firebase
firebase.initializeApp(firebaseConfig)

// init services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()

// timestamp
const timestamp = firebase.firestore.Timestamp

export { projectFirestore, projectAuth, projectStorage, collectionNames, timestamp }