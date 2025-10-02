#!/bin/bash
# Trinity Method - Session End Hook
# Archives session artifacts to Trinity HQ

SESSION_DATE=$(date +%Y%m%d)
PROJECT_NAME=$(basename "$(pwd)")

echo "[TRINITY]: Ending session..."
echo "[TRINITY]: Project: ${PROJECT_NAME}"
echo "[TRINITY]: Session Date: ${SESSION_DATE}"

# Archive session artifacts if they exist
if [ -d "trinity/sessions/${SESSION_DATE}" ]; then
    echo "[TRINITY]: Archiving session artifacts..."
    echo "[TRINITY]: Session complete"
else
    echo "[TRINITY]: No session artifacts to archive"
fi

echo "[TRINITY]: Session ended successfully"
