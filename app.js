//DEPENDENCIES
const bodyParser = require('body-parser');
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

// static files middleware
app.use(express.static('public'));

//CONTROLLERS

// login controller
const loginController = require('./controllers/userLogin');
app.use('/api/authenticate', loginController);

//patient controller
const patientController = require('./controllers/patient');
app.use('/api/patient', patientController);

//staff controller
const staffController = require('./controllers/staff');
app.use('/api/staff', staffController);

//operation controller
const operationController = require('./controllers/operation');
app.use('/api/operation', operationController);

module.exports = app;
