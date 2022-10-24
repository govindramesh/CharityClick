const urls = {
  baseUrl: process.env.BASE_URL ?? "http://localhost:3000",
  api: {
    user: {
      signUp: "/api/user/sign-up",
      login: "/api/user/login",
      logout: "/api/user/logout",
      getCurrent: "/api/user",
      charities: "/api/user/charities",
    },
  },
};

export default urls;
