export default () => ({
    databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/urlshortener',
  });
  