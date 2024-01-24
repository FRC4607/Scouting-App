import { Model } from "objection";
import { readFileSync } from "fs";

const PitScoutSchema = JSON.parse(readFileSync("schemas/pit_scout_entry.schema.json").toString())

class PitScoutEntry extends Model {
    static override get tableName() {
        return "pit_scout";
    }

    static override get jsonSchema() {
        return PitScoutSchema;
    }
}