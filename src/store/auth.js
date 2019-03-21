/* @flow */
import '@firebase/auth';
import firebase from '@firebase/app';

const callbacks = new Set();

export const auth = {
  signInWithFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  },

  signInWithEmailAndPassword(username: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(username, password);
  },

  signOut() {
    return firebase.auth().signOut();
  },

  showLoginDialog() {
    callbacks.forEach(callback => callback());
  },

  onShowLoginDialog(callback: () => void) {
    callbacks.add(callback);
    return () => {
      callbacks.delete(callback);
    };
  },

  onAuthStateChanged(callback: any => void) {
    firebase.auth().onAuthStateChanged(callback);
  },
};
