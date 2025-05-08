export default () => ({
    'users-permissions': {
    config: {
      providers: {
        github: {
          redirectUri:  `${process.env.CLIENT_URL}/auth/github/callback`
        },
        google:{
          redirectUri:  `${process.env.CLIENT_URL}/auth/google/callback`
        }
      },
      jwt: {
        expiresIn: '7d',
      },
    },
  },
});
