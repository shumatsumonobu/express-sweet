const express = require('express');
const expx = require('express-sweet');

async function main() {
  const app = express();
  await expx.mount(app);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    // Under Docker the port is remapped, so docker-compose.yml passes the
    // host-side URL in PUBLIC_URL. Outside Docker the two are the same.
    console.log(`Demo running at ${process.env.PUBLIC_URL || `http://localhost:${port}`}`);
  });
}
main();
