import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('proof', table => {
        table.increments('id');
        table.string('proof').notNullable();
        table.timestamp('created_at').notNullable();
        table.timestamp('updated_at');
    });

    await knex.schema.createTable('worker', table => {
        table.increments('id');
        table.float('rating').notNullable();
        table.integer('capacity').unsigned().notNullable();
        table.timestamp('created_at').notNullable();
        table.timestamp('updated_at');
    });

    await knex.schema.createTable('bid_status', table => {
        table.increments('id');
        table.string('name').notNullable();
        table.timestamp('created_at').notNullable();
        table.timestamp('updated_at');
    });

    await knex.schema.createTable('ask_status', table => {
        table.increments('id');
        table.string('name').notNullable();
        table.timestamp('created_at').notNullable();
        table.timestamp('updated_at');
    });

    await knex.schema.createTable('statement', table => {
        table.increments('id').notNullable();
        table.string('description').notNullable();
        table.string('input_description').notNullable();
        table.timestamp('created_at').notNullable();
        table.timestamp('updated_at');
    });

    await knex.schema.createTable('statement_hierarchy', table => {
        table.increments('id');
        table.integer('statement_id').unsigned().notNullable();
        table.integer('child_id').unsigned();
        table.timestamp('created_at').notNullable();
        table.timestamp('updated_at');

        table.foreign('statement_id').references('id').inTable('statement');
    });

    await knex.schema.createTable('bid', table => {
        table.increments('id');
        table.integer('parent_id');
        table.boolean('is_parent').notNullable();
        table.integer('evaluation_time').unsigned().notNullable();
        table.string('sender').notNullable();
        table.integer('statement_id').unsigned().notNullable();
        table.string('input').notNullable();
        table.integer('cost').unsigned().notNullable();
        table.integer('status_id').unsigned().notNullable();
        table.integer('proof_id').unsigned();
        table.timestamp('created_at').notNullable();
        table.timestamp('updated_at');

        table.foreign('statement_id').references('id').inTable('statement');
        table.foreign('status_id').references('id').inTable('bid_status');
        table.foreign('parent_id').references('id').inTable('bid');
        table.foreign('proof_id').references('id').inTable('proof');
    });

    await knex.schema.createTable('bid_log', table => {
        table.increments('id');
        table.integer('bid_id').unsigned().notNullable();
        table.integer('status_id').unsigned().notNullable();
        table.timestamp('created_at').notNullable();
        table.timestamp('updated_at');

        table.foreign('bid_id').references('id').inTable('bid');
        table.foreign('status_id').references('id').inTable('bid_status');
    });

    await knex.schema.createTable('ask', table => {
        table.increments('id');
        table.integer('worker_id').unsigned().notNullable();
        table.integer('statement_id').unsigned().notNullable();
        table.integer('status_id').unsigned().notNullable();
        table.integer('generation_time').unsigned();
        table.integer('cost').unsigned();
        table.timestamp('created_at').notNullable();
        table.timestamp('updated_at');

        table.foreign('worker_id').references('id').inTable('worker');
        table.foreign('statement_id').references('id').inTable('statement');
        table.foreign('status_id').references('id').inTable('ask_status');
    });

    await knex.schema.createTable('ask_log', table => {
        table.increments('id');
        table.integer('ask_id').unsigned().notNullable();
        table.integer('status_id').unsigned().notNullable();
        table.timestamp('created_at').notNullable();
        table.timestamp('updated_at');

        table.foreign('ask_id').references('id').inTable('ask');
        table.foreign('status_id').references('id').inTable('ask_status');
    });

    await knex.schema.createTable('bid_ask', function(table) {
        table.increments('id');
        table.integer('ask_id').unsigned().notNullable();
        table.integer('bid_id').unsigned().notNullable();
        table.timestamp('created_at').notNullable();
        table.timestamp('updated_at');

        table.foreign('ask_id').references('id').inTable('ask');
        table.foreign('bid_id').references('id').inTable('bid');
    });

    await knex.schema.createTable('user',  function(table) {
        table.increments('id');
        table.integer('login').unsigned().notNullable();
        table.integer('password').unsigned().notNullable();
        table.timestamp('created_at').notNullable();
        table.timestamp('updated_at');
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('ask');
    await knex.schema.dropTableIfExists('worker');
    await knex.schema.dropTableIfExists('proof');
    await knex.schema.dropTableIfExists('ask_log');
    await knex.schema.dropTableIfExists('bid_ask');
    await knex.schema.dropTableIfExists('bid');
    await knex.schema.dropTableIfExists('statement');
    await knex.schema.dropTableIfExists('ask_status');
    await knex.schema.dropTableIfExists('bid_status');
    await knex.schema.dropTableIfExists('bid_log');
    await knex.schema.dropTableIfExists('statement_hierarchy');
}
