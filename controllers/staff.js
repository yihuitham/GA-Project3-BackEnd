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
router.post('/new', async (req, res) => {
  try {
    const foundNRIC = await Staff.findOne({ NRIC: req.body.NRIC });
    const foundLoginID = await Staff.findOne({ loginID: req.body.loginID });

    if (!foundNRIC && !foundLoginID) {
      const loginID = req.body.loginID;
      const password = await bcrypt.hash(req.body.password, 10);
      const NRIC = req.body.NRIC;
      const name = req.body.name;
      const gender = req.body.gender;
      const contact = req.body.contact;
      const role = req.body.role;
      const speciality = req.body.speciality;

      if (
        loginID.length < 3 ||
        password.length < 3 ||
        NRIC.length < 3 ||
        name.length < 3 ||
        gender.length < 1 ||
        !parseInt(contact) ||
        contact.length < 3 ||
        role.length < 3 ||
        speciality.length < 3
      ) {
        res.status(403).send({ message: 'Invalid input!' });
        return;
      }

      const newStaff = await Staff.create({
        loginID,
        password,
        NRIC,
        name,
        gender,
        contact,
        role,
        speciality,
      });

      res.status(200).send({ message: 'New user is added successfully!' });
    } else if (foundNRIC || foundLoginID) {
      res.status(403).send({ message: 'Staff ID already exist!' });
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
      res.status(403).send({ message: 'Staff ID/NRIC already exist!' });
      return;
    }
  } catch {
    res.status(500).send({ message: 'Unexpected Error' });
    return;
  }
});

// update staff details
router.post('/edit', async (req, res) => {
  console.log('req body', req.body);
  const foundStaff = await Staff.findById(req.body.id);
  console.log(foundStaff);
  try {
    const foundStaff = await Staff.findById(req.body.id);
    if (!foundStaff) {
      res.status(403).send({ message: 'Staff ID not found!' });
      return;
    } else {
      if (
        req.body.name.length < 3 ||
        req.body.gender.length < 1 ||
        !parseInt(req.body.contact) ||
        req.body.contact.length < 3 ||
        req.body.role.length < 3 ||
        req.body.speciality.length < 3
      ) {
        res.status(403).send({ message: 'Invalid input!' });
        return;
      }
      const updateStaff = await Staff.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        role: req.body.role,
        gender: req.body.gender,
        contact: req.body.contact,
        speciality: req.body.speciality,
      });
      res.status(200).send({ message: 'Staff details updated successfully!' });
      return;
    }
  } catch {
    res.status(500).send({ message: 'Unexpected Error' });
    return;
  }
});

// delete select staff
router.delete('/delete/:id', async (req, res) => {
  try {
    const deleteStaff = await Staff.findByIdAndRemove(req.params.id).exec();
    res.status(200).send({ message: 'Staff id delete!' });
    return;
  } catch (error) {
    res.status(500).send({ message: 'Unexpected Error' });
    return;
  }

  return;
  // await Staff.deleteMany();
  // res.send('Staff database cleared');
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
