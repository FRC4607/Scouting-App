import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists("pit_scouting_entries")
    .createTable("pit_scouting_entries", (table) => {
      table.increments("id").notNullable();
      table.text("event_key").notNullable();
      table.text("scouter_name").notNullable();
      table.smallint("team_number").notNullable().unsigned();
      // prog_lang: Java=0, C++=1, Python=2, Labview=3
      table.tinyint("prog_lang").notNullable().unsigned();
      // bat_brand: MK=0, Duracell=1, Interstate=2, Mighty Max=3, Power Sonic=4, Other=5
      table.tinyint("bat_brand").notNullable().unsigned();
      table.text("other_brand").notNullable();
      table.tinyint("num_bat").notNullable().unsigned();
      table.text("bat_condition").notNullable();
      table.tinyint("height").notNullable().unsigned();
      table.boolean("hopper").notNullable();
      table.tinyint("hopper_size").notNullable().unsigned();
      table.boolean("spare_parts").notNullable();
      table.boolean("bump").notNullable();
      table.boolean("trench").notNullable();
      // shoot_type: Fixed Flywheel Launcher=0, Turret Flywheel launcher=1, Double Fixed Flywheel launcher=2, Double Turret Flywheel Launcher=3, ??????=4
      table.tinyint("shoot_type").notNullable().unsigned();
      table.text("shoot_notes").notNullable();
      // climb_type: climber=0, none=1
      table.tinyint("climb_type").notNullable().unsigned();
      table.text("climb_notes").notNullable();
      // index_type: indexer=0, no indexer=1
      table.tinyint("index_type").notNullable().unsigned();
      table.text("index_notes").notNullable();
      table.tinyint("feed_rate").notNullable().unsigned();
      // intake: none=0, ground=1, ?=2
      table.tinyint("intake").notNullable().unsigned();
      table.tinyint("intake_speed").notNullable().unsigned();
      table.boolean("pre_checklist").notNullable();
      table.text("not_breakdown").notNullable();
      table.boolean("components_protected").notNullable();
      table.boolean("breaker_cover").notNullable();
      // Picture fields
      table.text("pic_robot_full").notNullable().defaultTo("");
      table.text("pic_drivetrain").notNullable().defaultTo("");
      table.text("pic_intake").notNullable().defaultTo("");
      table.text("pic_shooter").notNullable().defaultTo("");
      table.text("pic_climber").notNullable().defaultTo("");
      table.text("pic_electronics").notNullable().defaultTo("");
      table.text("pic_battery").notNullable().defaultTo("");
      table.text("pic_battery_charging").notNullable().defaultTo("");
      table.text("pic_misc").notNullable().defaultTo("");
      table.datetime("scouted_time").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("pit_scouting_entries");
}
