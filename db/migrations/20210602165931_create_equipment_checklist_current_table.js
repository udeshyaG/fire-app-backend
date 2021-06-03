const tableNames = require('../../src/constants/table-names');

exports.up = async (knex) => {
  await knex.schema.createTable(
    tableNames.equipmentChecklistCurrent,
    (table) => {
      table
        .integer('equipment_id')
        .notNullable()
        .references('id')
        .inTable(tableNames.equipmentObject)
        .onDelete('CASCADE');

      table.string('check_name', 20).notNullable();
      table.integer('current_value').notNullable();

      table.primary(['equipment_id', 'check_name']);
    }
  );
};

exports.down = async (knex) => {
  await knex.schema.dropTable(tableNames.equipmentChecklistCurrent);
};
