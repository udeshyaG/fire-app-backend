const tableNames = require('../../src/constants/table-names');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tableNames.equipmentTypes)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(tableNames.equipmentTypes).insert([
        {
          id: 4,
          name: 'Fire Extinguisher',
          company: 'Nice Comp',
        },
        {
          id: 5,
          name: 'Sprinkler',
          company: 'Nice Comp',
        },
      ]);
    });
};
