// Custom auth callback controller to expose the phone field in the login response
'use strict';

const { sanitize } = require('@strapi/utils');
const { getService } = require('@strapi/plugin-users-permissions/server/utils');

module.exports = {
  async callback(ctx) {
    const provider = ctx.params.provider || 'local';
    if (provider === 'local') {
      const { identifier, password } = ctx.request.body;
      if (!identifier || !password) {
        return ctx.badRequest('Missing identifier or password');
      }

      // Find user by email, username, or phone
      const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: {
          $or: [
            { email: identifier.toLowerCase() },
            { username: identifier },
            { phone: identifier },
          ],
        },
      });

      if (!user) {
        return ctx.badRequest('Invalid identifier or password');
      }

      // Validate password
      const validPassword = await getService('user').validatePassword(password, user.password);
      if (!validPassword) {
        return ctx.badRequest('Invalid identifier or password');
      }

      // Check if user is confirmed and not blocked
      if (user.blocked) {
        return ctx.badRequest('Your account has been blocked by an administrator');
      }
      if (!user.confirmed) {
        return ctx.badRequest('Your account email is not confirmed');
      }

      // Issue JWT
      const jwt = getService('jwt').issue({ id: user.id });

      // Sanitize user and include custom fields
      const sanitizedUser = await sanitize.contentAPI.output(user, getService('user').model);
      if (user.phone) {
        sanitizedUser.phone = user.phone;
      }

      ctx.send({
        jwt,
        user: sanitizedUser,
      });
    } else {
      // fallback to default for other providers
      const { user, info, error } = await getService('user').callback(ctx);
      if (!user) {
        return ctx.badRequest(null, info ? [{ messages: [{ id: info.message }] }] : error);
      }
      const jwt = getService('jwt').issue({ id: user.id });
      const sanitizedUser = await sanitize.contentAPI.output(user, getService('user').model);
      if (user.phone) {
        sanitizedUser.phone = user.phone;
      }
      ctx.send({
        jwt,
        user: sanitizedUser,
      });
    }
  },
};
