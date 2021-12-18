const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Operation = require('../models/operation');

//Create Request
router.post('/', async (req, res) => {
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
  //   try {
  //     const foundOperation = await Operation.findOne({
  //       operation_id: req.body.operation_id,
  //     });
  //     if (!foundOperation) {
  //       const newOperation = await Operation.create(req.body);
  //       res.send(newOperation);
  //     } else {
  //       res.status(403).send({ message: 'Operation ID already exist' });
  //       return;
  //     }
  //   } catch {
  //     res.status(500).send({ message: 'Unexpected Error' });
  //     return;
  //   }
});

//Read Request
router.get('/', async (req, res) => {
  const foundOperation = await Operation.find({}).populate(
    'patientID nursesID surgeonID'
  );
  res.send(foundOperation);
});

//Update Request

//Delete Request

//clear staff data
router.delete('/cleardata', async (req, res) => {
  await Operation.deleteMany();
  res.send('Operation database cleared');
});

//seed staff
const operationData = require('../models/seedOperation');
router.post('/seed', (req, res) => {
  Operation.create(operationData);
});

module.exports = router;
