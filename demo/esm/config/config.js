import path from 'node:path';

export default {
  env_path: '.env',
  cors_enabled: false,
  max_body_size: '10mb',
  router_dir: path.join(process.cwd(), 'routes'),
  default_router: '/home',
  is_ajax: req => !!req.xhr,
  hook_after_env_load: () => {
    // The .env file only carries an encoded password. Decode it here so that
    // config/database.js, which is read later, sees the real value.
    process.env.DB_PASSWORD = Buffer.from(process.env.DB_PASSWORD_B64, 'base64').toString();
    console.log(`[hook_after_env_load] decoded DB_PASSWORD (${process.env.DB_PASSWORD.length} chars) for ${process.env.DB_USER}@${process.env.DB_HOST}`);
  },
  hook_handle_error: (error, req, res, next) => {
    console.error(error);
    if (error.status === 404)
      res.status(404).render('errors/404');
    else
      res.status(500).render('errors/500');
  },
};
