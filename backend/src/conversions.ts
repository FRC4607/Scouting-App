import { ApiRequest } from "../schemas/ApiRequest";
import { PitScoutEntry } from "./models";

function stringToNumber(s: string): number {
    return Number.parseInt(s);
}

function stringToBool(s: string): boolean {
    return s === "true" ? true : false;
}

function enumToNumber(values: string[]): (s: string) => number {
    return (s: string) => {
        return values.indexOf(s);
    }
}

function reformatISO(t: string): string {
    return new Date(t).toISOString();
}

function identity<T>(value: T): T {
    return value;
}

export function convertPitScout(r: ApiRequest): Record<string, boolean | number | string>[] {
    let entries: Record<string, boolean | number | string>[] = [];
    const operations: Record<string, (s: string) => boolean | number | string> = {
        scouter_name: identity,
        team_number: stringToNumber,
        length: stringToNumber,
        width: stringToNumber,
        start_height: stringToNumber,
        max_height: stringToNumber,
        weight: stringToNumber,
        dt_type: stringToNumber,
        drive_motor: stringToNumber,
        swerve_type: stringToNumber,
        wheel_rep_freq: identity,
        bumper_height: stringToNumber,
        can_bus_top: stringToNumber,
        pneumatics: stringToBool,
        programming_language: stringToNumber,
        num_batt: stringToNumber,
        does_batt_maint: stringToBool,
        batt_maint_txt: identity,
        batt_testing: stringToBool,
        batt_brand: stringToNumber,
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
        let obj: Record<string, boolean | number | string> = {};
        for (let i = 0; i < r.header.length; i++) {
            obj[r.header[i]] = operations[r.header[i]](entry[i]);
        }
        entries.push(obj);
    });
    return entries;
}