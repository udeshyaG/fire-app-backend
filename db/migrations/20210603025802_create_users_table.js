const tableNames = require('../../src/constants/table-names');

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.users, (table) => {
    table.string('company_id').notNullable().unique();
    table.integer('phone_number');
    table.string('name').notNullable();
    table.string('password').notNullable();
    table.string('status', 20).defaultTo('pending');

    table.primary('company_id');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable(tableNames.users);
};
