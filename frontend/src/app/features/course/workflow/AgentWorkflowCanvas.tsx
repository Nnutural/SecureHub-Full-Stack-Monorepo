/**
 * 兼容旧 import：本文件曾承载方形 `WorkflowNodeCard` 节点的画布实现，
 * 已被升级为圆形 orb 节点适配层 `canvas/WorkflowCanvas`。
 *
 * 任何「从 features/course/workflow/AgentWorkflowCanvas 直接 import」的
 * 调用方都会通过下面这个 re-export 拿到新实现，不需要改 import path。
 */
import { WorkflowCanvas, type WorkflowCanvasProps } from './canvas/WorkflowCanvas';

export type AgentWorkflowCanvasProps = WorkflowCanvasProps;

export function AgentWorkflowCanvas(props: AgentWorkflowCanvasProps) {
  return <WorkflowCanvas {...props} />;
}
