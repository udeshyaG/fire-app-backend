const tableNames = require('../../src/constants/table-names');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tableNames.equipmentChecklistRequired)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(tableNames.equipmentChecklistRequired).insert([
        {
          equipment_type_id: 4,
          check_name: 'Pressure',
          required_value: 50,
        },
        {
          equipment_type_id: 4,
          check_name: 'Volume',
          required_value: 60,
        },
        {
          equipment_type_id: 5,
          check_name: 'Pressure',
          required_value: 5,
        },
      ]);
    });
};
