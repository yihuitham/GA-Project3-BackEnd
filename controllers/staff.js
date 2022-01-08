require('dotenv').config();
const jwt = require('express-jwt');
const jwtDecode = require('jwt-decode');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Staff = require('../models/staff');

// attach user to the Request object/api
// const attachUser = (req, res, next) => {
//   const token = req.headers.authorization;
//   if (!token) {
//     return res.status(401).json({ message: 'Authentication invalid' });
//   }

//   const decodedToken = jwtDecode(token.slice(7));

//   if (!decodedToken) {
//     return res
//       .status(401)
//       .json({ message: 'There was a problem authorizing the request' });
//   } else {
//     req.user = decodedToken;
//     next();
//   }
// };

// router.use(attachUser);

// add JWT verification middleware, to check the token send from client to the server before sending back the data
// const checkJWT = jwt({
//   secret: process.env.JWT_SECRET,
//   iss: 'api.hospital',
//   aud: 'api.hospital',
//   algorithms: ['HS256'],
// });

// test route
router.get('/', async (req, res) => {
  console.log(req.user);
  return res.send('staff dashboard data');
});

// read all staff data
router.get('/all', async (req, res) => {
  const allStaffs = await Staff.find();
  return res.send(allStaffs);
});

// read all nurses data
router.get('/nurses', async (req, res) => {
  const allNurses = await Staff.find({ role: 'Nurse' });
  return res.send(allNurses);
  // console.log(req.user);
  // return res.send('staff dashboard data');
});

// read all surgeons data
router.get('/surgeons', async (req, res) => {
  const allSurgeons = await Staff.find({ role: 'Surgeon' });
  return res.send(allSurgeons);
  // console.log(req.user);
  // return res.send('staff dashboard data');
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

//clear staff data
router.delete('/cleardata', async (req, res) => {
  await Staff.deleteMany();
  res.send('Staff database cleared');
});

//seed staff
const staffData = require('../models/seedStaff');
router.post('/seed', async (req, res) => {
  staffData.forEach((user) => {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
  });
  const seedData = await Staff.create(staffData);
  res.send(seedData);
});

module.exports = router;
