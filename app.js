const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
require('./config/passport ')(passport);
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const customerRouter = require('./routes/customerSupport');
const cartRouter = require('./routes/cart');

const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
app.use(cors());
app.use(express.json());
app.use(morgan(formatsLogger));
app.use(passport.initialize());

app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/contact', customerRouter);
app.use('/api', cartRouter);
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
    console.error(err);
  res.status(500).json({ message: err.message });
});

module.exports = app;
