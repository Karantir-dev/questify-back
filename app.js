const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const contactsRouter = require('./routes/contactsRoutes');
const usersRouter = require('./routes/usersRoutes');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
app.use(express.static('public'));
app.get('env') !== 'test' && app.use(logger(formatsLogger));
app.use(cors({ origin: true }));
app.use(express.json());

app.use('/contacts', contactsRouter);
app.use('/users', usersRouter);

app.use((_, res) => {
  res.status(404).json({ message: '404 Not found' });
});

app.use((err, _, res, __) => {
  const errorCode = err.code || 500;
  res.status(errorCode).json({
    status: `${errorCode} ${err.status || 'fail'}`,
    message: err.message,
  });
});

module.exports = app;
