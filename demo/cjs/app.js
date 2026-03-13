const express = require('express');
const expx = require('express-sweet');

async function main() {
  const app = express();
  await expx.mount(app);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Demo running at http://localhost:${port}`);
  });
}
main();
