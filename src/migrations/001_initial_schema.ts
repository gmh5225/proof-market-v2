import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createSchemaIfNotExists('public')
	if (!(await knex.schema.hasTable('user'))) {
		await knex.schema.createTable('user', function(table) {
			table.increments('id').primary()
			table.timestamp('created_at').notNullable()
			table.timestamp('updated_at').notNullable()
			table.text('login').unsigned().notNullable().unique()
			table.text('email').unsigned().unique()
			table.text('password').unsigned().notNullable()
			table.bigint('balance').unsigned().notNullable().defaultTo(0)
			table.boolean('producer').notNullable().defaultTo(false)
		});
	}

	if (!(await knex.schema.hasTable('transaction'))) {
		await knex.schema.createTableIfNotExists('transaction', table => {
			table.increments('id').primary()
			table.timestamp('created_at').notNullable()
			table.timestamp('updated_at').notNullable()
			table.integer('sender_id').notNullable()
			table.integer('receiver_id').notNullable()
			table.float('amount').notNullable()

			table.foreign('sender_id').references('id').inTable('user')
			table.foreign('receiver_id').references('id').inTable('user')
		})
	}

	if (!(await knex.schema.hasTable('producer'))) {
		await knex.schema.createTableIfNotExists('producer', table => {
			table.increments('id').primary()
			table.timestamp('created_at').notNullable()
			table.timestamp('updated_at').notNullable()
			table.integer('user_id').notNullable()
			table.text('description')
			table.text('url').notNullable()
			table.text('eth_address')
			table.text('name')
			table.timestamp('last_assigned')

			table.foreign('user_id').references('id').inTable('user')
		})
	}

	if (!(await knex.schema.hasTable('statement'))) {
		await knex.schema.createTableIfNotExists('statement', table => {
			table.increments('id').primary()
			table.timestamp('created_at').notNullable()
			table.timestamp('updated_at').notNullable()
			table.text('name').notNullable()
			table.text('description').notNullable()
			table.text('url').notNullable()
			table.text('input_description').notNullable()
			table.jsonb('definition').notNullable()
			table.text('type').notNullable()
			table.boolean('private').notNullable()
			table.integer('sender_id').notNullable()
			table.boolean('monitoring').notNullable()
			table.boolean('completed').notNullable()
			table.float('avg_generation_time').notNullable()
			table.float('avg_cost')

			table.foreign('sender_id').references('id').inTable('user')
		})
	}

	if (!(await knex.schema.hasTable('proof'))) {
		await knex.schema.createTableIfNotExists('proof', table => {
			table.increments('id').primary()
			table.timestamp('created_at').notNullable()
			table.timestamp('updated_at').notNullable()
			table.text('proof').notNullable()
			table.float('generation_time').notNullable()
			table.integer('producer_id')
			table.integer('request_id')
		})
	}

	if (!(await knex.schema.hasTable('request'))) {
		await knex.schema.createTableIfNotExists('request', table => {
			table.increments('id').primary()
			table.timestamp('created_at').notNullable()
			table.timestamp('updated_at').notNullable()
			table.integer('statement_id').unsigned().notNullable()
			table.float('cost').notNullable()
			table.float('eval_time')
			table.float('wait_period')
			table.jsonb('input').notNullable()
			table.integer('sender_id').notNullable()
			table.text('status').notNullable()
			table.integer('proof_id')
			table.integer('assigned_id') //TEMP
			table.integer('aggregated_mode_id')

			table.foreign('statement_id').references('id').inTable('statement')
			table.foreign('sender_id').references('id').inTable('user')
			table.foreign('proof_id').references('id').inTable('proof')
		})
	}

	if (!(await knex.schema.hasTable('request_log'))) {
		await knex.schema.createTableIfNotExists('request_log', table => {
			table.increments('id').primary()
			table.timestamp('created_at').notNullable()
			table.timestamp('updated_at').notNullable()
			table.integer('request_id').notNullable()
			table.text('status').notNullable()

			table.foreign('request_id').references('id').inTable('request')
		})
	}

	if (!(await knex.schema.hasTable('proposal'))) {
		await knex.schema.createTableIfNotExists('proposal', table => {
			table.increments('id').primary()
			table.timestamp('created_at').notNullable()
			table.timestamp('updated_at').notNullable()
			table.integer('statement_id').notNullable()
			table.float('cost').notNullable()
			table.integer('sender_id').notNullable()
			table.float('wait_period').notNullable()
			table.float('eval_time').notNullable()
			table.text('status').notNullable()
			table.timestamp('matched_time')
			table.integer('request_id')
			table.integer('proof_id')
			table.float('generation_time').notNullable()
			table.integer('aggregated_mode_id')

			table.foreign('statement_id').references('id').inTable('statement')
			table.foreign('sender_id').references('id').inTable('user')
			table.foreign('proof_id').references('id').inTable('proof')
			table.foreign('request_id').references('id').inTable('request')
		})
	}

	if (!(await knex.schema.hasTable('proposal_log'))) {
		await knex.schema.createTableIfNotExists('proposal_log', table => {
			table.increments('id').primary()
			table.timestamp('created_at').notNullable()
			table.timestamp('updated_at').notNullable()
			table.integer('proposal_id').unsigned().notNullable()
			table.text('status').notNullable()

			table.foreign('proposal_id').references('id').inTable('proposal')
		})
	}

	if (!(await knex.schema.hasTable('request_proposal'))) {
		await knex.schema.createTableIfNotExists('request_proposal', function (table) {
			table.increments('id').primary()
			table.timestamp('createdAt').notNullable()
			table.timestamp('updatedAt').notNullable()
			table.integer('statement_id').notNullable()
			table.text('name').notNullable()
			table.float('cost').notNullable()
			table.integer('request_id').unsigned().notNullable()
			table.integer('proposal_id').unsigned().notNullable()

			table.foreign('request_id').references('id').inTable('request')
			table.foreign('proposal_id').references('id').inTable('proposal')
		})
	}
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropSchemaIfExists('public', true)
}
