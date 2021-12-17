const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');

//Create Request
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

//Read Request
router.get('/:_id', async (req, res) => {
  const foundPatient = await Patient.findById(req.params._id);
  if (!foundPatient) {
    res.status(404).send({ message: 'Patient not found' });
    return;
  }
  res.send(foundPatient);
});

//Create Request

//Delete Request

module.exports = router;
