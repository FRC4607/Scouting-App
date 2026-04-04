import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("match_scouting_entries", (table) => {
    table.boolean("breakdown").notNullable().defaultTo(false);
  });
  await knex.schema.alterTable("pit_scouting_entries", (table) => {
    table.boolean("business_binder").notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("match_scouting_entries", (table) => {
    table.dropColumn("breakdown");
  });
  await knex.schema.alterTable("pit_scouting_entries", (table) => {
    table.dropColumn("business_binder");
  });
}
