const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Operation = require('../models/operation');
const Staff = require('../models/staff');

// Create one operation
router.post('/', async (req, res) => {
  try {
    const foundOperation = await Operation.findOne({
      operatingRoom: req.body.operatingRoom,
      date: req.body.date,
    });
    if (!foundOperation) {
      const surgeonIDStr = req.body.surgeonID;
      const surgeonID = mongoose.Types.ObjectId(surgeonIDStr);

      const nursesIDStr = req.body.nursesID;
      const nursesID = nursesIDStr.map((nurse) => {
        return mongoose.Types.ObjectId(nurse);
      });

      const patientIDStr = req.body.patientID;
      const patientID = mongoose.Types.ObjectId(patientIDStr);

      const newOperation = await Operation.create({
        operatingRoom: req.body.operatingRoom,
        surgeonID,
        nursesID,
        patientID,
        date: req.body.date,
        time: req.body.time,
      });
      res.send(newOperation);
    } else {
      res
        .status(403)
        .send({ message: 'Operation room not available on selected date' });
      return;
    }
  } catch {
    res.status(500).send({ message: 'Unexpected Error' });
    return;
  }
});

// Read all operations
router.get('/', async (req, res) => {
  const foundOperation = await Operation.find({}).populate(
    'patientID nursesID surgeonID'
  );
  res.send(foundOperation);
});

// Read one operation
router.get('/:_id', async (req, res) => {
  const foundOperation = await Operation.findById(req.params._id).populate(
    'patientID nursesID surgeonID'
  );
  if (!foundOperation) {
    res.status(404).send({ message: 'Operation not found' });
    return;
  }
  res.send(foundOperation);
});

// Find operation by room and date
router.get('/:room/:date', async (req, res) => {
  const { room, date } = req.params;
  const foundOperation = await Operation.findOne({
    operatingRoom: room,
    date: date,
  }).populate('patientID nursesID surgeonID');
  if (!foundOperation) {
    res.status(404).send({ message: 'Operation not found' });
    return;
  }
  res.send(foundOperation);
});

// Find operation by staff and date
router.get('/search/:role/:id/:date', async (req, res) => {
  const { role, id, date } = req.params;
  // const id = `61c573b00e7ab648c11bf644`;
  const staff = await Staff.findById(id);

  if (role === 'Doctor') {
    const foundOperation = await Operation.findOne({
      surgeonID: staff,
      date: date,
    });
    if (!foundOperation) {
      res.send({ message: 'Not found' });
      return;
    }
    return res.send(foundOperation);
  } else if (role === 'Nurse') {
    const foundOperation = await Operation.findOne({
      nursesID: staff,
      date: date,
    });
    if (!foundOperation) {
      res.send({ message: 'Not found' });
      return;
    }
    return res.send(foundOperation);
  } else {
    return res.send({ message: 'Not found' });
  }
});

// Update one operation
router.put('/:_id', async (req, res) => {
  try {
    const foundOperation = await Operation.findOne({
      operatingRoom: req.body.operatingRoom,
      date: req.body.date,
    });
    if (foundOperation._id === req.params._id) {
      const updateOperation = await Operation.findByIdAndUpdate(
        req.params._id,
        req.body,
        { new: true }
      );
      res.send(updateOperation);
      return;
    } else {
      res
        .status(403)
        .send({ message: 'Operation room not available on selected date' });
      return;
    }
  } catch {
    res.status(500).send({ message: 'Unexpected Error' });
    return;
  }
});

// Delete all operations
router.delete('/cleardata', async (req, res) => {
  await Operation.deleteMany();
  res.send('Operation database cleared');
});

// Delete one operation
router.delete('/:_id', async (req, res) => {
  const deleteOperation = await Operation.findByIdAndDelete(req.params._id);
  if (!deleteOperation) {
    res
      .status(400)
      .send({ message: 'Operation not found, deletion unsuccessful' });
    return;
  }
  res.send(deleteOperation);
});

// Seed operations
const operationData = require('../models/seedOperation');
router.post('/seed', async (req, res) => {
  const operationSeeds = await Operation.create(operationData);
  res.send(operationSeeds);
});

module.exports = router;
