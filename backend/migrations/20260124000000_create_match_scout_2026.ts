import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists("match_scouting_entries")
    .createTable("match_scouting_entries", (table) => {
      table.increments("id").notNullable();
      table.text("event_key").notNullable();
      table.tinyint("match_level").notNullable().unsigned();
      table.tinyint("match_number").notNullable().unsigned();
      table.boolean("is_blue").notNullable();
      table.tinyint("ds_position").notNullable().unsigned();
      table.smallint("team_number").notNullable().unsigned();
      table.text("scouter_name").notNullable();
      // starting_pos: Left=0, Middle=1, Right=2
      table.tinyint("starting_pos").notNullable().unsigned();
      table.tinyint("auto_fuel").notNullable().unsigned();
      table.boolean("auto_climb").notNullable();
      table.tinyint("cycles").notNullable().unsigned();
      table.tinyint("fuel_score").notNullable().unsigned();
      table.boolean("passing").notNullable();
      // climb: L1=0, L2=1, L3=2, None=3
      table.tinyint("climb").notNullable().unsigned();
      table.tinyint("zone_play").notNullable().unsigned();
      table.tinyint("bump_rank").notNullable().unsigned();
      table.tinyint("drive_rank").notNullable().unsigned();
      table.tinyint("defense_rank").notNullable().unsigned();
      table.boolean("breakdown").notNullable();
      table.text("comments").notNullable();
      table.datetime("scouted_time").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("match_scouting_entries");
}
