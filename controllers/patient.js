const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');

// Create one patient
router.post('/', async (req, res) => {
  try {
    const foundPatient = await Patient.findOne({ nric: req.body.nric });
    if (!foundPatient) {
      const newPatient = await Patient.create(req.body);
      res.send(newPatient);
    } else {
      res.status(403).send({ message: 'NRIC already exist' });
      return;
    }
  } catch {
    res.status(500).send({ message: 'Unexpected Error' });
    return;
  }
});

// Read all patients
router.get('/all', async (req, res) => {
  const allPatients = await Patient.find({});
  res.send(allPatients);
});

// Read one patient
router.get('/:_id', async (req, res) => {
  const foundPatient = await Patient.findById(req.params._id);
  if (!foundPatient) {
    res.status(404).send({ message: 'Patient not found' });
    return;
  }
  res.send(foundPatient);
});

// Update one patient
router.put('/:_id', async (req, res) => {
  const updatePatient = await Patient.findByIdAndUpdate(
    req.params._id,
    req.body,
    { new: true }
  );
  if (!updatePatient) {
    res.status(400).send({ message: 'Patient update unsuccessful' });
    return;
  }
  res.send(updatePatient);
});

// Delete all patients
router.delete('/cleardata', async (req, res) => {
  await Patient.deleteMany();
  res.send('Patient database cleared');
});

//Delete one patient
router.delete('/:_id', async (req, res) => {
  const deletePatient = await Patient.findByIdAndDelete(req.params._id);
  if (!deletePatient) {
    res
      .status(400)
      .send({ message: 'Patient not found, deletion unsuccessful' });
    return;
  }
  res.send(deletePatient);
});

// Seed patients
const patientData = require('../models/seedPatient');
router.post('/seed', async (req, res) => {
  const patientSeeds = await Patient.create(patientData);
  res.send(patientSeeds);
});

module.exports = router;
