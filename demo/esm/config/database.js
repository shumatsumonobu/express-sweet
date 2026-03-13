import path from 'node:path';

export default {
  development: {
    dialect: 'sqlite',
    storage: path.join(process.cwd(), 'demo.sqlite'),
    logging: false,
  },
};
