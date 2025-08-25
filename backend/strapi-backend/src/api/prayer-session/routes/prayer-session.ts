export default {
  routes: [
    { method: 'GET', path: '/prayer-sessions', handler: 'prayer-session.find', config: { policies: [] } },
    { method: 'GET', path: '/prayer-sessions/:id', handler: 'prayer-session.findOne', config: { policies: [] } },
    { method: 'POST', path: '/prayer-sessions', handler: 'prayer-session.create', config: { policies: [] } },
    { method: 'PUT', path: '/prayer-sessions/:id', handler: 'prayer-session.update', config: { policies: [] } },
    { method: 'DELETE', path: '/prayer-sessions/:id', handler: 'prayer-session.delete', config: { policies: [] } }
  ]
};


