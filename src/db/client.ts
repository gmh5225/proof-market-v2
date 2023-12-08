import {knex, Knex} from "knex";
import {dbUrl} from "../config/props";

const config: Knex.Config = {
    client: 'pg',
    connection: dbUrl,
    migrations: {
        tableName: 'migrations',
        directory: './dist/migrations'
    }
};

export const dbClient = knex(config)
