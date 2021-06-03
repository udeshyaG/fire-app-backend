const tableNames = require('../../src/constants/table-names');

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.equipmentTypes, (table) => {
    table.increments().notNullable();

    table.string('name', 20).notNullable();
    table.string('company', 20).notNullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable(tableNames.equipmentTypes);
};
