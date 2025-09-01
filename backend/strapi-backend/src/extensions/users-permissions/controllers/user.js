'use strict';

const { sanitize } = require('@strapi/utils');
const { getService } = require('@strapi/plugin-users-permissions/server/utils');

module.exports = {
  async me(ctx) {
    try {
      const user = ctx.state.user;
      
      if (!user) {
        return ctx.unauthorized('Not authenticated');
      }

      // Get fresh user data from database
      const freshUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: user.id },
      });

      if (!freshUser) {
        return ctx.notFound('User not found');
      }

      // Check if user is blocked
      if (freshUser.blocked) {
        return ctx.forbidden('Your account has been blocked');
      }

      // Sanitize user and include custom fields
      const sanitizedUser = await sanitize.contentAPI.output(freshUser, getService('user').model);
      if (freshUser.phone) {
        sanitizedUser.phone = freshUser.phone;
      }

      return ctx.send(sanitizedUser);
    } catch (error) {
      strapi.log.error('User me error:', error);
      return ctx.internalServerError('An error occurred while fetching user profile');
    }
  },
};
