/* @flow */
import React from 'react';
import ReactDOM from 'react-dom';
import './store';
import App from './components/App';
import { auth } from './store';
import history from './history';
import routes from './routes';
import registerServiceWorker from './registerServiceWorker';

const render = props =>
  new Promise((resolve, reject) => {
    try {
      ReactDOM.render(
        <App {...props} />,
        // $FlowFixMe
        document.getElementById('root'),
        resolve(props),
      );
    } catch (err) {
      reject(err);
    }
  });

const resolve = promise =>
  promise.then(({ user, location }) =>
    routes.resolve({
      pathname: location.pathname,
      location,
      user,
      render,
    }),
  );

let promise;

auth.onAuthStateChanged(user => {
  if (!promise) {
    promise = Promise.resolve({ user, location: history.location });
    history.listen(location => {
      promise = resolve(promise.then(x => ({ ...x, location })));
    });
  }
  promise = resolve(promise.then(x => ({ ...x, user })));
});

registerServiceWorker();
