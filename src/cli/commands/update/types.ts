/**
 * Update Command Types
 * Shared type definitions for update command
 * @module cli/commands/update/types
 */

export interface UpdateStats {
  agentsUpdated: number;
  templatesUpdated: number;
  knowledgeBaseUpdated: number;
  commandsUpdated: number;
  filesUpdated: number;
}
