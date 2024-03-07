import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable("ranking_entries")) return;
    return knex.schema.createTable("ranking_entries", (table) => {
        table.increments("id").notNullable();
        table.tinyint("better").unsigned().notNullable();
        table.tinyint("worse").unsigned().notNullable();
        table.tinyint("diff").unsigned().notNullable();
        table.tinyint("match").unsigned().notNullable()
        table.boolean("incap").notNullable();
        table.datetime("ScoutedTime").notNullable()
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("ranking_entries");
}

