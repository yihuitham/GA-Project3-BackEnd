const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Staff = require('../models/staff');

router.get('/', (req, res) => {
  res.send('staff route');
});

// create
router.post('/', async (req, res) => {
  try {
    const foundStaff = await Staff.findOne({ NRIC: req.body.NRIC });
    if (!foundStaff) {
      const loginID = req.body.loginID;
      const password = await bcrypt.hash(req.body.password, 10);
      const NRIC = req.body.NRIC;
      const name = req.body.name;
      const gender = req.body.gender;
      const contact = req.body.contact;
      const role = req.body.role;
      const specialty = req.body.speciality;

      const newStaff = await Staff.create({
        loginID,
        password,
        NRIC,
        name,
        gender,
        contact,
        role,
        specialty,
      });

      res.send(newStaff);
    } else {
      res.status(403).send({ message: 'Staff ID already exist' });
      return;
    }
  } catch {
    res.status(500).send({ message: 'Unexpected Error' });
    return;
  }
});

// update
router.post('/', async (req, res) => {
  try {
    const foundStaff = await Staff.findOne({ staff_id: req.body.staff_id });
    if (!foundStaff) {
      const newStaff = await Staff.create(req.body);
      res.send(newStaff);
    } else {
      res.status(403).send({ message: 'Staff ID already exist' });
      return;
    }
  } catch {
    res.status(500).send({ message: 'Unexpected Error' });
    return;
  }
});

router.delete('/cleardata', async (req, res) => {
  await Staff.deleteMany();
  res.send('Staff database cleared');
});

//seed staff
const staffData = require('../models/seedStaff');
router.post('/seed', (req, res) => {
  Staff.create(staffData);
});

module.exports = router;
