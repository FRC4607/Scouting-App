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
    ["auto_grid", DataType.SmallIntUnsigned],
    ["charging_station", DataType.TinyIntUnsigned],
    ["teleop_cones_missed", DataType.TinyIntUnsigned],
    ["teleop_cubes_missed", DataType.TinyIntUnsigned],
    ["teleop_grid", DataType.SmallIntUnsigned],
    ["playstyle", DataType.TinyIntUnsigned],
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
    ["programing_language", DataType.TinyIntUnsigned],
    ["mobility_capable", DataType.Bool],
    ["preferred_play_style", DataType.TinyIntUnsigned],
    ["number_of_batteries", DataType.TinyIntUnsigned],
    ["battery_maintenance", DataType.Bool],
    ["battery_maintenance_text", DataType.TinyText],
    ["pit_checklist", DataType.Bool],
    ["scouting", DataType.Bool],
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