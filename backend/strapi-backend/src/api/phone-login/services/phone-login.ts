export default {
  /**
   * Authenticate user by phone and password
   * @param phone - User's phone number
   * @param password - User's password
   * @returns Promise with user data and JWT token
   */
  async authenticateByPhone(phone: string, password: string) {
    try {
      // Find user by phone
      const user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({ 
          where: { phone },
          populate: ['role']
        });

      if (!user) {
        throw new Error('Invalid phone or password');
      }

      // Validate password
      const validPassword = await strapi
        .plugin("users-permissions")
        .service("user")
        .validatePassword(password, user.password);

      if (!validPassword) {
        throw new Error('Invalid phone or password');
      }

      // Check if user is confirmed and not blocked
      if (user.blocked) {
        throw new Error('Your account has been blocked by an administrator');
      }
      if (!user.confirmed) {
        throw new Error('Your account is not confirmed');
      }

      // Issue JWT
      const token = strapi
        .plugin("users-permissions")
        .service("jwt")
        .issue({ id: user.id });

      // Sanitize user data (remove sensitive information)
      const { password: _, resetPasswordToken: __, confirmationToken: ___, ...sanitizedUser } = user;

      return {
        jwt: token,
        user: sanitizedUser,
      };
    } catch (error) {
      strapi.log.error('Phone authentication error:', error);
      throw error;
    }
  },

  /**
   * Validate phone number format
   * @param phone - Phone number to validate
   * @returns boolean indicating if phone is valid
   */
  validatePhoneFormat(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  },

  /**
   * Check if phone number exists in the system
   * @param phone - Phone number to check
   * @returns boolean indicating if phone exists
   */
  async phoneExists(phone: string): Promise<boolean> {
    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { phone } });
    
    return !!user;
  }
};
