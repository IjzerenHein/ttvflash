/* @flow */
import firebase from '@firebase/app';
import 'firebase/firestore';
import { initFirestorter, Collection, Document } from 'firestorter';
import { observable } from 'mobx';
import { auth } from './auth';
import { TTAppStore } from './ttapp';

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

// $FlowFixMe
export const loggedInUser = observable.box(undefined);
auth.onAuthStateChanged(user => loggedInUser.set(user));

export const presentations = new Collection('presentations');
export const activePresentation = new Document(undefined, {
  // debug: true,
  debugName: 'ActivePresentation',
});

export const defaultPresentationSetting = new Document(
  'settings/defaultPresentation',
  { debug: true, debugName: 'DefaultPresentationSetting' },
);
const defaultPresentationPath = () =>
  `presentations/${defaultPresentationSetting.data.presentationId}`;

export function setActivePresentation(presentationId?: string) {
  if (!presentationId) {
    activePresentation.path = defaultPresentationPath;
  } else {
    if (activePresentation.id === presentationId) return;
    activePresentation.path = 'presentations/' + presentationId;
  }
}

export const ttapp = new TTAppStore({
  isEnabled: () => true,
});
