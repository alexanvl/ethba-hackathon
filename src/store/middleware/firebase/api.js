import * as firebase from 'firebase';

let authCallback = null;

firebase.initializeApp({
  apiKey: "AIzaSyCiDdsgg0bGEG4dUqJLgaF2R7VCJJH0NaI",
  authDomain: "ethba-hackathon.firebaseapp.com",
  databaseURL: "https://ethba-hackathon.firebaseio.com",
  projectId: "ethba-hackathon",
});

export default firebase;

export function getUser() {
  if (!authCallback) {
    return new Promise((resolve, reject) => {
      authCallback = firebase.auth().onAuthStateChanged((user, error) => {
        if (user) {
          resolve(user);
        } else if (error) {
          reject(error);
        } else {
          resolve(null);
        }
      });
    });
  }

  return Promise.resolve(firebase.auth().currentUser);
}

export function signUpEmail(email, password) {
  return firebase.auth().createUserWithEmailAndPassword(email, password);
}

export function signInEmail(email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
}

export function signOut() {
  return firebase.auth().signOut();
}

export function listenOn(ref, handler) {
  return firebase.database().ref(ref).on('value', ss => handler(ss.val()))
}

export function listenOff(ref, listener) {
  return firebase.database().ref(ref).off('value', listener);
}

export function set(ref, data) {
  return firebase.database().ref(ref).set(data);
}

export function update(ref, data) {
  return firebase.database().ref(ref).update(data);
}