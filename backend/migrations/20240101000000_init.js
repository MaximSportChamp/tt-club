export async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('vk_id').unique().notNullable();
    table.string('name');
    table.string('avatar');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('challenges', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description');
    table.integer('created_by').references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('votes', (table) => {
    table.increments('id').primary();
    table.integer('challenge_id').references('id').inTable('challenges');
    table.integer('user_id').references('id').inTable('users');
    table.integer('value');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('media', (table) => {
    table.increments('id').primary();
    table.string('url').notNullable();
    table.integer('challenge_id').references('id').inTable('challenges');
    table.integer('user_id').references('id').inTable('users');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('media');
  await knex.schema.dropTableIfExists('votes');
  await knex.schema.dropTableIfExists('challenges');
  await knex.schema.dropTableIfExists('users');
}
