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
      table.tinyint("starting_pos").notNullable().unsigned();
      table.boolean("mobility").notNullable();
      table.tinyint("defense").notNullable();
      table.text("comments").notNullable();
      table.datetime("ScoutedTime").notNullable();
      table.tinyint("Level1").notNullable().unsigned();
      table.tinyint("Level2").notNullable().unsigned();
      table.tinyint("Level3").notNullable().unsigned();
      table.tinyint("Level4").notNullable().unsigned();
      table.tinyint("auto_algae").notNullable().unsigned();
      table.boolean("tele_algae").notNullable();
      table.tinyint("tele_Level1").notNullable().unsigned();
      table.tinyint("tele_Level2").notNullable().unsigned();
      table.tinyint("tele_Level3").notNullable().unsigned();
      table.tinyint("tele_Level4").notNullable().unsigned();
      table.tinyint("robo_barge_score").notNullable().unsigned();
      table.tinyint("processor_scored").notNullable().unsigned();
      table.tinyint("climb").notNullable().unsigned();
      table.tinyint("driver_rank").notNullable().unsigned();
      table.boolean("breakdown").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("match_scouting_entries");
}