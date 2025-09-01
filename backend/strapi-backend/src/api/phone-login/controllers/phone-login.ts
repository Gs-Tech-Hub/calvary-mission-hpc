export default {
  /**
   * Phone login endpoint - alternative login route
   * @param ctx - Strapi context
   */
  async phoneLogin(ctx: any) {
    try {
      console.log('Phone login request received:', ctx.request.body);
      
      // Ensure request body exists
      if (!ctx.request.body) {
        console.log('No request body found');
        return ctx.badRequest("Request body is required");
      }

      const { phone, password } = ctx.request.body;
      console.log('Extracted phone:', phone, 'password length:', password ? password.length : 0);

      // Validate input
      if (!phone || !password) {
        console.log('Missing phone or password');
        return ctx.badRequest("Phone and password are required");
      }

      // Validate phone format
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phone)) {
        console.log('Invalid phone format:', phone);
        return ctx.badRequest("Invalid phone number format");
      }

      // Find user by phone
      console.log('Looking for user with phone:', phone);
      const user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({ 
          where: { phone },
          populate: ['role']
        });

      if (!user) {
        console.log('User not found with phone:', phone);
        return ctx.badRequest("Invalid phone or password");
      }

      console.log('User found:', user.id, user.username);

      // Validate password
      const validPassword = await strapi
        .plugin("users-permissions")
        .service("user")
        .validatePassword(password, user.password);

      if (!validPassword) {
        console.log('Invalid password for user:', user.id);
        return ctx.badRequest("Invalid phone or password");
      }

      // Check if user is confirmed and not blocked
      if (user.blocked) {
        console.log('User blocked:', user.id);
        return ctx.badRequest("Your account has been blocked by an administrator");
      }
      if (!user.confirmed) {
        console.log('User not confirmed:', user.id);
        return ctx.badRequest("Your account is not confirmed");
      }

      // Issue JWT
      const token = strapi
        .plugin("users-permissions")
        .service("jwt")
        .issue({ id: user.id });

      console.log('JWT issued for user:', user.id);

      // Sanitize user data (remove sensitive information)
      const { password: _, resetPasswordToken: __, confirmationToken: ___, ...sanitizedUser } = user;

      return ctx.send({
        success: true,
        message: "Login successful",
        jwt: token,
        user: sanitizedUser,
      });

    } catch (error: any) {
      console.error('Phone login error:', error);
      strapi.log.error('Phone login error:', error);
      
      // Handle specific error messages
      if (error.message === 'Invalid phone or password') {
        return ctx.badRequest("Invalid phone or password");
      } else if (error.message === 'Your account has been blocked by an administrator') {
        return ctx.badRequest("Your account has been blocked by an administrator");
      } else if (error.message === 'Your account is not confirmed') {
        return ctx.badRequest("Your account is not confirmed");
      }
      
      return ctx.internalServerError("An error occurred during login");
    }
  },

  /**
   * Check if phone number exists (for validation purposes)
   * @param ctx - Strapi context
   */
  async checkPhoneExists(ctx: any) {
    try {
      const { phone } = ctx.params;
      console.log('Checking phone existence:', phone);

      if (!phone) {
        return ctx.badRequest("Phone parameter is required");
      }

      // Validate phone format
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phone)) {
        return ctx.badRequest("Invalid phone number format");
      }

      const user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({ where: { phone } });
      
      const exists = !!user;

      return ctx.send({
        exists,
        phone
      });

    } catch (error) {
      console.error('Phone existence check error:', error);
      strapi.log.error('Phone existence check error:', error);
      return ctx.internalServerError("An error occurred while checking phone");
    }
  }
};
