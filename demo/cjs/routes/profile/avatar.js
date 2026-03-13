const {Router} = require('express');
const {writeFileSync} = require('fs');
const {join} = require('path');
const UserModel = require('../../models/UserModel');

const router = Router();
const publicDir = join(__dirname, '../../public/img');

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

module.exports = router;
