-- Create tasks table
CREATE TABLE tasks (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP,
    priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')),
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    recurring_frequency VARCHAR(10) CHECK (recurring_frequency IN ('daily', 'weekly', NULL)),
    recurring_days_of_week INTEGER[]
);

-- Create index for faster queries
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_priority ON tasks(priority);

-- Add comments for documentation
COMMENT ON TABLE tasks IS 'Stores todo tasks with their properties and recurring settings';
COMMENT ON COLUMN tasks.id IS 'Unique identifier for the task';
COMMENT ON COLUMN tasks.title IS 'Title of the task';
COMMENT ON COLUMN tasks.description IS 'Optional description of the task';
COMMENT ON COLUMN tasks.completed IS 'Whether the task is completed';
COMMENT ON COLUMN tasks.created_at IS 'When the task was created';
COMMENT ON COLUMN tasks.due_date IS 'When the task is due';
COMMENT ON COLUMN tasks.priority IS 'Priority level of the task (low, medium, high)';
COMMENT ON COLUMN tasks.is_recurring IS 'Whether the task repeats';
COMMENT ON COLUMN tasks.recurring_frequency IS 'How often the task repeats (daily, weekly)';
COMMENT ON COLUMN tasks.recurring_days_of_week IS 'Days of the week for weekly recurring tasks (0-6, where 0 is Sunday)'; 