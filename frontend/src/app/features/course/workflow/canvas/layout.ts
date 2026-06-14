import type { AgentId, WorkflowDefinition, WorkflowNode } from '../types';

/**
 * 9 智能体在圆形 orb 画布上的位置。
 *
 * 设计：career_planner 在左侧作为入口、task_orchestrator 居中作路径编排、4 个生产
 * 智能体在右侧并行环上、outcome_evaluator 在最右作质量闸门；policy_interpreter 与
 * job_analyst 作为「本轮跳过」浮在底部，仍能被评委一眼数到 9 个。
 *
 * 坐标基于 ReactFlow，按 800x460 画布手动布局；圆形 orb 直径 72px，
 * 因此 x/y 给的是节点中心 - 36px 的左上角。
 */
const orbPositions: Record<AgentId, { x: number; y: number }> = {
  career_planner: { x: 36, y: 184 },
  task_orchestrator: { x: 224, y: 184 },
  doc_archivist: { x: 432, y: 36 },
  competition_advisor: { x: 504, y: 140 },
  topic_explorer: { x: 504, y: 240 },
  hot_analyst: { x: 432, y: 332 },
  outcome_evaluator: { x: 660, y: 184 },
  // 「跳过」节点压在底部，作为「9 个智能体都在」的视觉证据
  policy_interpreter: { x: 144, y: 360 },
  job_analyst: { x: 312, y: 376 },
};

/** 把 `WorkflowDefinition` 中的 position 改为本布局，得到画布渲染用的节点列表。 */
export function applyOrbLayout(workflow: WorkflowDefinition): WorkflowNode[] {
  return workflow.nodes.map((node) => ({
    ...node,
    position: orbPositions[node.agentId] ?? node.position,
  }));
}

export const ORB_DIAMETER = 72;
