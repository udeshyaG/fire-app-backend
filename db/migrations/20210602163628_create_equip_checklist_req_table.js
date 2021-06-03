const tableNames = require('../../src/constants/table-names');

exports.up = async (knex) => {
  await knex.schema.createTable(
    tableNames.equipmentChecklistRequired,
    (table) => {
      table
        .integer('equipment_type_id')
        .notNullable()
        .references('id')
        .inTable(tableNames.equipmentTypes)
        .onDelete('CASCADE');

      table.string('check_name', 20).notNullable();
      table.integer('required_value').notNullable();

      table.primary(['equipment_type_id', 'check_name']);
    }
  );
};

exports.down = async (knex) => {
  await knex.schema.dropTable(tableNames.equipmentChecklistRequired);
};
