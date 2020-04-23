const express = require('express');
const cors = require('cors');
const routes = require('./app/esgst/routes');

const app = express();
const port = process.env.PORT || 3000;
const whitelist = [
	'https://www.steamgifts.com',
	'https://www.steamtrades.com',
	'https://rafaelgssa.github.io',
];

app.enable('trust proxy');
app.use(cors({
	origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS!'));
    }
  },
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