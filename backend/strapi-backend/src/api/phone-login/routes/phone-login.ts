export default {
  routes: [
    {
      method: 'POST',
      path: '/phone-login',
      handler: 'phone-login.phoneLogin',
      config: {
        auth: false,
        description: 'Alternative login route using phone and password',
        tag: {
          plugin: 'phone-login',
          name: 'Phone Login',
          actionType: 'create'
        }
      },
    },
    {
      method: 'GET',
      path: '/phone-login/check/:phone',
      handler: 'phone-login.checkPhoneExists',
      config: {
        auth: false,
        description: 'Check if a phone number exists in the system',
        tag: {
          plugin: 'phone-login',
          name: 'Phone Existence Check',
          actionType: 'find'
        }
      },
    },
  ],
};
