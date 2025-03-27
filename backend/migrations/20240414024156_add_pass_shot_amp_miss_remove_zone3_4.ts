import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // drop zone 3 and 4 from teleop
  // add amp misses
  // add notes passed
  return knex.schema.alterTable("match_scouting_entries", (table) => {
    table.dropColumns("zone3_shot_made", "zone3_shot_miss", "zone4_shot_made", "zone4_shot_miss");
    table.tinyint("amp_miss").unsigned().notNullable().defaultTo(0);
    table.tinyint("pass_note").unsigned().notNullable().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("match_scouting_entries", (table) => {
    table.dropColumns("pass_note", "amp_miss");
    table.tinyint("zone3_shot_made").notNullable().unsigned().defaultTo(0);
    table.tinyint("zone3_shot_miss").notNullable().unsigned().defaultTo(0);
    table.tinyint("zone4_shot_made").notNullable().unsigned().defaultTo(0);
    table.tinyint("zone4_shot_miss").notNullable().unsigned().defaultTo(0);
  });
}
