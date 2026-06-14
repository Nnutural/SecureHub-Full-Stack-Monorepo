import { useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  MarkerType,
  MiniMap,
  ReactFlowProvider,
  type Edge,
  type Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Gauge, Maximize2, Pause, Play, RotateCcw, Sparkles } from 'lucide-react';
import { AgentDetailSheet } from '../AgentDetailSheet';
import type { WorkflowDefinition, WorkflowRunState } from '../types';
import { AGENT_CATALOG, workflowDefinitions } from '../workflows';
import { AmbientFlowEdge, type AmbientEdgeData } from './edges/AmbientFlowEdge';
import { AgentOrbNode, type AgentOrbNodeData } from './nodes/AgentOrbNode';
import { applyOrbLayout } from './layout';

const nodeTypes = { agentOrb: AgentOrbNode };
const edgeTypes = { ambientFlow: AmbientFlowEdge };

const phaseLabel: Record<WorkflowRunState['phase'], string> = {
  idle: '待运行',
  running: '运行中',
  paused: '已暂停',
  done: '已完成',
};

const phaseTone: Record<WorkflowRunState['phase'], string> = {
  idle: 'bg-slate-100 text-slate-600',
  running: 'bg-brand-blue-50 text-brand-blue-700',
  paused: 'bg-amber-50 text-amber-700',
  done: 'bg-emerald-50 text-emerald-700',
};

export function ReactFlowWorkflowCanvas({
  workflow,
  runState,
  onWorkflowChange,
  onRun,
  onPause,
  onReset,
  mockControlsEnabled = true,
}: {
  workflow: WorkflowDefinition;
  runState: WorkflowRunState;
  onWorkflowChange: (workflowId: WorkflowDefinition['id']) => void;
  onRun: () => void;
  onPause: () => void;
  onReset: () => void;
  mockControlsEnabled?: boolean;
}) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();
  const [minimapOpen, setMinimapOpen] = useState(false);

  // 圆形 orb 布局：覆盖 workflows.ts 里的方形矩阵坐标
  const laidOutNodes = useMemo(() => applyOrbLayout(workflow), [workflow]);
  const selectedNode = laidOutNodes.find((node) => node.id === selectedNodeId);
  const selectedRun = selectedNode ? runState.nodes[selectedNode.id] : undefined;

  const nodes = useMemo<Node<AgentOrbNodeData>[]>(
    () =>
      laidOutNodes.map((node) => ({
        id: node.id,
        type: 'agentOrb',
        position: node.position,
        data: {
          node,
          run: runState.nodes[node.id],
          meta: AGENT_CATALOG[node.agentId],
        },
      })),
    [laidOutNodes, runState.nodes],
  );

  const edges = useMemo<Edge<AmbientEdgeData>[]>(
    () =>
      workflow.edges.map((edge) => {
        const status = runState.edges[edge.id]?.status ?? 'idle';
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: 'ambientFlow',
          data: { status, label: edge.dataLabel },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: status === 'active' ? '#003399' : status === 'done' ? '#10b981' : '#cbd5e1',
            width: 14,
            height: 14,
          },
        };
      }),
    [runState.edges, workflow.edges],
  );

  const qualityText =
    runState.overallQuality == null ? '待评估' : `${Math.round(runState.overallQuality * 100)}%`;

  return (
    <section
      className="relative flex min-h-[640px] min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-b from-white via-white to-slate-50/80 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]"
      aria-label="9 智能体工作流画布"
    >
      <header className="absolute left-3 right-3 top-3 z-20 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200/70 bg-white/85 px-3 py-2 shadow-sm backdrop-blur">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex h-7 items-center gap-1 rounded-full bg-brand-blue-50 px-2 text-xs font-medium text-brand-blue-700">
            <Sparkles className="h-3 w-3" />
            9 智能体编排
          </span>
          <span
            className={`inline-flex h-7 items-center rounded-full px-2 text-xs ${phaseTone[runState.phase]}`}
          >
            {phaseLabel[runState.phase]}
          </span>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-1.5">
          <label className="sr-only" htmlFor="course-workflow-select">
            工作流模板
          </label>
          <select
            id="course-workflow-select"
            value={workflow.id}
            onChange={(event) => onWorkflowChange(event.target.value as WorkflowDefinition['id'])}
            className="h-7 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700"
            aria-label="工作流模板"
          >
            {workflowDefinitions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onRun}
            disabled={!mockControlsEnabled}
            title={mockControlsEnabled ? '运行 mock 工作流回放' : '真后端模式由 SSE trace 驱动'}
            className="inline-flex h-7 items-center gap-1 rounded-lg bg-brand-blue-600 px-2 text-xs font-medium text-white hover:bg-brand-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Play className="h-3 w-3" />
            运行
          </button>
          <button
            type="button"
            onClick={onPause}
            disabled={!mockControlsEnabled || runState.phase !== 'running'}
            className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Pause className="h-3 w-3" />
            暂停
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={!mockControlsEnabled}
            className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="h-3 w-3" />
            重置
          </button>
          <button
            type="button"
            onClick={() => setMinimapOpen((value) => !value)}
            title={minimapOpen ? '折叠概览' : '展开概览'}
            aria-pressed={minimapOpen}
            className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 hover:bg-slate-50"
          >
            <Maximize2 className="h-3 w-3" />
            概览
          </button>
          <div className="inline-flex h-7 items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 text-xs font-medium text-emerald-700">
            <Gauge className="h-3 w-3" />
            质量 {qualityText}
          </div>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 pt-16">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable
            fitView
            fitViewOptions={{ padding: 0.22 }}
            minZoom={0.55}
            maxZoom={1.25}
            proOptions={{ hideAttribution: true }}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(undefined)}
          >
            <Background color="#dbe3ef" gap={26} size={1} variant={BackgroundVariant.Dots} />
            {minimapOpen && (
              <MiniMap
                pannable={false}
                zoomable={false}
                className="!rounded-lg !bg-white/80 !shadow-sm !ring-1 !ring-slate-200"
                nodeColor={(node) => {
                  const status = runState.nodes[node.id]?.status;
                  if (status === 'running') return '#003399';
                  if (status === 'success') return '#10b981';
                  if (status === 'failed') return '#dc2626';
                  if (status === 'skipped') return '#f59e0b';
                  return '#cbd5e1';
                }}
                maskColor="rgba(248,250,252,0.6)"
              />
            )}
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      <footer className="grid grid-cols-3 gap-2 border-t border-slate-100 bg-white/70 px-4 py-2 text-[10px] text-slate-500 backdrop-blur">
        <span>
          <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-brand-blue-600 align-middle" />
          运行中节点带柔和呼吸光晕
        </span>
        <span>
          <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle" />
          完成后流向下游质量闸门
        </span>
        <span>
          <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-amber-500 align-middle" />
          跳过节点保留以呈现 9 智能体
        </span>
      </footer>

      <AgentDetailSheet
        open={Boolean(selectedNodeId)}
        onOpenChange={(open) => !open && setSelectedNodeId(undefined)}
        workflow={workflow}
        node={selectedNode}
        run={selectedRun}
      />
    </section>
  );
}
