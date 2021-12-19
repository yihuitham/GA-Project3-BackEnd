const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Operation = require('../models/operation');

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
