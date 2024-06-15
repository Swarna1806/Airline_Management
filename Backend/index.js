const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");

const userRouter = require('./Routers/userRouter');
const flightRouter  = require('./Routers/flightRouter');
const bookingRouter  = require('./Routers/bookingRouter');

const app = express();
app.set('trust proxy', true);
app.use(cors());

dotenv.config({path:'./config.env'});


const DB = process.env.DATABASE;

mongoose.connect(DB)
  .then(() => {
    console.log('DB connection successful');
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });

const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/flight', flightRouter);
app.use('/api/book', bookingRouter);

app.listen(PORT, () => {
  console.log(`Serve at https://localhost:${PORT}`);
});