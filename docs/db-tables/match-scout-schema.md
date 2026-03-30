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
| `auto_cycles` | tinyint (unsigned) | Number of scoring cycles during autonomous | 0+ |

### Teleop

| Column | DB Type | Description | Possible Values |
|---|---|---|---|
| `teleop_cycles` | tinyint (unsigned) | Number of scoring cycles during teleoperated period | 0+ |

### Ratings & Comments

| Column | DB Type | Description | Possible Values |
|---|---|---|---|
| `driver_rank` | tinyint (unsigned) | Driver skill rating (0=N/A, 1=worst, 5=best) | 0–5 |
| `defense_rank` | tinyint (unsigned) | Robot's defensive play effectiveness (0=N/A, 1=worst, 5=best) | 0–5 |
| `comments` | text | Additional observations, strategy notes, or concerns | Free text |
