import path from 'node:path';

export default {
  env_path: '.env',
  cors_enabled: false,
  max_body_size: '10mb',
  router_dir: path.join(process.cwd(), 'routes'),
  default_router: '/home',
  is_ajax: req => !!req.xhr,
  hook_handle_error: (error, req, res, next) => {
    console.error(error);
    if (error.status === 404)
      res.status(404).render('errors/404');
    else
      res.status(500).render('errors/500');
  },
};
