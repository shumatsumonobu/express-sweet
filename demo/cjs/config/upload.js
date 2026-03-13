module.exports = {
  enabled: true,
  resolve_middleware: (req, multer) => {
    if (req.path === '/' && req.method === 'POST') {
      const upload = multer({storage: multer.memoryStorage()});
      return upload.single('avatar');
    }
    return null;
  },
};
