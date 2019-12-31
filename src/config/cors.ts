export default {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  headers: [
    'Accept',
    'Origin',
    'Content-Type',
    'Authorization',
    'Cache-Control',
    'X-Requested-With',
    'X-HTTP-Method-Override',
  ],
};
