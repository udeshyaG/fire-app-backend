const tableNames = require('../../src/constants/table-names');

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.equipmentObject, (table) => {
    table.increments().notNullable();

    table
      .integer('equipment_type_id')
      .notNullable()
      .references('id')
      .inTable(tableNames.equipmentTypes)
      .onDelete('CASCADE');

    table.integer('floor_number').notNullable();

    table.string('last_date_checked', 50).notNullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable(tableNames.equipmentObject);
};
