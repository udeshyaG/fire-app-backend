const express = require('express');
const { body, validationResult } = require('express-validator');
const checkEngineerLogin = require('../middlewares/check-engineer-login');
const knex = require('../knex-init');
const tableNames = require('../constants/table-names');

const router = express.Router();

// Give me the equipment ID
// I will return the equipment details and required Checklist
router.get(
  '/equipment/req-check/:equipId',
  // checkEngineerLogin,
  async (req, res) => {
    const equipId = req.params.equipId;

    const equipmentDetails = await knex(tableNames.equipmentObject)
      .select()
      .where({
        id: equipId,
      });

    const requiredChecklist = await knex(tableNames.equipmentChecklistRequired)
      .select('check_name', 'required_value')
      .where({
        equipment_type_id: equipmentDetails[0].equipment_type_id,
      });

    const jsonResponse = {
      equipmentDetails: equipmentDetails[0],
      requiredChecklist: requiredChecklist,
    };

    res.send(jsonResponse);
  }
);

// Give me the equipment ID
// I will return the equipment details and current Checklist
router.get(
  '/equipment/current-check/:equipId',
  // checkEngineerLogin,
  async (req, res) => {
    const equipId = req.params.equipId;

    const equipmentDetails = await knex(tableNames.equipmentObject)
      .select()
      .where({
        id: equipId,
      });

    const currentChecklist = await knex(tableNames.equipmentChecklistCurrent)
      .select('check_name', 'current_value')
      .where({
        equipment_id: equipmentDetails[0].id,
      });

    const jsonResponse = {
      equipmentDetails: equipmentDetails[0],
      currentChecklist: currentChecklist,
    };

    res.send(jsonResponse);
  }
);

// an engineer belongs to a particular floor
// he visits this route to get required values of all equipments in his floor
router.get('/equipment/all/req-check', checkEngineerLogin, async (req, res) => {
  const floorNumber = req.currenteng.floorNumber;

  const equipmentList = await knex(tableNames.equipmentObject).select().where({
    floor_number: floorNumber,
  });

  // res.send(equipmentList);

  const jsonResponse = {
    floorNumber: floorNumber,
  };

  equipmentList.forEach((equip) => {
    jsonResponse[equip.id] = {
      equipmentType: equip.equipment_type_id,
      lastDateChecked: equip.last_date_checked,
      latitude: equip.latitude,
      longitude: equip.longitude,
    };
  });

  console.log(equipmentList);

  for (let i = 0; i < equipmentList.length; i++) {
    const requiredChecklist = await knex(tableNames.equipmentChecklistRequired)
      .select('check_name', 'required_value')
      .where({
        equipment_type_id: equipmentList[i].equipment_type_id,
      });

    jsonResponse[equipmentList[i].id].requiredCheckList = requiredChecklist;
  }

  res.send(jsonResponse);
});

// if Engineer visits this route to get CURRENT values of all equipments in his floor
router.get(
  '/equipment/all/current-check',
  checkEngineerLogin,
  async (req, res) => {
    const floorNumber = req.currenteng.floorNumber;

    const equipmentList = await knex(tableNames.equipmentObject)
      .select()
      .where({
        floor_number: floorNumber,
      });

    const jsonResponse = {
      floorNumber: floorNumber,
    };

    equipmentList.forEach((equip) => {
      jsonResponse[equip.id] = {
        equipmentType: equip.equipment_type_id,
        lastDateChecked: equip.last_date_checked,
        latitude: equip.latitude,
        longitude: equip.longitude,
      };
    });

    for (let i = 0; i < equipmentList.length; i++) {
      const currentChecklist = await knex(tableNames.equipmentChecklistCurrent)
        .select('check_name', 'current_value')
        .where({
          equipment_id: equipmentList[i].id,
        });

      jsonResponse[equipmentList[i].id].currentChecklist = currentChecklist;
    }

    res.send(jsonResponse);
  }
);

// updates the current values of all checks
// give me an array of all checks to be updated
// eg. [{checkName: pressure, value: 20}, {check: weight, value: 30}, ...]
router.patch(
  '/equipment/current',
  checkEngineerLogin,
  [
    body('equipId').isInt().withMessage('Equipment id is required'),
    body('checksArr').isArray().withMessage('Checks array is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // Check if req is correct
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    const checksArr = req.body.checksArr;

    try {
      await checksArr.forEach(async (item) => {
        console.log(item);
        await knex(tableNames.equipmentChecklistCurrent)
          .select()
          .where({
            equipment_id: req.body.equipId,
            check_name: item.checkName,
          })
          .update('current_value', item.value);
      });

      res.send({ msg: 'Successfully updated' });
    } catch (error) {
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
);

module.exports = router;
