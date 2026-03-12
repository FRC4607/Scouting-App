import { ApiRequest } from "../schemas/ApiRequest";

interface Ranking {
  better: number;
  worse: number;
  diff: number;
  match: number;
  incap: boolean;
  scouted_time: string;
}

function stringToInt(s: string): number {
  if (s === "" || s === null || s === undefined) return 0;
  return Number.parseInt(s);
}

function stringToFloat(s: string): number {
  if (s === "" || s === null || s === undefined) return 0;
  return Number.parseFloat(s);
}

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
      scouted_time: reformatISO(time)
    });
  }
  return result;
}

export function convertPitScout(r: ApiRequest): Record<string, boolean | number | string>[] {
  const entries: Record<string, boolean | number | string>[] = [];
  const operations: Record<string, (s: string) => boolean | number | string> = {
    event_key: identity,
    scouter_name: identity,
    team_number: stringToInt,
    prog_lang: stringToInt,
    bat_brand: stringToInt,
    other_brand: identity,
    num_bat: stringToInt,
    bat_condition: identity,
    height: stringToInt,
    hopper: stringToBool,
    hopper_size: stringToInt,
    spare_parts: stringToBool,
    bump: stringToBool,
    trench: stringToBool,
    shoot_type: stringToInt,
    shoot_notes: identity,
    climb_type: stringToInt,
    climb_notes: identity,
    index_type: stringToInt,
    index_notes: identity,
    feed_rate: stringToInt,
    intake: stringToInt,
    intake_speed: stringToInt,
    pre_checklist: stringToBool,
    not_breakdown: identity,
    components_protected: stringToBool,
    breaker_cover: stringToBool,
    pic_robot_full: identity,
    pic_drivetrain: identity,
    pic_intake: identity,
    pic_shooter: identity,
    pic_climber: identity,
    pic_electronics: identity,
    pic_battery: identity,
    pic_battery_charging: identity,
    pic_misc: identity,
    scouted_time: reformatISO
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
    auto_fuel: stringToInt,
    auto_climb: stringToBool,
    cycles: stringToInt,
    fuel_score: stringToInt,
    passing: stringToBool,
    climb: stringToInt,
    zone_play: stringToInt,
    bump_rank: stringToInt,
    drive_rank: stringToInt,
    defense_rank: stringToInt,
    breakdown: stringToBool,
    comments: identity,
    scouted_time: reformatISO
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
