const tableNames = require('../../src/constants/table-names');

exports.up = async (knex) => {
  await knex.schema.table(tableNames.equipmentObject, function (table) {
    table.string('latitude');
    table.string('longitude');
  });
};

exports.down = async (knex) => {
  await knex.schema.table(tableNames.equipmentObject, function (table) {
    table.dropColumn('latitude');
    table.dropColumn('longitude');
  });
};
