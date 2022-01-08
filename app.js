//DEPENDENCIES
require('dotenv').config();
// const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('express-jwt');
const jwtDecode = require('jwt-decode');
const express = require('express');
const app = express();
const methodOverride = require('method-override');

//MIDDLEWARE
// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// cors
const CORS_WHITELIST = process.env.CORS_WHITELIST.split(',');
console.log(CORS_WHITELIST);

app.use(
  cors({
    origin: CORS_WHITELIST,
    credentials: true,
  })
);
// app.use(cors());

// static files middleware
app.use(express.static('public'));

//CONTROLLERS
// login controller
const loginController = require('./controllers/authenticate');
app.use('/api/authenticate', loginController);

// attach user to the Request object/api
const attachUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Authentication invalid' });
  }

  const decodedToken = jwtDecode(token.slice(7));

  if (!decodedToken) {
    return res
      .status(401)
      .json({ message: 'There was a problem authorizing the request' });
  } else {
    req.user = decodedToken;
    next();
  }
};

app.use(attachUser);

//patient controller
const patientController = require('./controllers/patient');
app.use('/api/patient', patientController);

//staff controller
const staffController = require('./controllers/staff');
app.use('/api/staff', staffController);

//operation controller
const operationController = require('./controllers/operation');
const { config } = require('dotenv');
app.use('/api/operation', operationController);

module.exports = app;
