export default {
  routes: [
    { method: 'GET', path: '/prayers', handler: 'prayer.find', config: { policies: [] } },
    { method: 'GET', path: '/prayers/:id', handler: 'prayer.findOne', config: { policies: [] } },
    { method: 'POST', path: '/prayers', handler: 'prayer.create', config: { policies: [] } },
    { method: 'PUT', path: '/prayers/:id', handler: 'prayer.update', config: { policies: [] } },
    { method: 'DELETE', path: '/prayers/:id', handler: 'prayer.delete', config: { policies: [] } }
  ]
};


