# SMS-GCA-3H

School Management System for Gymnazo Christian Academy

## Database Changes

<!-- Database changes below this line -->

| Date | Author | Description |
|------|--------|-------------|
| 2025-11-28 | | Added `Gender`, `BirthDate`, `Religion`, and `MotherTounge` columns to `profile` table |
| 2025-11-28 | | Added `Age` column to `profile` table |
| 2025-11-28 | | Added `ClassShift` column to `section` table |
| 2025-11-28 | | Added `RoomNumber` column to `section` table |

### SQL Queries

```sql
-- Add Gender, BirthDate, Religion, and MotherTounge columns to profile table
ALTER TABLE `profile` ADD `Gender` ENUM('Male','Female') NULL AFTER `MiddleName`, ADD `BirthDate` DATE NULL AFTER `Gender`, ADD `Religion` VARCHAR(255) NULL AFTER `BirthDate`, ADD `MotherTounge` VARCHAR(255) NULL AFTER `Religion`;

-- Add Age column to profile table
ALTER TABLE `profile` ADD `Age` INT NULL AFTER `BirthDate`;

-- Add ClassShift column to section table
ALTER TABLE `section` ADD `ClassShift` ENUM('Morning','Afternoon') NOT NULL AFTER `SectionName`;

-- Add RoomNumber column to section table
ALTER TABLE `section` ADD `RoomNumber` VARCHAR(55) NOT NULL AFTER `SectionName`;
```

## Getting Started

```bash
git add README.md 
```