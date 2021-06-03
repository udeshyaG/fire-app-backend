const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const checkAdminLogin = require('../middlewares/check-admin-login');
const knex = require('../knex-init');
const tableNames = require('../constants/table-names');

router.get('/admin/pending-user-signups', checkAdminLogin, async (req, res) => {
  const pendingUsers = await knex(tableNames.users)
    .select()
    .where({ status: 'pending' });

  res.send(pendingUsers);
});

router.patch(
  '/admin/change-status',
  checkAdminLogin,
  [
    body('newStatus').isString().withMessage('New status is required'),
    body('companyId').isString().withMessage('Company id is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // Check if req is correct
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
      await knex(tableNames.users)
        .select()
        .where({ company_id: req.body.companyId })
        .update('status', req.body.newStatus);

      res.send({ msg: 'User Status updated successfully' });
    } catch (error) {
      return res.status(500).send({ error: 'Something went wrong' });
    }
  }
);

module.exports = router;
