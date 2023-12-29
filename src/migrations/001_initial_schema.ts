import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	if (!(await knex.schema.hasTable('user'))) {
		await knex.schema.createTable('user', function(table) {
			table.increments('id').primary()
			table.timestamp('createdAt').notNullable()
			table.timestamp('updatedAt').notNullable()
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
			table.timestamp('createdAt').notNullable()
			table.timestamp('updatedAt').notNullable()
			table.integer('senderId').notNullable()
			table.integer('receiverId').notNullable()
			table.float('amount').notNullable()

			table.foreign('senderId').references('id').inTable('user')
			table.foreign('receiverId').references('id').inTable('user')
		})
	}

	if (!(await knex.schema.hasTable('producer'))) {
		await knex.schema.createTableIfNotExists('producer', table => {
			table.increments('id').primary()
			table.timestamp('createdAt').notNullable()
			table.timestamp('updatedAt').notNullable()
			table.integer('userId').notNullable()
			table.text('description')
			table.text('url').notNullable()
			table.text('ethAddress')
			table.text('name')
			table.timestamp('lastAssigned')

			table.foreign('userId').references('id').inTable('user')
		})
	}

	if (!(await knex.schema.hasTable('statement'))) {
		await knex.schema.createTableIfNotExists('statement', table => {
			table.increments('id').primary()
			table.timestamp('createdAt').notNullable()
			table.timestamp('updatedAt').notNullable()
			table.text('name').notNullable()
			table.text('description').notNullable()
			table.text('url').notNullable()
			table.text('inputDescription').notNullable()
			table.jsonb('definition').notNullable()
			table.text('type').notNullable()
			table.boolean('private').notNullable()
			table.integer('senderId').notNullable()
			table.boolean('monitoring').notNullable()
			table.boolean('completed').notNullable()
			table.float('avgGenerationTime').notNullable()
			table.float('avgCost')

			table.foreign('senderId').references('id').inTable('user')
		})
	}

	if (!(await knex.schema.hasTable('proof'))) {
		await knex.schema.createTableIfNotExists('proof', table => {
			table.increments('id').primary()
			table.timestamp('createdAt').notNullable()
			table.timestamp('updatedAt').notNullable()
			table.text('proof').notNullable()
			table.float('generationTime').notNullable()
			table.integer('producerId')
			table.integer('requestId')
		})
	}

	if (!(await knex.schema.hasTable('request'))) {
		await knex.schema.createTableIfNotExists('request', table => {
			table.increments('id').primary()
			table.timestamp('createdAt').notNullable()
			table.timestamp('updatedAt').notNullable()
			table.integer('statementId').unsigned().notNullable()
			table.float('cost').notNullable()
			table.float('evalTime')
			table.float('waitPeriod')
			table.jsonb('input').notNullable()
			table.integer('senderId').notNullable()
			table.text('status').notNullable()
			table.integer('proofId')
			table.integer('assignedId') //TEMP

			table.foreign('statementId').references('id').inTable('statement')
			table.foreign('senderId').references('id').inTable('user')
			table.foreign('proofId').references('id').inTable('proof')
		})
	}

	if (!(await knex.schema.hasTable('requestLog'))) {
		await knex.schema.createTableIfNotExists('requestLog', table => {
			table.increments('id').primary()
			table.timestamp('createdAt').notNullable()
			table.timestamp('updatedAt').notNullable()
			table.integer('requestId').notNullable()
			table.text('status').notNullable()

			table.foreign('requestId').references('id').inTable('request')
		})
	}

	if (!(await knex.schema.hasTable('proposal'))) {
		await knex.schema.createTableIfNotExists('proposal', table => {
			table.increments('id').primary()
			table.timestamp('createdAt').notNullable()
			table.timestamp('updatedAt').notNullable()
			table.integer('statementId').notNullable()
			table.float('cost').notNullable()
			table.integer('senderId').notNullable()
			table.float('waitPeriod').notNullable()
			table.float('evalTime').notNullable()
			table.text('status').notNullable()
			table.timestamp('matchedTime')
			table.integer('proofId').notNullable()
			table.float('generationTime').notNullable()

			table.foreign('statementId').references('id').inTable('statement')
			table.foreign('senderId').references('id').inTable('user')
			table.foreign('proofId').references('id').inTable('proof')
		})
	}

	if (!(await knex.schema.hasTable('proposalLog'))) {
		await knex.schema.createTableIfNotExists('proposalLog', table => {
			table.increments('id').primary()
			table.timestamp('createdAt').notNullable()
			table.timestamp('updatedAt').notNullable()
			table.integer('proposalId').unsigned().notNullable()
			table.text('status').notNullable()

			table.foreign('proposalId').references('id').inTable('proposal')
		})
	}

	if (!(await knex.schema.hasTable('requestProposal'))) {
		await knex.schema.createTableIfNotExists('requestProposal', function (table) {
			table.increments('id').primary()
			table.timestamp('createdAt').notNullable()
			table.timestamp('updatedAt').notNullable()
			table.integer('statementId').notNullable()
			table.text('name').notNullable()
			table.float('cost').notNullable()
			table.integer('requestId').unsigned().notNullable()
			table.integer('proposalId').unsigned().notNullable()

			table.foreign('requestId').references('id').inTable('request')
			table.foreign('proposalId').references('id').inTable('proposal')
		})
	}
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('requestProposal')
	await knex.schema.dropTableIfExists('proposalLog')
	await knex.schema.dropTableIfExists('proposal')
	await knex.schema.dropTableIfExists('requestLog')
	await knex.schema.dropTableIfExists('request')
	await knex.schema.dropTableIfExists('statement')
	await knex.schema.dropTableIfExists('producer')
	await knex.schema.dropTableIfExists('proof')
	await knex.schema.dropTableIfExists('transaction')
	await knex.schema.dropTableIfExists('user')
}
