const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const knex = require('../knex-init');

const tableNames = require('../constants/table-names');

// Sign In for Engineers
router.post(
  '/engineer/signin',
  [
    body('loginId').isString().withMessage('Enter Engineer id'),
    body('password').isLength({ min: 4 }).withMessage('Enter password'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // Check if req is correct
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    // Check if userid and pass present in db
    const existingEng = await knex(tableNames.engineers).select().where({
      eng_id: req.body.loginId,
      password: req.body.password,
    });

    if (existingEng.length === 0) {
      return res.status(401).send({ error: 'Not Authorized' });
    }

    const userJWT = jwt.sign(
      {
        engid: existingEng[0].eng_id,
        floorNumber: existingEng[0].floor_number,
      },
      process.env.JWT_KEY
    );

    req.session = {
      jwt: userJWT,
    };

    res.send(existingEng[0]);
  }
);

// login for the admin
router.post(
  '/admin/signin',
  [
    body('loginId').isString().withMessage('Enter Admin id'),
    body('password').isLength({ min: 4 }).withMessage('Enter password'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // Check if req is correct
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    const { loginId, password } = req.body;

    if (loginId !== 'admin' || password != 'password') {
      return res.status(401).send({ error: 'Not Authorized' });
    }

    const userJWT = jwt.sign(
      {
        adminId: loginId,
      },
      process.env.JWT_KEY
    );

    req.session = {
      jwt: userJWT,
    };

    res.send({ msg: 'Login successful! Welcome admin' });
  }
);

// Signout route
router.post('/engineer/signout', (req, res) => {
  req.session = null;

  res.send({});
});

router.post('/admin/signout', (req, res) => {
  req.session = null;

  res.send({});
});

module.exports = router;
