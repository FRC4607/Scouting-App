import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable("pit_scouting_entries", (table) => {
            table.increments("id").notNullable();
            table.text("scouter_name").notNullable();
            table.smallint("team_number").notNullable().unsigned();
            table.tinyint("length").notNullable().unsigned();
            table.tinyint("width").notNullable().unsigned();
            table.tinyint("start_height").notNullable().unsigned();
            table.tinyint("max_height").notNullable().unsigned();
            table.tinyint("weight").notNullable().unsigned();
            table.tinyint("dt_type").notNullable().unsigned();
            table.tinyint("drive_motor").notNullable().unsigned();
            table.tinyint("swerve_type").notNullable().unsigned();
            table.text("wheel_rep_freq").notNullable();
            table.tinyint("bumper_height").notNullable().unsigned();
            table.tinyint("can_bus_top").notNullable().unsigned();
            table.boolean("pneumatics").notNullable();
            table.tinyint("programming_language").notNullable().unsigned();
            table.tinyint("num_batt").notNullable().unsigned();
            table.boolean("does_batt_maint").notNullable();
            table.text("batt_maint_txt").notNullable();
            table.boolean("batt_testing").notNullable();
            table.tinyint("batt_brand").notNullable().unsigned();
            table.boolean("batt_needed").notNullable();
            table.boolean("spare_parts").notNullable();
            table.boolean("pit_checklist").notNullable();
            table.boolean("does_scouting").notNullable();
            table.boolean("trade_scouting_data").notNullable();
            table.text("batt_storchrg").notNullable();
            table.text("batt_loc").notNullable();
            table.text("batt_con").notNullable();
            table.text("powersw_loc").notNullable();
            table.text("radio_loc").notNullable();
            table.text("misc_pics").notNullable();
            table.text("comments").notNullable();
            table.datetime("ScoutedTime").notNullable();
        });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("pit_scouting_entries");
}

