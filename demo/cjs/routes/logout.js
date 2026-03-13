const {Router} = require('express');
const expx = require('express-sweet');

const router = Router();

router.get('/', (req, res) => {
  expx.Authentication.logout(req);
  res.redirect('/login');
});

module.exports = router;
