# SMS-GCA-3H

School Management System for Gymnazo Christian Academy

## Database Changes

<!-- Database changes below this line -->

| Date | Author | Description |
|------|--------|-------------|
| 2025-11-28 | | Added `Gender`, `BirthDate`, `Religion`, and `MotherTounge` columns to `profile` table |
| 2025-11-28 | | Added `Age` column to `profile` table |

### SQL Queries

```sql
-- Add Gender, BirthDate, Religion, and MotherTounge columns to profile table
ALTER TABLE `profile` ADD `Gender` ENUM('Male','Female') NULL AFTER `MiddleName`, ADD `BirthDate` DATE NULL AFTER `Gender`, ADD `Religion` VARCHAR(255) NULL AFTER `BirthDate`, ADD `MotherTounge` VARCHAR(255) NULL AFTER `Religion`;

-- Add Age column to profile table
ALTER TABLE `profile` ADD `Age` INT NULL AFTER `BirthDate`;
```

## Getting Started

```bash
git add README.md 
```