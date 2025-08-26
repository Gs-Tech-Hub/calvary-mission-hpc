export default {
  routes: [
    { method: 'GET', path: '/bible-studies', handler: 'bible-study.find', config: { policies: [] } },
    { method: 'GET', path: '/bible-studies/:id', handler: 'bible-study.findOne', config: { policies: [] } },
    { method: 'POST', path: '/bible-studies', handler: 'bible-study.create', config: { policies: [] } },
    { method: 'PUT', path: '/bible-studies/:id', handler: 'bible-study.update', config: { policies: [] } },
    { method: 'DELETE', path: '/bible-studies/:id', handler: 'bible-study.delete', config: { policies: [] } }
  ]
};


