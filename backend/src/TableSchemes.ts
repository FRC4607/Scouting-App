import { DataType } from "./DataType.js";

/**
 * The table type layout map.
 */
const TableLayouts: Map<string, Map<string, DataType>> = new Map();

// Create Table Layouts
const matchesMap: Map<string, DataType> = new Map([
    ["event_key", DataType.TinyText],
    ["match_level", DataType.TinyIntUnsigned],
    ["match_number", DataType.TinyIntUnsigned],
    ["team_station", DataType.TinyText],
    ["team_number", DataType.SmallIntUnsigned],
    ["scouter_name", DataType.TinyText],
    ["starting_position", DataType.Point],
    ["mobility", DataType.Bool],
    ["auto_cones_missed", DataType.TinyIntUnsigned],
    ["auto_cubes_missed", DataType.TinyIntUnsigned],
    ["auto_grid", DataType.Int],
    ["charging_station", DataType.TinyIntUnsigned],
    ["teleop_cones_missed", DataType.TinyIntUnsigned],
    ["teleop_cubes_missed", DataType.TinyIntUnsigned],
    ["teleop_grid", DataType.Int],
    ["playstyle", DataType.TinyIntUnsigned],
    ["endgame_state", DataType.TinyIntUnsigned],
    ["major_failures", DataType.Text],
    ["comments", DataType.Text],
    ["scouted_time", DataType.DateTime]
]);

const pitsMap: Map<string, DataType> = new Map([
    ["scouter_name", DataType.TinyText],
    ["team_number", DataType.SmallIntUnsigned],
    ["drivetrain_type", DataType.TinyIntUnsigned],
    ["frame_width", DataType.Float],
    ["frame_length", DataType.Float],
    ["weight", DataType.Float],
    ["bumper_height", DataType.Float],
    ["bumper_depth", DataType.Float],
    ["bumper_mounting_configuration", DataType.TinyText],
    ["using_break_mode_on_drivetrain", DataType.Bool],
    ["if_swerve_what_kind_of_modules", DataType.TinyIntUnsigned],
    ["frequency_of_replacing_wheels", DataType.TinyText],
    ["pneumatics_in_use", DataType.Bool],
    ["programming_language", DataType.TinyIntUnsigned],
    ["mobility_capable", DataType.Bool],
    ["preferred_play_style", DataType.TinyIntUnsigned],
    ["number_of_batteries", DataType.TinyIntUnsigned],
    ["battery_maintenance", DataType.Bool],
    ["battery_maintenance_text", DataType.TinyText],
    ["batteries_get_tested", DataType.Bool],
    ["main_battery_brand", DataType.TinyIntUnsigned],
    ["our_batteries_needed_during_playoffs", DataType.Bool],
    ["pit_checklist", DataType.Bool],
    ["does_scouting", DataType.Bool],
    ["willing_to_trade_scouting_data", DataType.Bool],
    ["battery_storage_and_charging_area", DataType.Text],
    ["battery_location_on_robot", DataType.Text],
    ["battery_connector_close_up", DataType.Text],
    ["main_power_switch_location", DataType.Text],
    ["robot_close_ups_and_features", DataType.Text],
    ["comments", DataType.Text],
    ["scouted_time", DataType.DateTime]
]);

// Add layouts to Map of table layouts
// Note: The name that this is mapped to must be the same as the config on the front end.
TableLayouts.set("matches", matchesMap);
TableLayouts.set("pits", pitsMap);

/** 
 * A Map of the query used to crate the table. It is used when the table does not exist or needs to be recrated.
 */
const TableLayoutQueries: Map<string, string> = new Map();
for (const table of TableLayouts) {
    let query = `CREATE TABLE ${table[0]} (`
    for (const column of table[1]) {
        query += `${column[0]} ${column[1].valueOf()} NOT NULL, `
    }
    query = query.replace(/, $/, "");
    query += ")"

    TableLayoutQueries.set(table[0], query);
}

export { TableLayouts, TableLayoutQueries }