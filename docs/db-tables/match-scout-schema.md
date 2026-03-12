# Match Scouting Database Schema

## Table: `match_scouting_entries`

> **Migration:** `20260124000000_create_match_scout_2026.ts`

All fields are **NOT NULL**.

### Metadata

| Column | DB Type | Description | Possible Values |
|---|---|---|---|
| `id` | integer (auto-increment) | Primary key | Auto-generated |
| `event_key` | text | TBA event key for the competition | e.g. `"2026mndu"`, `"2026ndgf"` |
| `match_level` | tinyint (0–3) | Competition level/round | 0 = Qualification, 1 = Quarterfinal, 2 = Semifinal, 3 = Final |
| `match_number` | tinyint (unsigned) | Match number within the level | 1, 2, 3, ... |
| `is_blue` | boolean | Alliance color (parsed from team_data from TBA) | `true` = Blue Alliance, `false` = Red Alliance |
| `ds_position` | tinyint (0–2) | Driver station position (parsed from team_data from TBA) | 0 = Left, 1 = Center, 2 = Right |
| `team_number` | smallint (unsigned) | FRC team number being scouted (parsed from team_data from TBA) | e.g. 4607 |
| `scouter_name` | text | Name of the person scouting this match | Free text |
| `scouted_time` | datetime | Timestamp when scouting entry was completed | ISO datetime |

### Autonomous

| Column | DB Type | Description | Possible Values |
|---|---|---|---|
| `starting_pos` | tinyint (0–2) | Robot starting position on field | 0 = Left, 1 = Middle, 2 = Right |
| `auto_fuel` | tinyint (unsigned) | Number of fuel scored during autonomous | 0+ |
| `auto_climb` | boolean | Whether robot climbed during autonomous period | `true` / `false` |

### Teleop

| Column | DB Type | Description | Possible Values |
|---|---|---|---|
| `cycles` | tinyint (unsigned) | Number of complete scoring cycles (pickup + score) | 0+ |
| `fuel_score` | tinyint (unsigned) | Total fuel scored during teleoperated period | 0+ |
| `passing` | boolean | Whether robot passed fuel to teammates | `true` / `false` |

### Endgame

| Column | DB Type | Description | Possible Values |
|---|---|---|---|
| `climb` | tinyint (0–3) | Highest climb level achieved during endgame | 0 = L1, 1 = L2, 2 = L3, 3 = None |
| `zone_play` | tinyint (unsigned) | Field zones played during match (multicheckbox bitmask: [Blue\|Neutral\|Red]) | Space-separated checkbox indices: `"0"` (Blue only), `"0 1"` (Blue + Neutral), `"0 1 2"` (all zones), `""` (none) |
| `bump_rank` | tinyint (unsigned) | Robot's ability to handle bumps/defense (1=worst, 5=best) | 1–5 |
| `drive_rank` | tinyint (unsigned) | Drive team skill and robot maneuverability (1=worst, 5=best) | 1–5 |
| `defense_rank` | tinyint (unsigned) | Robot's defensive play effectiveness (1=worst, 5=best) | 1–5 |
| `breakdown` | boolean | Whether robot broke down or became inoperable during match | `true` / `false` |
| `comments` | text | Additional observations, strategy notes, or concerns | Free text |
