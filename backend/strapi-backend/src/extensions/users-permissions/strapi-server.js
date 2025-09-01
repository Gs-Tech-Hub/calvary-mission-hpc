"use strict";

module.exports = (plugin) => {
  // Register custom controllers
  plugin.controllers['phone-login'] = require('./controllers/phone-login');
  plugin.controllers.auth = require('./controllers/auth');
  plugin.controllers.user = require('./controllers/user');

  /**
   * ✅ Custom rateLimit middleware patched to use phone
   */
  const phoneRateLimit = () => {
    const defaultRateLimit = require("@strapi/plugin-users-permissions/server/middlewares/rateLimit");

    return async (ctx, next) => {
      // Inject phone as identifier so the stock rateLimit doesn't crash
      ctx.request.body.identifier = { email: ctx.request.body.phone || "anonymous" };
      return defaultRateLimit()(ctx, next);
    };
  };

  // Attach custom middleware so Strapi can resolve it
  plugin.middlewares.phoneRateLimit = phoneRateLimit;

  // Add bootstrap hook to ensure routes are registered after initialization
  plugin.bootstrap = async function() {
    // Add our custom routes
    this.routes["content-api"].routes.push(
      {
        method: 'POST',
        path: '/auth/login',
        handler: 'auth.callback',
        config: {
          auth: false,
          policies: [],
          middlewares: ['plugin::users-permissions.phoneRateLimit'],
        },
      },
      {
        method: 'POST',
        path: '/auth/phone',
        handler: 'auth.phoneLogin',
        config: {
          auth: false,
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'GET',
        path: '/users/me',
        handler: 'user.me',
        config: {
          policies: [],
          middlewares: [],
        },
      }
    );

    // Debug: Log the registered routes
    console.log('Custom routes added:', this.routes["content-api"].routes.filter(r => 
      r.path === '/auth/login' || r.path === '/auth/phone' || r.path === '/users/me'
    ).map(r => `${r.method} ${r.path}`));
  };

  return plugin;
};
