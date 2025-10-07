#!/bin/bash
# Trinity Method - Backup Knowledge Hook
# Backs up critical knowledge base files

echo "[TRINITY-BACKUP]: Backing up knowledge base..."

BACKUP_DIR="trinity/sessions/$(date +%Y%m%d)/backups"
mkdir -p "${BACKUP_DIR}"

# Backup critical files
if [ -f "trinity/knowledge-base/ARCHITECTURE.md" ]; then
    cp "trinity/knowledge-base/ARCHITECTURE.md" "${BACKUP_DIR}/"
fi

if [ -f "trinity/knowledge-base/To-do.md" ]; then
    cp "trinity/knowledge-base/To-do.md" "${BACKUP_DIR}/"
fi

if [ -f "trinity/knowledge-base/ISSUES.md" ]; then
    cp "trinity/knowledge-base/ISSUES.md" "${BACKUP_DIR}/"
fi

echo "[TRINITY-BACKUP]: Knowledge base backed up to ${BACKUP_DIR}"
exit 0
