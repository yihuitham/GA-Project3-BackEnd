//DEPENDENCIES
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
//patient controller
const patientController = require('./controllers/patient');
app.use('/patient', patientController);

//staff controller
const staffController = require('./controllers/staff');
app.use('/staff', staffController);

//operation controller
const operationController = require('./controllers/operation');
app.use('/operation', operationController);

module.exports = app;
