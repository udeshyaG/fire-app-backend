const tableNames = require('../../src/constants/table-names');

exports.up = async (knex) => {
  await knex.schema.table(tableNames.equipmentObject, function (table) {
    table.string('wifi_ip');
  });
};

exports.down = async (knex) => {
  await knex.schema.table(tableNames.equipmentObject, function (table) {
    table.dropColumn('wifi_ip');
  });
};
