import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("match_scouting_entries", (table) => {
    // Drop old columns
    table.dropColumn("starting_pos");
    table.dropColumn("auto_fuel");
    table.dropColumn("auto_climb");
    table.dropColumn("cycles");
    table.dropColumn("fuel_score");
    table.dropColumn("passing");
    table.dropColumn("climb");
    table.dropColumn("zone_play");
    table.dropColumn("bump_rank");
    table.dropColumn("drive_rank");
    table.dropColumn("breakdown");

    // Add new columns
    table.tinyint("auto_cycles").notNullable().unsigned().defaultTo(0);
    table.tinyint("teleop_cycles").notNullable().unsigned().defaultTo(0);
    table.tinyint("driver_rank").notNullable().unsigned().defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("match_scouting_entries", (table) => {
    // Drop new columns
    table.dropColumn("auto_cycles");
    table.dropColumn("teleop_cycles");
    table.dropColumn("driver_rank");

    // Restore old columns
    table.tinyint("starting_pos").notNullable().unsigned().defaultTo(0);
    table.tinyint("auto_fuel").notNullable().unsigned().defaultTo(0);
    table.boolean("auto_climb").notNullable().defaultTo(false);
    table.tinyint("cycles").notNullable().unsigned().defaultTo(0);
    table.tinyint("fuel_score").notNullable().unsigned().defaultTo(0);
    table.boolean("passing").notNullable().defaultTo(false);
    table.tinyint("climb").notNullable().unsigned().defaultTo(0);
    table.tinyint("zone_play").notNullable().unsigned().defaultTo(0);
    table.tinyint("bump_rank").notNullable().unsigned().defaultTo(0);
    table.tinyint("drive_rank").notNullable().unsigned().defaultTo(0);
    table.boolean("breakdown").notNullable().defaultTo(false);
  });
}
