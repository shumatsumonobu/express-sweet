const path = require('node:path');

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: path.join(process.cwd(), 'demo.sqlite'),
    logging: false,
  },
};
