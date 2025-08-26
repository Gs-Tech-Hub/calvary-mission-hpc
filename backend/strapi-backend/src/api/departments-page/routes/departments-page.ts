export default {
  routes: [
    { method: 'GET', path: '/departments-page', handler: 'departments-page.find', config: { policies: [] } },
    { method: 'PUT', path: '/departments-page', handler: 'departments-page.update', config: { policies: [] } }
  ]
};


