// Status: mock
import type { ProfileDTO } from '@/lib/sse.types';

export const mockProfile: ProfileDTO = {
  user_id: '00000000-0000-0000-0000-000000000001',
  dimensions: {
    knowledge_base: 'beginner',
    learning_goal: 'web_security',
    style: 'case_driven',
    prior_courses: [],
    language: 'zh',
    cognitive_load: 'medium',
  },
  capabilities: [
    { dimension: 'Web 安全基础', score: 0.42, confidence: 0.68, evidence_count: 3 },
    { dimension: 'SQL 注入识别', score: 0.38, confidence: 0.63, evidence_count: 3 },
    { dimension: '安全编码', score: 0.34, confidence: 0.58, evidence_count: 2 },
    { dimension: '证据引用', score: 0.46, confidence: 0.72, evidence_count: 4 },
    { dimension: '实操复盘', score: 0.31, confidence: 0.55, evidence_count: 1 },
  ],
  updated_at: '2026-06-09T00:00:00Z',
};
