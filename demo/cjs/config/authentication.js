const UserModel = require('../models/UserModel');

module.exports = {
  enabled: true,
  session_store: 'memory',
  cookie_secure: false,
  cookie_httpOnly: true,
  username: 'email',
  password: 'password',
  success_redirect: '/',
  failure_redirect: '/login',
  authenticate_user: async (username, password, req) => {
    return UserModel.findOne({where: {email: username, password}, raw: true});
  },
  subscribe_user: async (id) => {
    return UserModel.findOne({where: {id}, raw: true});
  },
  allow_unauthenticated: ['/login'],
  expiration: 24 * 3600000,
};
