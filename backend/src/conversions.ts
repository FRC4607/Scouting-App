import { ApiRequest } from "../schemas/ApiRequest";

interface TeamData {
  isBlue: boolean;
  dsPosition: number;
  teamNumber: number;
}

interface Ranking {
  better: number;
  worse: number;
  diff: number;
  match: number;
  incap: boolean;
  ScoutedTime: string;
}

function stringToInt(s: string): number {
  return Number.parseInt(s);
}

// function stringToFloat(s: string): number {
//   return Number.parseFloat(s);
// }

function stringToBool(s: string): boolean {
  return s === "true" ? true : false;
}

// function enumToNumber(values: string[]): (s: string) => number {
//     return (s: string) => {
//         return values.indexOf(s);
//     };
// }

function reformatISO(t: string): string {
  return new Date(t).toISOString();
}

function identity<T>(value: T): T {
  return value;
}

function multicheckboxToBooleanArray(v: string, numValues: number): boolean[] {
  const result: boolean[] = [];
  const trues = v.split(" ").map((e) => Number.parseInt(e));
  for (const value of trues) {
    result[value] = true;
  }
  for (let i = 0; i < numValues; i++) {
    result[i] = result[i] ? true : false;
  }
  return result;
}

function parseTeamData(teamData: string): TeamData {
  const teamDataSplit = teamData.split(",");
  return {
    isBlue: teamDataSplit[0] === "Blue",
    dsPosition: stringToInt(teamDataSplit[1]),
    teamNumber: stringToInt(teamDataSplit[2])
  };
}

function parseRanking(teamData: string, match: string, time: string): Ranking[] {
  const result: Ranking[] = [];
  const teamDataSplit = teamData.split(" ");
  for (const comparison of teamDataSplit) {
    const values = comparison.split(",");
    result.push({
      better: stringToInt(values[0]),
      worse: stringToInt(values[1]),
      diff: stringToInt(values[2]),
      match: stringToInt(match),
      incap: stringToBool(values[3]),
      ScoutedTime: reformatISO(time)
    });
  }
  return result;
}

export function convertPitScout(r: ApiRequest): Record<string, boolean | number | string>[] {
  const entries: Record<string, boolean | number | string>[] = [];
  const operations: Record<string, (s: string) => boolean | number | string> = {
    scouter_name: identity,
    team_number: stringToInt,
    length: stringToInt,
    width: stringToInt,
    start_height: stringToInt,
    max_height: stringToInt,
    weight: stringToInt,
    dt_type: stringToInt,
    drive_motor: stringToInt,
    swerve_type: stringToInt,
    wheel_rep_freq: identity,
    bumper_height: stringToInt,
    can_bus_top: stringToInt,
    pneumatics: stringToBool,
    programming_language: stringToInt,
    num_batt: stringToInt,
    does_batt_maint: stringToBool,
    batt_maint_txt: identity,
    batt_testing: stringToBool,
    batt_brand: stringToInt,
    batt_needed: stringToBool,
    spare_parts: stringToBool,
    pit_checklist: stringToBool,
    does_scouting: stringToBool,
    trade_scouting_data: stringToBool,
    batt_storchrg: identity,
    batt_loc: identity,
    batt_con: identity,
    powersw_loc: identity,
    radio_loc: identity,
    misc_pics: identity,
    comments: identity,
    ScoutedTime: reformatISO
  };
  r.values.forEach((entry: string[]) => {
    const obj: Record<string, boolean | number | string> = {};
    for (let i = 0; i < r.header.length; i++) {
      obj[r.header[i]] = operations[r.header[i]](entry[i]);
    }
    entries.push(obj);
  });
  return entries;
}

export function convertMatchScout(r: ApiRequest): Record<string, boolean | number | string>[] {
  const entries: Record<string, boolean | number | string>[] = [];
  const operations: Record<string, (s: string) => boolean | number | string> = {
    event_key: identity,
    match_level: stringToInt,
    match_number: stringToInt,
    scouter_name: identity,
    starting_pos: stringToInt,
    pre_load_score: stringToBool,
    mobility: stringToBool,
    auto_amp: stringToInt,
    zone1_shot_made_auto: stringToInt,
    zone1_shot_miss_auto: stringToInt,
    zone2_shot_made_auto: stringToInt,
    zone2_shot_miss_auto: stringToInt,
    under_stage: stringToBool,
    defense: stringToBool,
    zone1_shot_made: stringToInt,
    zone1_shot_miss: stringToInt,
    zone2_shot_made: stringToInt,
    zone2_shot_miss: stringToInt,
    teleop_amp: stringToInt,
    amp_miss: stringToInt,
    pass_note: stringToInt,
    parked: stringToBool,
    climb_fail: stringToBool,
    rob_onstage: stringToInt,
    harmony: stringToBool,
    rsl_solid: stringToBool,
    rsl_off: stringToBool,
    brown_out: stringToBool,
    comments: identity,
    ScoutedTime: reformatISO
  };
  r.values.forEach((entry: string[]) => {
    const obj: Record<string, boolean | number | string> = {};
    for (let i = 0; i < r.header.length; i++) {
      if (!operations[r.header[i]]) continue;
      obj[r.header[i]] = operations[r.header[i]](entry[i]);
    }
    const pickupMethods = multicheckboxToBooleanArray(entry[15], 2); // pickup_method
    obj["pickup_method_ground"] = pickupMethods[0];
    obj["pickup_method_source"] = pickupMethods[1];
    const trapNotePositions = multicheckboxToBooleanArray(entry[27], 3); // trap_note_pos
    obj["trap_note_pos_amp"] = trapNotePositions[0];
    obj["trap_note_pos_source"] = trapNotePositions[1];
    obj["trap_note_pos_center"] = trapNotePositions[2];
    const parsedTeamData = parseTeamData(entry[3]); // team_data
    obj["is_blue"] = parsedTeamData.isBlue;
    obj["ds_position"] = parsedTeamData.dsPosition;
    obj["team_number"] = parsedTeamData.teamNumber;
    entries.push(obj);
  });
  return entries;
}

export function convertRanking(r: ApiRequest): Ranking[] {
  let entries: Ranking[] = [];
  for (const entry of r.values) {
    entries = entries.concat(parseRanking(entry[1], entry[0], entry[3]));
    entries = entries.concat(parseRanking(entry[2], entry[0], entry[3]));
  }
  return entries;
}
