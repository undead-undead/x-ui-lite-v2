#!/bin/bash
# Log cleanup script - removes log files older than 7 days

LOG_DIR="logs"
MAX_AGE_DAYS=7

if [ ! -d "$LOG_DIR" ]; then
    echo "Log directory $LOG_DIR does not exist"
    exit 0
fi

echo "Cleaning up log files older than $MAX_AGE_DAYS days in $LOG_DIR..."

# Find and delete log files older than MAX_AGE_DAYS
find "$LOG_DIR" -name "*.log.*" -type f -mtime +$MAX_AGE_DAYS -delete

# Count remaining log files
LOG_COUNT=$(find "$LOG_DIR" -name "*.log.*" -type f | wc -l)
echo "Cleanup complete. Remaining log files: $LOG_COUNT"
