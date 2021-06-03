const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const checkUserLogin = require('../middlewares/check-user-login');
const knex = require('../knex-init');
const tableNames = require('../constants/table-names');

router.post(
  '/users/signup',
  [
    body('companyId').isString().withMessage('Company id required'),
    body('name').isString().withMessage('Name is required'),
    body('phoneNumber').isInt().withMessage('Phone Number is required'),
    body('password').isString().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // Check if req is correct
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
      const { companyId, name, phoneNumber, password } = req.body;

      await knex(tableNames.users).insert({
        company_id: companyId,
        name: name,
        phone_number: phoneNumber,
        password: password,
      });

      res.send({ msg: 'Your signin request is pending' });
    } catch (error) {
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
);

router.post(
  '/users/signin',
  [
    body('companyId').isString().withMessage('Company id required'),

    body('password').isString().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // Check if req is correct
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
      const { companyId, password } = req.body;

      const user = await knex(tableNames.users)
        .select()
        .where({ company_id: companyId, password: password });

      if (user.length === 0) {
        return res.status(400).send({
          accessGranted: false,
          error: 'Given user does not exist.',
        });
      } else if (user[0].status === 'rejected') {
        return res.status(400).send({
          accessGranted: false,
          error: 'Your request was rejected',
        });
      } else if (user[0].status === 'pending') {
        return res.status(400).send({
          accessGranted: false,
          error: 'Your request is pending',
        });
      } else if (user[0].status === 'approved') {
        const userJWT = jwt.sign(
          {
            companyId: user[0].company_id,
            name: user[0].name,
            phoneNumber: user[0].phone_number,
          },
          process.env.JWT_KEY
        );

        req.session = {
          jwt: userJWT,
        };

        return res.send(user[0]);
      }

      res.status(500).send({ error: 'Something went wrong' });
    } catch (error) {
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
);

router.post('/users/signout', (req, res) => {
  req.session = null;

  res.send({});
});

// The user can submit a complaint
router.post(
  '/users/add-complaint',
  checkUserLogin,
  [
    body('equipmentId').isInt().withMessage('Equipment Id is required'),
    body('floorNumber').isInt().withMessage('Floor Number is required'),
    body('complaintText').isString().withMessage('Complaint Text is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // Check if req is correct
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
      const { equipmentId, floorNumber, complaintText } = req.body;
      const { companyId } = req.currentuser;

      await knex(tableNames.userComplaints).insert({
        user_id: companyId,
        equipment_id: equipmentId,
        floor_number: floorNumber,
        complaint_text: complaintText,
      });

      res.send({ msg: 'Your complaint was logged successfully' });
    } catch (error) {
      return res.status(500).send({ error: 'Something went wrong' });
    }
  }
);

// User can add photo for a particular complaint

module.exports = router;
