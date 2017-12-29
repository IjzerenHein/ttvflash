/* @flow */

import React from 'react';
import UniversalRouter from 'universal-router/main.js';
import { setActivePresentation } from '../store';

// The list of all application routes where each route contains a URL path string (pattern),
// the list of components to load asynchroneously (chunks), data requirements (GraphQL query),
// and a render() function which shapes the result to be passed into the top-level (App) component.
// For more information visit https://github.com/kriasoft/universal-router
const routes = [
  {
    path: '',
    components: () => [import(/* webpackChunkName: 'home' */ './Home')],
    render: ({ user, components: [Home] }) => ({
      title: 'TTV Flash Presentatie Beheer',
      body: <Home user={user} />,
    }),
  },
  {
    path: '/presentation/:presentationId',
    components: () => [import(/* webpackChunkName: 'home' */ './Home')],
    render: ({ user, components: [Home], location }) => {
      const presentationId = location.pathname.substring(
        '/presentation/'.length,
      );
      // console.log('presentationId: ', presentationId);
      setActivePresentation(presentationId);
      return {
        title: 'TTV Flash Presentatie Beheer',
        body: <Home user={user} />,
      };
    },
  },
  {
    path: '/account',
    components: () => [import(/* webpackChunkName: 'Account' */ './Account')],
    render: ({ user, components: [Account] }) => ({
      title: 'Mijn Account',
      body: <Account user={user} />,
    }),
  },
];

function resolveRoute(ctx) {
  const { route } = ctx;

  if (!route.render) {
    return ctx.next();
  }

  return Promise.all(route.components()).then(components => {
    return ctx.render({
      user: ctx.user,
      location: ctx.location,
      route: route.render({
        user: ctx.user,
        location: ctx.location,
        components: components.map(x => x.default),
      }),
    });
  });
}

export default new UniversalRouter(routes, { resolveRoute });
