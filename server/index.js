const express = require('express');
const cors = require('cors');
const routes = require('./app/esgst/routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: /^https?:\/\/(www\.)?(steamgifts|steamtrades)\.com$/,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});