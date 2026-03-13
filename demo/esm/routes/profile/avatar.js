import {Router} from 'express';
import {writeFileSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import UserModel from '../../models/UserModel.js';

const router = Router();
const publicDir = join(dirname(fileURLToPath(import.meta.url)), '../../public/img');

router.get('/', (req, res) => {
  res.render('avatar');
});

router.post('/', async (req, res) => {
  if (!req.file)
    return res.status(400).json({success: false, message: 'Please select a file'});
  const filename = `avatar-user-${req.user.id}.png`;
  writeFileSync(join(publicDir, filename), req.file.buffer);
  await UserModel.update({avatar: filename}, {where: {id: req.user.id}});
  res.json({success: true, redirect: '/'});
});

export default router;
