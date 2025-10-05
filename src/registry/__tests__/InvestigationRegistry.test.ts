/**
 * InvestigationRegistry Tests
 */

import { InvestigationRegistry } from '../InvestigationRegistry';
import { InvestigationRecord } from '../types';
import { unlinkSync, existsSync } from 'fs';

const TEST_DB = 'test-investigations.db';

describe('InvestigationRegistry', () => {
  let registry: InvestigationRegistry;

  beforeEach(() => {
    // Clean up existing test database
    if (existsSync(TEST_DB)) {
      unlinkSync(TEST_DB);
    }

    registry = new InvestigationRegistry(TEST_DB);
  });

  afterEach(() => {
    registry.close();

    // Clean up test database
    if (existsSync(TEST_DB)) {
      unlinkSync(TEST_DB);
    }
  });

  const createTestRecord = (id: string = 'INV-001'): Omit<InvestigationRecord, 'createdAt' | 'updatedAt'> => ({
    id,
    name: 'Test Investigation',
    type: 'security-audit',
    codebase: './src',
    startTime: new Date(),
    endTime: new Date(),
    duration: 60000,
    status: 'completed',
    agents: ['TAN', 'JUNO'],
    tokensUsed: 1000,
    qualityScore: 90,
    tags: ['test', 'security'],
    metadata: { scope: ['src/**'] },
    findings: 5,
  });

  describe('add', () => {
    it('should add an investigation to the registry', () => {
      const record = registry.add(createTestRecord());

      expect(record.id).toBe('INV-001');
      expect(record.createdAt).toBeInstanceOf(Date);
      expect(record.updatedAt).toBeInstanceOf(Date);
    });

    it('should store all fields correctly', () => {
      const testRecord = createTestRecord();
      registry.add(testRecord);

      const retrieved = registry.getById('INV-001');

      expect(retrieved).not.toBeNull();
      expect(retrieved?.name).toBe(testRecord.name);
      expect(retrieved?.type).toBe(testRecord.type);
      expect(retrieved?.codebase).toBe(testRecord.codebase);
      expect(retrieved?.status).toBe(testRecord.status);
      expect(retrieved?.agents).toEqual(testRecord.agents);
      expect(retrieved?.tags).toEqual(testRecord.tags);
      expect(retrieved?.tokensUsed).toBe(testRecord.tokensUsed);
      expect(retrieved?.qualityScore).toBe(testRecord.qualityScore);
    });
  });

  describe('getById', () => {
    it('should retrieve an investigation by ID', () => {
      registry.add(createTestRecord());

      const retrieved = registry.getById('INV-001');

      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe('INV-001');
    });

    it('should return null for non-existent ID', () => {
      const retrieved = registry.getById('NON-EXISTENT');

      expect(retrieved).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an investigation', () => {
      registry.add(createTestRecord());

      const updated = registry.update('INV-001', {
        status: 'partial',
        qualityScore: 85,
      });

      expect(updated.status).toBe('partial');
      expect(updated.qualityScore).toBe(85);
    });

    it('should throw error for non-existent investigation', () => {
      expect(() => {
        registry.update('NON-EXISTENT', { status: 'completed' });
      }).toThrow();
    });

    it('should update timestamp on update', () => {
      const original = registry.add(createTestRecord());

      // Wait a bit to ensure different timestamp
      setTimeout(() => {
        const updated = registry.update('INV-001', { status: 'partial' });

        expect(updated.updatedAt.getTime()).toBeGreaterThan(
          original.updatedAt.getTime()
        );
      }, 10);
    });
  });

  describe('delete', () => {
    it('should delete an investigation', () => {
      registry.add(createTestRecord());

      const deleted = registry.delete('INV-001');

      expect(deleted).toBe(true);
      expect(registry.getById('INV-001')).toBeNull();
    });

    it('should return false for non-existent ID', () => {
      const deleted = registry.delete('NON-EXISTENT');

      expect(deleted).toBe(false);
    });
  });

  describe('getAll', () => {
    it('should retrieve all investigations', () => {
      registry.add(createTestRecord('INV-001'));
      registry.add(createTestRecord('INV-002'));
      registry.add(createTestRecord('INV-003'));

      const all = registry.getAll();

      expect(all).toHaveLength(3);
    });

    it('should support limit and offset', () => {
      for (let i = 1; i <= 10; i++) {
        registry.add(createTestRecord(`INV-${i.toString().padStart(3, '0')}`));
      }

      const page1 = registry.getAll(5, 0);
      const page2 = registry.getAll(5, 5);

      expect(page1).toHaveLength(5);
      expect(page2).toHaveLength(5);
      expect(page1[0].id).not.toBe(page2[0].id);
    });
  });

  describe('getByType', () => {
    it('should retrieve investigations by type', () => {
      registry.add(createTestRecord('INV-001'));
      registry.add({ ...createTestRecord('INV-002'), type: 'performance-review' });

      const securityAudits = registry.getByType('security-audit');

      expect(securityAudits).toHaveLength(1);
      expect(securityAudits[0].type).toBe('security-audit');
    });
  });

  describe('getByStatus', () => {
    it('should retrieve investigations by status', () => {
      registry.add(createTestRecord('INV-001'));
      registry.add({ ...createTestRecord('INV-002'), status: 'failed' });

      const completed = registry.getByStatus('completed');

      expect(completed).toHaveLength(1);
      expect(completed[0].status).toBe('completed');
    });
  });

  describe('getByTag', () => {
    it('should retrieve investigations by tag', () => {
      registry.add(createTestRecord('INV-001'));
      registry.add({ ...createTestRecord('INV-002'), tags: ['other'] });

      const withSecurityTag = registry.getByTag('security');

      expect(withSecurityTag).toHaveLength(1);
      expect(withSecurityTag[0].tags).toContain('security');
    });
  });

  describe('getByAgent', () => {
    it('should retrieve investigations by agent', () => {
      registry.add(createTestRecord('INV-001'));
      registry.add({ ...createTestRecord('INV-002'), agents: ['ZEN', 'INO'] });

      const withTAN = registry.getByAgent('TAN');

      expect(withTAN).toHaveLength(1);
      expect(withTAN[0].agents).toContain('TAN');
    });
  });

  describe('getStatistics', () => {
    it('should calculate registry statistics', () => {
      registry.add(createTestRecord('INV-001'));
      registry.add({ ...createTestRecord('INV-002'), type: 'performance-review' });

      const stats = registry.getStatistics();

      expect(stats.totalInvestigations).toBe(2);
      expect(stats.byType['security-audit']).toBe(1);
      expect(stats.byType['performance-review']).toBe(1);
      expect(stats.byStatus['completed']).toBe(2);
      expect(stats.avgTokensUsed).toBe(1000);
      expect(stats.avgQualityScore).toBe(90);
    });
  });

  describe('count', () => {
    it('should count total investigations', () => {
      expect(registry.count()).toBe(0);

      registry.add(createTestRecord('INV-001'));
      expect(registry.count()).toBe(1);

      registry.add(createTestRecord('INV-002'));
      expect(registry.count()).toBe(2);
    });
  });

  describe('clear', () => {
    it('should clear all investigations', () => {
      registry.add(createTestRecord('INV-001'));
      registry.add(createTestRecord('INV-002'));

      expect(registry.count()).toBe(2);

      registry.clear();

      expect(registry.count()).toBe(0);
    });
  });
});
