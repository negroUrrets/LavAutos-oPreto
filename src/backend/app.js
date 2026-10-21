const express = require('express');
const session = require('express-session');
const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const { loadConfig } = require('./config');

const config = loadConfig();
const app = express();

app.use(express.json());
app.use(
  session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.session.cookieSecure,
    },
  }),
);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok' } });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
