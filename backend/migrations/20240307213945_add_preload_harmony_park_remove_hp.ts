import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("match_scouting_entries", (table) => {
    table.boolean("pre_load_score").notNullable().defaultTo(false);
    table.boolean("parked").notNullable().defaultTo(false);
    table.boolean("harmony").notNullable().defaultTo(false);
  });
  await knex.table("match_scouting_entries").update({
    harmony: knex.raw("?? >= ?", [knex.ref("climb_order"), 2])
  });
  return knex.schema.alterTable("match_scouting_entries", (table) => {
    table.dropColumns("piece_stolen", "wait_time", "climb_order", "spot_try", "spot_made_amp", "spot_made_source", "spot_made_center");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("match_scouting_entries", (table) => {
    table.tinyint("piece_stolen").notNullable().unsigned().defaultTo(0);
    table.double("wait_time").notNullable().unsigned().defaultTo(0.0);
    table.tinyint("climb_order").notNullable().unsigned().defaultTo(0);
    table.tinyint("spot_try").notNullable().unsigned().defaultTo(0.0);
    table.boolean("spot_made_amp").notNullable().defaultTo(false);
    table.boolean("spot_made_source").notNullable().defaultTo(false);
    table.boolean("spot_made_center").notNullable().defaultTo(false);
  });
  await knex.table("match_scouting_entries").update({
    climb_order: 2
  }).where("harmony", true);
  return knex.schema.alterTable("match_scouting_entries", (table) => {
    table.dropColumns("pre_load_score", "parked", "harmony");
  });
}
