import {Router} from 'express';
import {writeFileSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import UserModel from '../models/UserModel.js';

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '../public/img');

const router = Router();

router.get('/', async (req, res) => {
  const users = await UserModel.findAll({raw: true});
  res.render('users', {users});
});

router.get('/new', (req, res) => {
  res.render('users-new');
});

router.post('/new', async (req, res) => {
  const {name, email, password, avatar: avatarDataUrl} = req.body;
  try {
    const user = await UserModel.create({name, email, password});
    const filename = `avatar-user-${user.id}.png`;
    const base64 = avatarDataUrl.replace(/^data:image\/\w+;base64,/, '');
    writeFileSync(join(publicDir, filename), Buffer.from(base64, 'base64'));
    await UserModel.update({avatar: filename}, {where: {id: user.id}});
    res.json({success: true, redirect: '/users'});
  } catch (err) {
    res.status(400).json({success: false, message: err.message});
  }
});

router.get('/:id/edit', async (req, res) => {
  const user = await UserModel.findOne({where: {id: req.params.id}, raw: true});
  if (!user)
    return res.status(404).render('errors/404');
  res.render('users-edit', {user});
});

router.put('/:id', async (req, res) => {
  const {name, email, avatar: avatarDataUrl} = req.body;
  try {
    const fields = {name, email};
    if (avatarDataUrl) {
      const filename = `avatar-user-${req.params.id}.png`;
      const base64 = avatarDataUrl.replace(/^data:image\/\w+;base64,/, '');
      writeFileSync(join(publicDir, filename), Buffer.from(base64, 'base64'));
      fields.avatar = filename;
    }
    await UserModel.update(fields, {where: {id: req.params.id}});
    res.json({success: true, redirect: '/users'});
  } catch (err) {
    res.status(400).json({success: false, message: err.message});
  }
});

router.delete('/:id', async (req, res) => {
  if (String(req.params.id) === String(req.user.id))
    return res.status(400).json({success: false, message: 'You can\'t remove yourself'});
  try {
    await UserModel.destroy({where: {id: req.params.id}});
    res.json({success: true});
  } catch (err) {
    res.status(400).json({success: false, message: err.message});
  }
});

export default router;
