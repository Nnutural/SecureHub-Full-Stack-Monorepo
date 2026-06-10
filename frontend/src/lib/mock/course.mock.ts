// Status: mock
import type { SSEHandlers } from '@/lib/sse';
import type { ResourceType, SSEEvent } from '@/lib/sse.types';
import type { AssessmentReport } from '@/app/features/course/types';
import { mockAgentRuns } from './agents.mock';
import { mockEvidenceChunks } from './evidence.mock';
import { replaySSEEvents } from './sse-replay';

export const mockCourse = {
  id: '00000000-0000-0000-0000-000000000101',
  code: 'course_websec_intro',
  title: 'Web 安全基础',
  description: '围绕 SQL 注入、XSS、CSRF、文件上传与 SSRF 的入门课程。',
  progress: 0.35,
};

export const mockKnowledgeNodes = [
  { id: 'sqli', title: 'SQL 注入基础', status: 'active' },
  { id: 'xss', title: 'XSS 跨站脚本', status: 'ready' },
  { id: 'csrf', title: 'CSRF 请求伪造', status: 'ready' },
  { id: 'upload', title: '文件上传风险', status: 'locked' },
  { id: 'ssrf', title: 'SSRF 服务端请求伪造', status: 'locked' },
];

const resourceTitle: Record<ResourceType, string> = {
  doc: 'SQL 注入基础讲解文档',
  ppt: 'SQL 注入课堂演示大纲',
  mindmap: 'SQL 注入知识结构图',
  quiz: 'SQL 注入练习题',
  lab: 'SQL 注入实操案例',
  video: 'SQL 注入视频脚本',
  readings: 'SQL 注入拓展阅读',
};

const skillByType: Record<ResourceType, string> = {
  doc: 'GenerateCourseDoc',
  ppt: 'GenerateCoursePPT',
  mindmap: 'GenerateMindmap',
  quiz: 'GenerateQuiz',
  lab: 'GenerateHandsOnLab',
  video: 'GenerateVideoStoryboard',
  readings: 'RecommendReadings',
};

function resourceContent(type: ResourceType): string {
  const common = [
    'SQL 注入的核心风险，是把用户输入错误地当成 SQL 语法执行。',
    '学习时先识别输入进入查询的位置，再区分回显、报错、布尔盲注和时间盲注。',
    '修复时优先使用参数化查询，并配合最小权限、输入约束和日志审计。',
  ];

  const byType: Record<ResourceType, string[]> = {
    doc: ['### SQL 注入基础', '', ...common, '', '#### 学习任务', '- 判断注入点', '- 解释参数化查询', '- 完成一次修复复盘'],
    ppt: ['# SQL 注入基础', '## 风险来源', '## 典型判断流程', '## 参数化查询修复', '## 课堂练习'],
    mindmap: ['SQL 注入', '- 成因', '  - 字符串拼接', '  - 权限过大', '- 判断', '  - 报错', '  - 布尔', '  - 时间', '- 防护', '  - 参数化查询', '  - 最小权限'],
    quiz: ['题目：为什么参数化查询可以降低 SQL 注入风险？', 'A. 把用户输入作为数据绑定', 'B. 自动关闭数据库', 'C. 隐藏错误页面即可解决', '答案：A'],
    lab: ['实验目标：修复一个登录接口中的字符串拼接查询。', '步骤 1：定位 vulnerableLogin 中的 SQL 拼接。', '步骤 2：改为参数化查询。', '步骤 3：使用正常账号和注入 payload 做回归验证。'],
    video: ['分镜 1：展示登录表单和风险输入。', '分镜 2：解释输入如何进入查询语句。', '分镜 3：用参数化查询修复。', '分镜 4：展示修复前后对比。'],
    readings: ['1. OWASP SQL Injection 官方说明', '2. PortSwigger Web Security Academy SQL 注入专题', '3. B 站课堂演示转写片段：注入点判断与修复复盘'],
  };

  return byType[type].join('\n');
}

function tokenEvents(content: string): SSEEvent[] {
  const pieces = content.match(/.{1,14}/gs)?.slice(0, 30) ?? [content];
  while (pieces.length < 30) pieces.push('');
  return pieces.map((content, index) => ({ event: 'token', data: { content, index: index + 1 } }));
}

