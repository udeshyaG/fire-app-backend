const tableNames = require('../../src/constants/table-names');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tableNames.engineers)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(tableNames.engineers).insert([
        {
          eng_id: '1',
          password: 'password',
          name: 'Dude One',
          floor_number: 1,
          phone_number: 123,
        },
        {
          eng_id: '2',
          password: 'password',
          name: 'Dude Two',
          floor_number: 2,
          phone_number: 124,
        },
      ]);
    });
};
