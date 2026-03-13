const path = require('node:path');

module.exports = {
  views_dir: path.join(process.cwd(), 'views'),
  partials_dir: path.join(process.cwd(), 'views/partials'),
  layouts_dir: path.join(process.cwd(), 'views/layout'),
  default_layout: path.join(process.cwd(), 'views/layout/default.hbs'),
  extension: '.hbs',
};
