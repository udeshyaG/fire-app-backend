const express = require('express');
const { body, validationResult } = require('express-validator');
const checkEngineerLogin = require('../middlewares/check-engineer-login');
const knex = require('../knex-init');
const tableNames = require('../constants/table-names');

const router = express.Router();

// Create a new equipment (object)
router.post(
  '/equipment/new',
  // checkEngineerLogin,
  [
    body('id').isInt().withMessage('Id is required'),
    body('equipmentTypeId').isInt().withMessage('Equipment type is required'),
    body('floorNumber').isInt().withMessage('Floor no is required'),
    body('latitude').isString().withMessage('Latitude is required'),
    body('longitude').isString().withMessage('Latitude is required'),
    body('wifiIp').isString().withMessage('Wifi Ip is required'),
    body('lastDateChecked')
      .isString()
      .withMessage('Last Date checked is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // Check if req is correct
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
      await knex(tableNames.equipmentObject).insert({
        id: req.body.id,
        equipment_type_id: req.body.equipmentTypeId,
        floor_number: req.body.floorNumber,
        last_date_checked: req.body.lastDateChecked,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        wifi_ip: req.body.wifiIp,
      });

      res.send({ msg: 'Added new Equipment' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
);

// Remove an equipment because it is faulty
router.delete(
  '/equipment/remove',
  checkEngineerLogin,
  [body('id').isInt().withMessage('Id is required')],
  async (req, res) => {
    const errors = validationResult(req);
    // Check if req is correct
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
      await knex(tableNames.equipmentObject).del().where({
        id: req.body.id,
      });

      res.send({ msg: 'Removed Given Equipment' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
);

module.exports = router;
