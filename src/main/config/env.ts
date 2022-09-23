export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '1720172065032371',
    clientSecret: process.env.FB_CLIENT_SECRET ?? 'f28c07f1542109e523962395cbce920d',
  },
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? 'kasasdjhasdusadg',
};
