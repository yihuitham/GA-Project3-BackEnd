const express = require('express');
const router = express.Router();
const Operation = require('../models/operation');

//Create Request
router.post('/', async (req, res) => {
  const newOperation = await Operation.create(req.body);
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

//Update Request

//Delete Request

module.exports = router;
