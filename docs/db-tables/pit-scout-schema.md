# Pit Scouting Database Schema

## Table: `pit_scouting_entries`

> **Migration:** `20260124000001_create_pit_scout_2026.ts`

All fields are **NOT NULL**.

### Metadata

| Column | DB Type | Description | Possible Values |
|---|---|---|---|
| `id` | integer (auto-increment) | Primary key | Auto-generated |
| `event_key` | text | TBA event key (e.g., "2026ndgf" for North Dakota Grand Forks - "Great Northern" regional) | e.g. "2026cmptx", "2026mndu" |
| `scouter_name` | text | Name of the scouter | Free text |
| `team_number` | smallint (unsigned) | FRC team number (selected from TBA team list) | e.g. 4607 |
| `scouted_time` | datetime | Timestamp when entry was completed | ISO datetime |

### Robot Info

| Column | DB Type | Description | Possible Values |
|---|---|---|---|
| `prog_lang` | tinyint (0–3) | Programming language used by team | 0 = Java, 1 = C++, 2 = Python, 3 = Labview |
| `bat_brand` | tinyint (0–5) | Battery brand used by team | 0 = MK, 1 = Duracell, 2 = Interstate, 3 = Mighty Max, 4 = Power Sonic, 5 = Other |
| `other_brand` | text | Other battery brand name (only to be filled when bat_brand = 5) | Free text |
| `num_bat` | tinyint (unsigned) | Number of batteries team brings to competition | 1+ |
| `bat_condition` | text | Notes about battery age, wear, replacement status | Free text |
| `height` | tinyint (unsigned) | Robot height in inches | 0+ |
| `hopper` | boolean | Whether robot has hopper/storage for fuel | `true` / `false` |
| `hopper_size` | tinyint (unsigned) | Hopper capacity (number of fuel) | 0+ |
| `spare_parts` | boolean | Whether team brings spare parts to competition | `true` / `false` |
| `bump` | boolean | Whether robot can traverse the bump on field | `true` / `false` |
| `trench` | boolean | Whether robot can fit under the trench on field | `true` / `false` |

### Mechanisms

| Column | DB Type | Description | Possible Values |
|---|---|---|---|
| `shoot_type` | tinyint (0–4) | Shooter/scoring mechanism type | 0 = Fixed Flywheel Launcher, 1 = Turret Flywheel Launcher, 2 = Double Fixed Flywheel Launcher, 3 = Double Turret Flywheel Launcher, 4 = ?????? |
| `shoot_notes` | text | Details about shooter (range, accuracy, etc.) | Free text |
| `climb_type` | tinyint (0–1) | Whether robot has climbing capability | 0 = Climber, 1 = None |
| `climb_notes` | text | Climb mechanism details (level reached, requirements, reliability, etc.) | Free text |
| `index_type` | tinyint (0–1) | Whether robot has indexer for fuel | 0 = Indexer, 1 = No Indexer |
| `index_notes` | text | Indexer details (capacity, speed, reliability, etc.) | Free text |
| `feed_rate` | tinyint (unsigned) | Rate at which robot can feed/score fuel (measured in fuel per second) | 0–255 |
| `intake` | tinyint (0–2) | Intake mechanism type and location | 0 = None, 1 = Ground, 2 = ? |
| `intake_speed` | tinyint (unsigned) | How quickly intake can grab fuel (measured in fuel per second) | 0–255 |

### Reliability

| Column | DB Type | Description | Possible Values |
|---|---|---|---|
| `pre_checklist` | boolean | Team uses pre-match checklist for robot preparation | `true` / `false` |
| `not_breakdown` | text | Team's strategies/practices to prevent robot breakdowns | Free text |
| `components_protected` | boolean | Sensitive electronic components protected from damage/shorts | `true` / `false` |
| `breaker_cover` | boolean | Circuit breakers have protective covers installed | `true` / `false` |
| `business_binder` | boolean | Team has a business binder | `true` / `false` |

### Pictures

All picture columns store comma-separated filenames on the WebDAV image server (or empty string if none uploaded).

Filename format: `scouterName_teamNumber_context_uuid.extension` (e.g., `john_4607_pic_robot_full_a1b2c3d4.jpg`)

| Column | DB Type | Description | Default |
|---|---|---|---|
| `pic_robot_full` | text | Robot full view photo (overall appearance) | `""` |
| `pic_drivetrain` | text | Drivetrain photo (wheels, motors, gearboxes) | `""` |
| `pic_intake` | text | Intake mechanism photo (how fuel are collected) | `""` |
| `pic_shooter` | text | Shooter/scoring mechanism photo (how fuel are scored) | `""` |
| `pic_climber` | text | Climber mechanism photo (endgame climbing system) | `""` |
| `pic_electronics` | text | Electronics/wiring photo (control system, PDH, etc.) | `""` |
| `pic_battery` | text | Battery storage area photo (battery placement in robot) | `""` |
| `pic_battery_charging` | text | Battery charging area photo (team's charging station) | `""` |
| `pic_misc` | text | Additional photos (any other relevant images) | `""` |
