-- Add isHero flag to projects table
ALTER TABLE projects ADD COLUMN is_hero boolean NOT NULL DEFAULT false;
