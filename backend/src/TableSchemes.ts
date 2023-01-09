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
    ["starting_position", DataType.Points],
    ["taxi", DataType.Bool],
    ["auto_upper_cargo_scored", DataType.TinyIntUnsigned],
    ["auto_upper_cargo_missed", DataType.TinyIntUnsigned],
    ["auto_lower_cargo_scored", DataType.TinyIntUnsigned],
    ["auto_lower_cargo_missed", DataType.TinyIntUnsigned],
    ["teleop_upper_cargo_scored", DataType.TinyIntUnsigned],
    ["teleop_upper_cargo_missed", DataType.TinyIntUnsigned],
    ["teleop_lower_cargo_scored", DataType.TinyIntUnsigned],
    ["teleop_lower_cargo_missed", DataType.TinyIntUnsigned],
    ["defense_rating", DataType.TinyIntUnsigned],
    ["hanger_level", DataType.TinyIntUnsigned],
    ["failed_climb", DataType.Bool],
    ["robots_climbed", DataType.SmallIntUnsigned],
    ["mechanical_failures", DataType.Text],
    ["comments", DataType.Text],
    ["scouted_time", DataType.DateTime]
]);

// Add layouts to Map of table layouts
// Note: The name that this is mapped to must be the same as the config on the front end.
TableLayouts.set("matches", matchesMap);

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