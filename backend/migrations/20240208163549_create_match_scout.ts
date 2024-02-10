import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
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
            table.tinyint("auto_amp").notNullable().unsigned();
            table.tinyint("zone1_shot_made_auto").notNullable().unsigned();
            table.tinyint("zone1_shot_miss_auto").notNullable().unsigned();
            table.tinyint("zone2_shot_made_auto").notNullable().unsigned();
            table.tinyint("zone2_shot_miss_auto").notNullable().unsigned();
            table.boolean("under_stage").notNullable();
            table.boolean("defense").notNullable();
            table.boolean("pickup_method_ground").notNullable();
            table.boolean("pickup_method_source").notNullable();
            table.tinyint("zone1_shot_made").notNullable().unsigned();
            table.tinyint("zone1_shot_miss").notNullable().unsigned();
            table.tinyint("zone2_shot_made").notNullable().unsigned();
            table.tinyint("zone2_shot_miss").notNullable().unsigned();
            table.tinyint("zone3_shot_made").notNullable().unsigned();
            table.tinyint("zone3_shot_miss").notNullable().unsigned();
            table.tinyint("zone4_shot_made").notNullable().unsigned();
            table.tinyint("zone4_shot_miss").notNullable().unsigned();
            table.tinyint("teleop_amp").notNullable().unsigned();
            table.tinyint("piece_stolen").notNullable().unsigned();
            table.double("wait_time").notNullable();
            table.boolean("climb_fail").notNullable();
            table.tinyint("rob_onstage").notNullable().unsigned();
            table.tinyint("climb_order").notNullable().unsigned();
            table.boolean("trap_note_pos_amp").notNullable();
            table.boolean("trap_note_pos_source").notNullable();
            table.boolean("trap_note_pos_center").notNullable();
            table.tinyint("spot_try").notNullable().unsigned();
            table.boolean("spot_made_amp").notNullable();
            table.boolean("spot_made_source").notNullable();
            table.boolean("spot_made_center").notNullable();
            table.boolean("rsl_solid").notNullable();
            table.boolean("rsl_off").notNullable();
            table.boolean("brown_out").notNullable();
            table.text("comments").notNullable();
            table.datetime("ScoutedTime").notNullable();
        });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("match_scouting_entries");
}

