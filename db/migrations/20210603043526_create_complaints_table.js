const tableNames = require('../../src/constants/table-names');

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.userComplaints, (table) => {
    table.increments().notNullable();

    table
      .string('user_id')
      .notNullable()
      .references('company_id')
      .inTable(tableNames.users)
      .onDelete('CASCADE');

    table
      .integer('equipment_id')
      .notNullable()
      .references('id')
      .inTable(tableNames.equipmentObject)
      .onDelete('CASCADE');

    table.integer('floor_number').notNullable();

    table.text('complaint_text');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable(tableNames.userComplaints);
};
