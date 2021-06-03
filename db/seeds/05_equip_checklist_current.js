const tableNames = require('../../src/constants/table-names');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tableNames.equipmentChecklistCurrent)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(tableNames.equipmentChecklistCurrent).insert([
        {
          equipment_id: 1,
          check_name: 'Pressure',
          current_value: 49,
        },
        {
          equipment_id: 1,
          check_name: 'Volume',
          current_value: 60,
        },
      ]);
    });
};
