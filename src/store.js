import firebase from '@firebase/app';
import 'firebase/firestore';
import { initFirestorter, Collection, Document } from 'firestorter';
import { observable } from 'mobx';
import auth from './auth';

firebase.initializeApp({
  apiKey: 'AIzaSyA1IoyYNh9knR_enXTikdaNPAc1JYoUDSg',
  authDomain: 'ttvflash-2b993.firebaseapp.com',
  databaseURL: 'https://ttvflash-2b993.firebaseio.com',
  projectId: 'ttvflash-2b993',
  storageBucket: '',
  messagingSenderId: '797892172085',
});

// Initialize `firestorter`
initFirestorter({
  firebase: firebase,
});

const loggedInUser = observable.box();
auth.onAuthStateChanged(user => loggedInUser.set(user));

const presentations = new Collection('presentations');
const activePresentation = new Document(undefined, {
  // debug: true,
  debugName: 'ActivePresentation',
});

const defaultPresentationSetting = new Document(
  'settings/defaultPresentation',
  { debug: true, debugName: 'DefaultPresentationSetting' },
);
const defaultPresentationPath = () =>
  `presentations/${defaultPresentationSetting.data.presentationId}`;

function setActivePresentation(presentationId) {
  if (!presentationId) {
    activePresentation.path = defaultPresentationPath;
  } else {
    if (activePresentation.id === presentationId) return;
    activePresentation.path = 'presentations/' + presentationId;
  }
}

export {
  presentations,
  activePresentation,
  defaultPresentationSetting,
  loggedInUser,
  setActivePresentation,
};
