module.exports = ({ env }) => ({
  // upload: {
  //   config: {
  //     provider: "strapi-provider-upload-supabase",
  //     providerOptions: {
  //       apiUrl: env("SUPABASE_API_URL"),
  //       apiKey: env("SUPABASE_API_KEY"),
  //       bucket: env("SUPABASE_BUCKET"),
  //       directory: env("SUPABASE_DIRECTORY"),
  //       options: {},
  //     },
  //     actionOptions: {
  //       upload: {},
  //       uploadStream: {},
  //       delete: {},
  //     },
  //   },
  // },
  ezforms: {
    config: {
      captchaProvider: {
        name: "none"
      },
      notificationProviders: [],
    }
  },
   "users-permissions": {
    config: {
      register: {
        allowedFields: ["phone"], // accept phone at registration
      },
      jwt: {
        expiresIn: '30d',
      },
      // Disable default routes to use our custom ones
      routes: {
        auth: {
          local: false,
          'local/register': false,
        },
      },
    },
  },
});
