import { Model } from "objection";
import { readFileSync } from "fs";
import { env } from "process";

const prefix = env["NODE_ENV"] == "production" ? "../" : "";
const PitScoutSchema = JSON.parse(readFileSync(prefix + "schemas/pit_scout_entry.schema.json").toString());
const MatchScoutSchema = JSON.parse(readFileSync(prefix + "schemas/match_scout_entry.schema.json").toString());
const RankingSchema = JSON.parse(readFileSync(prefix + "schemas/ranking_entry.schema.json").toString());

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
    return this.photoSplit(this.radio_loc);
  }

  get miscPictures() {
    return this.photoSplit(this.misc_pics);
  }
}

export class MatchScoutEntry extends Model {
  event_key!: string;
  match_level!: number;
  match_number!: number;
  is_blue!: boolean;
  ds_position!: number;
  team_number!: number;
  scouter_name!: string;
  starting_pos!: number;
  pre_load_score!: boolean;
  mobility!: boolean;
  auto_amp!: number;
  zone1_shot_made_auto!: number;
  zone1_shot_miss_auto!: number;
  zone2_shot_made_auto!: number;
  zone2_shot_miss_auto!: number;
  under_stage!: boolean;
  defense!: boolean;
  pickup_method_ground!: boolean;
  pickup_method_source!: boolean;
  zone1_shot_made!: number;
  zone1_shot_miss!: number;
  zone2_shot_made!: number;
  zone2_shot_miss!: number;
  teleop_amp!: number;
  amp_miss!: number;
  notes_passed!: number;
  parked!: boolean;
  climb_fail!: boolean;
  rob_onstage!: number;
  trap_note_pos_amp!: boolean;
  trap_note_pos_source!: boolean;
  trap_note_pos_center!: boolean;
  harmony!: boolean;
  rsl_solid!: boolean;
  rsl_off!: boolean;
  brown_out!: boolean;
  comments!: string;
  ScoutedTime!: string;

  static override get tableName() {
    return "match_scouting_entries";
  }

  static override get jsonSchema() {
    return MatchScoutSchema;
  }

  get mappedMatchLevel() {
    return [
      "Qualifications",
      "Playoffs",
      "Finals",
      "Practice"
    ][this.match_level];
  }

  get mappedStartingPosition() {
    return [
      "Subwoofer: Amp",
      "Subwoofer: Speaker",
      "Subwoofer: Podium",
      "Amp Note",
      "Speaker Note",
      "Podium Note",
      "Between Amp and Speaker Notes",
      "Between Speaker and Podium Notes",
      "Note Closest to Source",
      "Note 2nd Closest to Source",
      "Other"
    ][this.starting_pos];
  }

  get mappedRobotOnstage() {
    return [
      "N/A",
      "Stage Left",
      "Stage Right",
      "Center Stage"
    ][this.rob_onstage];
  }
}

export class RankingEntry extends Model {
  better!: number;
  worse!: number;
  diff!: number;
  match!: number;
  incap!: boolean;
  ScoutedTime!: string;


  static override get tableName() {
    return "ranking_entries";
  }

  static override get jsonSchema() {
    return RankingSchema;
  }
}