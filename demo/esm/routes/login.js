import {Router} from 'express';
import * as expx from 'express-sweet';

const router = Router();

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', async (req, res, next) => {
  const isAuthenticated = await expx.Authentication.authenticate(req, res, next);
  if (isAuthenticated)
    res.json({success: true, redirect: '/'});
  else
    res.status(401).json({success: false, message: 'Invalid email or password'});
});

export default router;
