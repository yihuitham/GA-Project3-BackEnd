const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');

router.get('/', (req, res) => {
  res.send('patient route');
});

router.post('/', async (req, res) => {
  try {
    const foundPatient = await Patient.findOne({ id: req.body.id });
    if (!foundPatient) {
      const newPatient = await Patient.create(req.body);
      res.send(newPatient);
    } else {
      res.status(403).send({ message: 'Patient ID already exist' });
      return;
    }
  } catch {
    res.status(500).send({ message: 'Unexpected Error' });
    return;
  }
});

module.exports = router;
