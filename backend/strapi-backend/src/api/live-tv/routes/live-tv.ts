export default {
  routes: [
    { method: 'GET', path: '/live-tvs', handler: 'live-tv.find', config: { policies: [] } },
    { method: 'GET', path: '/live-tvs/:id', handler: 'live-tv.findOne', config: { policies: [] } },
    { method: 'POST', path: '/live-tvs', handler: 'live-tv.create', config: { policies: [] } },
    { method: 'PUT', path: '/live-tvs/:id', handler: 'live-tv.update', config: { policies: [] } },
    { method: 'DELETE', path: '/live-tvs/:id', handler: 'live-tv.delete', config: { policies: [] } }
  ]
};


