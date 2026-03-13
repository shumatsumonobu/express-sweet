import express from 'express';
import * as expx from 'express-sweet';

const app = express();
await expx.mount(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Demo running at http://localhost:${port}`);
});
