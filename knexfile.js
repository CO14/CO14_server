// Update with your config settings.
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    client: 'postgresql',
    connection: 'postgres://localhost/14er',
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL + '?ssl=true',
  },
};
