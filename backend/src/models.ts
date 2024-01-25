import { Model } from "objection";
import { readFileSync } from "fs";
const PitScoutSchema = JSON.parse(readFileSync("schemas/pit_scout_entry.schema.json").toString())

export class PitScoutEntry extends Model {
    scouter_name!: string;
    team_number!: number;
    length!: number;
    width!: number;
    start_height!: number;
    max_height!: number;
    weight!: number;
    dt_type!: number;
    drive_motor!: number;
    swerve_type!: number;
    wheel_rep_freq!: string;
    bumper_height!: number;
    can_bus_top!: number;
    pneumatics!: boolean;
    programming_language!: number;
    num_batt!: number;
    does_batt_maint!: boolean;
    batt_maint_txt!: string;
    batt_testing!: boolean;
    batt_brand!: number;
    batt_needed!: boolean;
    spare_parts!: boolean;
    pit_checklist!: boolean;
    does_scouting!: boolean;
    trade_scouting_data!: boolean;
    batt_storchrg!: string;
    batt_loc!: string;
    batt_con!: string;
    powersw_loc!: string;
    radio_loc!: string;
    misc_pics!: string;
    comments!: string;
    ScoutedTime!: string;

    static override get tableName() {
        return "pit_scouting_entries";
    }

    static override get jsonSchema() {
        return PitScoutSchema;
    }

    get mappedDrivetrainType() {
        return [
            "Tank Drive",
            "Mecanum",
            "Swerve",
            "Other"
        ][this.dt_type]!;
    }

    get mappedDriveMotorType() {
        return [
            "Neo v1",
            "Neo Vortex",
            "Falcon",
            "Kraken",
            "CIM",
            "Other"
        ][this.drive_motor]!;
    }

    get mappedSwerveType() {
        return [
            "No swerve",
            "SDS Mk4(i)",
            "Other SDS",
            "WCP SwerveX(s)",
            "REV MAXSwerve",
            "Custom/Other"
        ][this.swerve_type]!;
    }

    get mappedCANTopology() {
        return [
            "Dazychain",
            "Star"
        ][this.can_bus_top]!;
    }

    get programmingLanguageMapped() {
        return [
            "Java",
            "C++",
            "Python",
            "Labview"
        ][this.programming_language]!;
    }

    get batteryBrandMapped() {
        return [
            "MK",
            "Interstate",
            "Duracell",
            "Mighty Max",
            "Power Sonic",
            "Other (comments)"
        ][this.batt_brand]!;
    }

    photoSplit(s: string) {
        return s.split(",");
    }

    get batteryStoragePictures() {
        return this.photoSplit(this.batt_storchrg);
    }

    get batteryLocationPictures() {
        return this.photoSplit(this.batt_loc);
    }

    get batteryConnectorPictures() {
        return this.photoSplit(this.batt_con);
    }

    get mainPowerSwitchPictures() {
        return this.photoSplit(this.powersw_loc);
    }

    get radioLocationPictures() {
        return this.photoSplit(this.radio_loc)
    }

    get miscPictures() {
        return this.photoSplit(this.misc_pics)
    }
}