# Ranking Database Schema

## Table: `ranking_entries`

> **Migration:** `20240307003853_create_ranking.ts`

All fields are **NOT NULL**.

| Column | DB Type | Description | Possible Values |
|---|---|---|---|
| `id` | integer (auto-increment) | Primary key | Auto-generated |
| `better` | tinyint (unsigned) | Team number of the better robot | 1–32767 |
| `worse` | tinyint (unsigned) | Team number of the worse robot | 1–32767 |
| `diff` | tinyint (unsigned) | Score difference | 0–32767 |
| `match` | tinyint (unsigned) | Match number | 1–32767 |
| `incap` | boolean | Robot was incapacitated | `true` / `false` |
| `ScoutedTime` | datetime | Timestamp of scouting entry | ISO datetime |
