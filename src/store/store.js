/* @flow */
import firebase from '@firebase/app';
import 'firebase/firestore';
import { initFirestorter, Collection, Document } from 'firestorter';
import { observable, reaction } from 'mobx';
import { auth } from './auth';
import moment from 'moment';
import 'moment/locale/nl';

const DAYS = [
  'maandag',
  'dinsdag',
  'woensdag',
  'donderdag',
  'vrijdag',
  'zaterdag',
  'zondag',
];

function parseWeekDate(str): number {
  str = str.toLowerCase();
  for (let dayOfWeek = 0; dayOfWeek < DAYS.length; dayOfWeek++) {
    if (str.indexOf(DAYS[dayOfWeek]) === 0) {
      const timeStr = str.substring(DAYS[dayOfWeek].length + 1);
      const sepIdx = timeStr.indexOf(':');
      if (sepIdx > 0) {
        const hours = parseInt(timeStr.substring(0, sepIdx), 10);
        const minutes = parseInt(timeStr.substring(sepIdx + 1), 10);
        const mom = moment()
          .startOf('week')
          .add(dayOfWeek, 'day')
          .add(hours, 'hour')
          .add(minutes, 'minute');
        console.log(mom);
        return mom.toDate().getTime();
      }
    }
  }
  return 0;
}

firebase.initializeApp({
  apiKey: 'AIzaSyA1IoyYNh9knR_enXTikdaNPAc1JYoUDSg',
  authDomain: 'ttvflash-2b993.firebaseapp.com',
  databaseURL: 'https://ttvflash-2b993.firebaseio.com',
  projectId: 'ttvflash-2b993',
  storageBucket: 'ttvflash-2b993.appspot.com',
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

const currentTime = observable.box(Date.now());
setInterval(() => currentTime.set(Date.now()), 60000);

export const defaultPresentationSetting = new Document(
  'settings/defaultPresentation',
  { debug: true, debugName: 'DefaultPresentationSetting' },
);
const defaultPresentationPath = () => {
  const now = currentTime.get();
  let id = defaultPresentationSetting.data.presentationId;
  presentations.docs.forEach(presi => {
    const { startAt, endAt } = presi.data;
    if (startAt && endAt) {
      let startAtDate = parseWeekDate(startAt);
      let endAtDate = parseWeekDate(endAt);
      if (startAtDate && endAtDate && now >= startAtDate && now < endAtDate) {
        id = presi.id;
      }
    }
  });
  return `presentations/${id}`;
};

export function setActivePresentation(presentationId?: string) {
  if (!presentationId) {
    activePresentation.path = defaultPresentationPath;
  } else {
    if (activePresentation.id === presentationId) return;
    activePresentation.path = 'presentations/' + presentationId;
  }
}

export const reloadSettings = new Document('settings/reload', {
  debug: true,
  debugName: 'ReloadSettings',
});
let triggerReloadCache = undefined;
reaction(
  () => reloadSettings.data.triggerReload,
  triggerReload => {
    if (
      triggerReloadCache !== undefined &&
      triggerReload !== triggerReloadCache
    ) {
      window.location.reload();
    }
    triggerReloadCache = triggerReload;
  },
  { fireImmediately: true },
);
