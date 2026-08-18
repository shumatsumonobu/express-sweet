module.exports = {
  development: {
    dialect: 'mariadb',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    // Decoded by hook_after_env_load in config/config.js, which runs before
    // this file is read.
    password: process.env.DB_PASSWORD,
    timezone: '+09:00',
    logging: false,
  },
};
