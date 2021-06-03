const tableNames = require('../../src/constants/table-names');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tableNames.equipmentObject)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(tableNames.equipmentObject).insert([
        {
          id: 1,
          equipment_type_id: 4,
          floor_number: 1,
          last_date_checked: 'nicedate',
        },
        {
          id: 2,
          equipment_type_id: 4,
          floor_number: 1,
          last_date_checked: 'nicedate',
        },
        {
          id: 3,
          equipment_type_id: 4,
          floor_number: 1,
          last_date_checked: 'nicedate',
        },
        {
          id: 4,
          equipment_type_id: 5,
          floor_number: 2,
          last_date_checked: 'nicedate',
        },
      ]);
    });
};
