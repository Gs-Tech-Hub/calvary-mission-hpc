export default {
  routes: [
    { method: 'GET', path: '/entertainments', handler: 'entertainment.find', config: { policies: [] } },
    { method: 'GET', path: '/entertainments/:id', handler: 'entertainment.findOne', config: { policies: [] } },
    { method: 'POST', path: '/entertainments', handler: 'entertainment.create', config: { policies: [] } },
    { method: 'PUT', path: '/entertainments/:id', handler: 'entertainment.update', config: { policies: [] } },
    { method: 'DELETE', path: '/entertainments/:id', handler: 'entertainment.delete', config: { policies: [] } }
  ]
};


