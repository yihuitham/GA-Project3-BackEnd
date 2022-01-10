const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');

// Create one patient
router.post('/new', async (req, res) => {
  try {
    const foundPatient = await Patient.findOne({ nric: req.body.nric });
    if (!foundPatient) {
      const nric = req.body.nric;
      const name = req.body.name;
      const gender = req.body.gender;
      const age = req.body.age;
      const bloodType = req.body.bloodType;
      const allergy = req.body.allergy;
      const medicalCondition = req.body.medicalCondition;

      if (
        nric.length < 3 ||
        name.length < 3 ||
        gender.length < 1 ||
        gender.length < 1 ||
        !parseInt(age) ||
        bloodType.length < 1
      ) {
        res.status(403).send({ message: 'Invalid input!' });
        return;
      }
      const newPatient = await Patient.create(req.body);
      res.status(200).send({ message: 'New Patient is added successfully!' });
      return;
    } else {
      res.status(403).send({ message: `Patient's NRIC already existed!` });
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
router.post('/edit', async (req, res) => {
  console.log(req.body);

  try {
    const foundPatient = await Patient.findById(req.body.id);
    if (!foundPatient) {
      res.status(403).send({ message: 'Staff ID not found!' });
      return;
    } else {
      if (
        req.body.name.length < 3 ||
        !parseInt(req.body.age) ||
        req.body.bloodType.length < 1
      ) {
        res.status(403).send({ message: 'Invalid input!' });
        return;
      }
      const updatePatient = await Patient.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        gender: req.body.gender,
        age: req.body.age,
        bloodType: req.body.bloodType,
        allergy: req.body.allergy,
        medicalCondition: req.body.medicalCondition,
      });
      res
        .status(200)
        .send({ message: 'Patient details updated successfully!' });
      return;
    }
  } catch {
    res.status(500).send({ message: 'Unexpected Error' });
    return;
  }
});

// Delete all patients
router.delete('/cleardata', async (req, res) => {
  await Patient.deleteMany();
  res.send('Patient database cleared');
});

//Delete one patient
router.delete('/delete/:_id', async (req, res) => {
  try {
    const deletePatient = await Patient.findByIdAndDelete(req.params._id);
    res.status(200).send({ message: 'Patient id deleted successfully!' });
    return;
  } catch (error) {
    res.status(500).send({ message: 'Unexpected Error' });
    return;
  }
});

// Seed patients
const patientData = require('../models/seedPatient');
router.post('/seed', async (req, res) => {
  const patientSeeds = await Patient.create(patientData);
  res.send(patientSeeds);
});

module.exports = router;
