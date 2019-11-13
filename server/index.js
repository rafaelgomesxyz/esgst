const express = require('express');
const cors = require('cors');
const routes = require('./app/esgst/routes');

const app = express();
const port = process.env.PORT || 3000;

app.enable('trust proxy');
app.use(cors({
  origin: /^https?:\/\/(www\.)?(steamgifts|steamtrades)\.com$/,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect(`https://${req.hostname}${req.originalUrl}`);
  }
});
app.use(routes);

app.listen(port, () => {
  console.log(`Server started on port ${port}...`);
});