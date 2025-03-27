import { ApiRequest } from "../schemas/ApiRequest";

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

function parseTeamData(teamData: string, r: Record<string, boolean | number | string>) {
  let parts: string[] = teamData.split(",");
  r.is_blue = (parts[0] === "Blue");
  r.ds_position = stringToInt(parts[1]);
  r.team_number = stringToInt(parts[2]);
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
    mobility: stringToBool,
    defense: stringToBool,
    comments: identity,
    ScoutedTime: reformatISO,
    Level1: stringToInt,
    Level2: stringToInt,
    Level3: stringToInt,
    Level4: stringToInt,
    auto_algae: stringToInt,
    tele_algae: stringToBool,
    tele_Level1: stringToInt,
    tele_Level2: stringToInt,
    tele_Level3: stringToInt,
    tele_Level4: stringToInt,
    robo_barge_score: stringToInt,
    processor_scored: stringToInt,
    climb: stringToInt,
    driver_rank: stringToInt,
    breakdown: stringToBool
  };
  r.values.forEach((entry: string[]) => {
    const obj: Record<string, boolean | number | string> = {};
    for (let i = 0; i < r.header.length; i++) {
      if (!operations[r.header[i]]) continue;
      obj[r.header[i]] = operations[r.header[i]](entry[i]);
    }
    // Handle special case of team_data
    parseTeamData(entry[3], obj)
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
