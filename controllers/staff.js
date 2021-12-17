const express = require('express');
const router = express.Router();
const Staff = require('../models/staff');

router.get('/', (req, res) => {
  res.send('staff route');
});

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

module.exports = router;
