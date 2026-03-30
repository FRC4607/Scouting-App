import { Model } from "objection";
import { readFileSync } from "fs";
import path from "path";

const schemasDir = path.resolve(__dirname, "..", "schemas");
const PitScoutSchema = JSON.parse(readFileSync(path.join(schemasDir, "pit_scout_entry.schema.json")).toString());
const MatchScoutSchema = JSON.parse(readFileSync(path.join(schemasDir, "match_scout_entry.schema.json")).toString());
const RankingSchema = JSON.parse(readFileSync(path.join(schemasDir, "ranking_entry.schema.json")).toString());

export class PitScoutEntry extends Model {
  scouter_name!: string;
  team_number!: number;
  prog_lang!: number;
  bat_brand!: number;
  other_brand!: string;
  num_bat!: number;
  bat_condition!: string;
  height!: number;
  hopper!: boolean;
  hopper_size!: number;
  spare_parts!: boolean;
  bump!: boolean;
  trench!: boolean;
  shoot_type!: number;
  shoot_notes!: string;
  climb_type!: number;
  climb_notes!: string;
  index_type!: number;
  index_notes!: string;
  feed_rate!: string;
  intake!: number;
  intake_speed!: string;
  pre_checklist!: boolean;
  not_breakdown!: string;
  components_protected!: boolean;
  breaker_cover!: boolean;
  pic_robot_full!: string;
  pic_drivetrain!: string;
  pic_intake!: string;
  pic_shooter!: string;
  pic_climber!: string;
  pic_electronics!: string;
  pic_battery!: string;
  pic_battery_charging!: string;
  pic_misc!: string;
  scouted_time!: string;

  static override get tableName() {
    return "pit_scouting_entries";
  }

  static override get jsonSchema() {
    return PitScoutSchema;
  }

  get programmingLanguageMapped() {
    return [
      "Java",
      "C++",
      "Python",
      "Labview"
    ][this.prog_lang]!;
  }

  get batteryBrandMapped() {
    return [
      "MK",
      "Duracell",
      "Interstate",
      "Mighty Max",
      "Power Sonic",
      "Other"
    ][this.bat_brand]!;
  }

  get shooterTypeMapped() {
    return [
      "Fixed Flywheel Launcher",
      "Turret Flywheel launcher",
      "Double Fixed Flywheel launcher",
      "Double Turret Flywheel Launcher",
      "??????"
    ][this.shoot_type]!;
  }

  get climberTypeMapped() {
    return [
      "climber",
      "none"
    ][this.climb_type]!;
  }

  get indexerTypeMapped() {
    return [
      "indexer",
      "no indexer"
    ][this.index_type]!;
  }

  get intakeTypeMapped() {
    return [
      "none",
      "ground",
      "?"
    ][this.intake]!;
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
  auto_cycles!: number;
  teleop_cycles!: number;
  driver_rank!: number;
  defense_rank!: number;
  comments!: string;
  scouted_time!: string;

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
}

export class RankingEntry extends Model {
  better!: number;
  worse!: number;
  diff!: number;
  match!: number;
  incap!: boolean;
  scouted_time!: string;


  static override get tableName() {
    return "ranking_entries";
  }

  static override get jsonSchema() {
    return RankingSchema;
  }
}