function buildStream(type: ResourceType): SSEEvent[] {
  const run = {
    run_id: `mock-run-${type}`,
    workflow_name: 'course_learning',
    agent_name: type === 'quiz' ? 'competition_advisor' : type === 'lab' ? 'topic_explorer' : type === 'readings' ? 'hot_analyst' : 'doc_archivist',
    skill_name: skillByType[type],
    status: 'running',
    duration_ms: null,
    quality_score: null,
    created_at: new Date().toISOString(),
  };

  return [
    { event: 'progress', data: { node_name: 'validate', agent_id: run.agent_name, skill_id: run.skill_name, percentage: 10, status: 'running' } },
    { event: 'progress', data: { node_name: 'retrieve', agent_id: run.agent_name, skill_id: run.skill_name, percentage: 32, status: 'running' } },
    { event: 'progress', data: { node_name: 'compose', agent_id: run.agent_name, skill_id: run.skill_name, percentage: 48, status: 'running' } },
    { event: 'progress', data: { node_name: 'quality_check', agent_id: 'outcome_evaluator', skill_id: 'QualityCheck', percentage: 76, status: 'running' } },
    { event: 'evidence', data: mockEvidenceChunks },
    ...tokenEvents(resourceContent(type)),
    {
      event: 'artifact',
      data: {
        resource_id: `mock-resource-${type}`,
        resource_type: type,
        object_key: `local/course/${type}.md`,
        title: resourceTitle[type],
      },
    },
    {
      event: 'trace',
      data: {
        ...run,
        status: 'success',
        duration_ms: 1680,
        quality_score: 0.86,
      },
    },
    { event: 'done', data: { run_id: `mock-run-${type}`, final_output_ref: `generated_resources/mock-resource-${type}`, quality_score: 0.86 } },
  ];
}

export function replayResourceGeneration(type: ResourceType, handlers: SSEHandlers): () => void {
  if (typeof window !== 'undefined' && window.localStorage.getItem('securehub-mock-insufficient') === '1') {
    return replaySSEEvents([
      {
        event: 'error',
        data: { code: 'InsufficientEvidence', message: '当前知识点证据不足，请补充资料后重试。', recoverable: true },
      },
    ], handlers);
  }
  return replaySSEEvents(buildStream(type), handlers, 90);
}

export function replayPersonaChat(message: string, handlers: SSEHandlers): () => void {
  const content = [
    '我会先确认你的基础、目标和偏好的学习方式。',
    message.includes('Python') ? '你已经有 Python 基础，可以从 Web 请求、数据库查询和参数绑定切入。' : '如果你不确定基础，我会先从 HTTP 请求和 SQL 查询关系问起。',
    '下一步建议选择 SQL 注入基础作为当前知识点，并生成讲解文档与实操案例。',
  ].join('');
  return replaySSEEvents([
    { event: 'progress', data: { node_name: 'persona_dialogue', agent_id: 'career_planner', skill_id: 'BuildLearningPersona', percentage: 25, status: 'running' } },
    { event: 'evidence', data: mockEvidenceChunks.slice(0, 2) },
    ...tokenEvents(content).slice(0, 12),
    { event: 'trace', data: { ...mockAgentRuns[0], run_id: 'mock-persona-run', status: 'success' } },
    { event: 'done', data: { run_id: 'mock-persona-run', final_output_ref: 'user_profiles/mock', quality_score: 0.87 } },
  ], handlers, 100);
}

export function replayTutorAsk(question: string, handlers: SSEHandlers): () => void {
  const content = `当前学习：SQL 注入基础。针对“${question}”，可以先判断用户输入是否被拼进查询，再用参数化查询修复；证据面板会保留 OWASP、PortSwigger 和视频转写来源。`;
  return replaySSEEvents([
    { event: 'progress', data: { node_name: 'route', agent_id: 'career_planner', skill_id: 'RouteTutorQuestion', percentage: 20, status: 'running' } },
    { event: 'evidence', data: mockEvidenceChunks },
    ...tokenEvents(content).slice(0, 16),
    { event: 'trace', data: { run_id: 'mock-tutor-run', workflow_name: 'course_learning', agent_name: 'career_planner', skill_name: 'RouteTutorQuestion', status: 'success', duration_ms: 1260, quality_score: 0.84, created_at: new Date().toISOString() } },
    { event: 'done', data: { run_id: 'mock-tutor-run', final_output_ref: 'agent_messages/mock-tutor', quality_score: 0.84 } },
  ], handlers, 95);
}

export async function replayAssessment(answers: Array<Record<string, unknown>>): Promise<AssessmentReport> {
  await new Promise((resolve) => window.setTimeout(resolve, 360));
  const answered = answers.length;
  return {
    score: answered >= 2 ? 0.82 : 0.58,
    scoreVector: { web_security: 0.48, sqli: 0.52, secure_coding: 0.44 },
    feedback: [
      '参数化查询理解较好，建议继续练习不同数据库的绑定写法。',
      '对布尔盲注和时间盲注的判断步骤还需要补一轮实操。',
    ],
    updatedProfile: { weak_points: '布尔盲注与时间盲注判断步骤' },
    updatedCapabilities: [
      { dimension: 'SQL 注入识别', score: 0.52, confidence: 0.7, evidence_count: 4 },
      { dimension: '安全编码', score: 0.44, confidence: 0.62, evidence_count: 3 },
      { dimension: '实操复盘', score: 0.4, confidence: 0.58, evidence_count: 2 },
    ],
  };
}
