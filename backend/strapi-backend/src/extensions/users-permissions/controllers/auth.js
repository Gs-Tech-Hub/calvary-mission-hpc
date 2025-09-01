'use strict';

const { sanitize } = require('@strapi/utils');
const { getService } = require('@strapi/plugin-users-permissions/server/utils');

module.exports = {
  async phoneLogin(ctx) {
    try {
      const { phone, password } = ctx.request.body;

      if (!phone || !password) {
        return ctx.badRequest("Phone and password are required");
      }

      // Find user by phone
      const user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({ where: { phone } });

      if (!user) {
        return ctx.badRequest("Invalid phone or password");
      }

      // Validate password
      const validPassword = await strapi
        .plugin("users-permissions")
        .service("user")
        .validatePassword(password, user.password);

      if (!validPassword) {
        return ctx.badRequest("Invalid phone or password");
      }

      // Check if user is confirmed and not blocked
      if (user.blocked) {
        return ctx.badRequest("Your account has been blocked by an administrator");
      }
      if (!user.confirmed) {
        return ctx.badRequest("Your account is not confirmed");
      }

      // Issue JWT
      const token = strapi
        .plugin("users-permissions")
        .service("jwt")
        .issue({ id: user.id });

      // Sanitize user and include custom fields
      const sanitizedUser = await sanitize.contentAPI.output(user, getService('user').model);
      if (user.phone) {
        sanitizedUser.phone = user.phone;
      }

      return ctx.send({
        jwt: token,
        user: sanitizedUser,
      });
    } catch (error) {
      strapi.log.error('Phone login error:', error);
      return ctx.internalServerError("An error occurred during login");
    }
  },

  async callback(ctx) {
    try {
      const { identifier, password } = ctx.request.body;
      
      if (!identifier || !password) {
        return ctx.badRequest('Identifier and password are required');
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
        return ctx.badRequest('Your account is not confirmed');
      }

      // Issue JWT
      const jwt = getService('jwt').issue({ id: user.id });

      // Sanitize user and include custom fields
      const sanitizedUser = await sanitize.contentAPI.output(user, getService('user').model);
      if (user.phone) {
        sanitizedUser.phone = user.phone;
      }

      return ctx.send({
        jwt,
        user: sanitizedUser,
      });
    } catch (error) {
      strapi.log.error('Auth callback error:', error);
      return ctx.internalServerError('An error occurred during authentication');
    }
  },

  async register(ctx) {
    try {
      const { username, email, password, phone, address, member } = ctx.request.body;

      if (!username || !email || !password || !phone) {
        return ctx.badRequest('Username, email, password, and phone are required');
      }

      // Check if user already exists
      const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: {
          $or: [
            { email: email.toLowerCase() },
            { username },
            { phone },
          ],
        },
      });

      if (existingUser) {
        return ctx.badRequest('User with this email, username, or phone already exists');
      }

      // Create user
      const user = await getService('user').add({
        username,
        email: email.toLowerCase(),
        password,
        phone,
        address,
        member: member || false,
        confirmed: true, // Auto-confirm for now
        provider: 'local',
        role: 1, // Default authenticated role
      });

      // Issue JWT
      const jwt = getService('jwt').issue({ id: user.id });

      // Sanitize user
      const sanitizedUser = await sanitize.contentAPI.output(user, getService('user').model);

      return ctx.send({
        jwt,
        user: sanitizedUser,
      });
    } catch (error) {
      strapi.log.error('Registration error:', error);
      return ctx.internalServerError('An error occurred during registration');
    }
  },
};
