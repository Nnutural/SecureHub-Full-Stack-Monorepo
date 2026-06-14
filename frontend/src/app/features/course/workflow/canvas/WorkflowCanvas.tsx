import type { WorkflowDefinition, WorkflowRunState } from '../types';
import { ReactFlowWorkflowCanvas } from './ReactFlowWorkflowCanvas';

/**
 * `WorkflowCanvas` 是对外稳定的工作流可视化接口。
 *
 * 当前实现走 ReactFlow，后续若要替换为其它图引擎（dagre-d3 / VisX /
 * sigma.js / langgraph-studio web 等），只需新建 XxxWorkflowCanvas 并在
 * 这里切换实现，业务侧（`CourseDialogueMode`、`AgentWorkflowCanvas`
 * re-export）保持不变。
 */
export type WorkflowCanvasProps = {
  workflow: WorkflowDefinition;
  runState: WorkflowRunState;
  onWorkflowChange: (workflowId: WorkflowDefinition['id']) => void;
  onRun: () => void;
  onPause: () => void;
  onReset: () => void;
  mockControlsEnabled?: boolean;
};

export function WorkflowCanvas(props: WorkflowCanvasProps) {
  return <ReactFlowWorkflowCanvas {...props} />;
}
