const tableNames = require('../../src/constants/table-names');

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.engineers, (table) => {
    table.string('eng_id', 20).notNullable().unique();
    table.string('password', 20).notNullable();
    table.string('name', 20).notNullable();
    table.integer('floor_number').notNullable();
    table.integer('phone_number').notNullable();

    table.primary('eng_id');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable(tableNames.engineers);
};
