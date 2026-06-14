import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { isMockMode } from '@/lib/mock';
import type { CourseCatalogItem } from '../catalog/courseCatalog.types';
import { LearningCompanionPanel } from '../companion/LearningCompanionPanel';
import { AgentWorkflowCanvas } from '../workflow/AgentWorkflowCanvas';
import { WorkflowPanelRail } from '../workflow/WorkflowPanelRail';
import { useWorkflowPanelCollapsed } from '../workflow/useWorkflowPanelCollapsed';
import { useWorkflowRun } from '../workflow/useWorkflowRun';
import { workflowById } from '../workflow/workflows';
import type { WorkflowDefinition } from '../workflow/types';
import { ResourceShowcaseTray } from './ResourceShowcaseTray';

export function CourseDialogueMode({ course }: { course: CourseCatalogItem }) {
  const [workflowId, setWorkflowId] = useState<WorkflowDefinition['id']>(course.defaultWorkflowId);

  useEffect(() => {
    setWorkflowId(course.defaultWorkflowId);
  }, [course.defaultWorkflowId, course.id]);

  const workflow = useMemo(() => workflowById[workflowId], [workflowId]);
  const workflowRun = useWorkflowRun(workflow);
  const mockControlsEnabled = isMockMode();
  const { collapsed, mode, toggle, setCollapsed } = useWorkflowPanelCollapsed();
  const [overlayOpen, setOverlayOpen] = useState(false);

  // overlay 模式下「展开」= 打开抽屉；inline 模式下「展开」= 切 collapsed
  const showWorkflow = useCallback(() => {
    if (mode === 'overlay') {
      setOverlayOpen(true);
      return;
    }
    if (collapsed) setCollapsed(false);
  }, [collapsed, mode, setCollapsed]);

  const hideWorkflow = useCallback(() => {
    if (mode === 'overlay') {
      setOverlayOpen(false);
      return;
    }
    if (!collapsed) setCollapsed(true);
  }, [collapsed, mode, setCollapsed]);

  // 切换课程时关闭 overlay，避免新课程开局就被遮罩。
  useEffect(() => {
    setOverlayOpen(false);
  }, [course.id]);

  // 在 inline 模式下根据折叠状态切换 grid 列宽；overlay 模式下右列固定 0。
  const gridClass = useMemo(() => {
    if (mode === 'overlay') return 'grid gap-5 grid-cols-[minmax(0,1fr)]';
    if (collapsed) return 'grid gap-5 xl:grid-cols-[minmax(0,1fr)_48px]';
    return 'grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px] 2xl:grid-cols-[minmax(0,1fr)_420px]';
  }, [collapsed, mode]);

  const canvas = (
    <AgentWorkflowCanvas
      workflow={workflow}
      runState={workflowRun.state}
      onWorkflowChange={setWorkflowId}
      onRun={workflowRun.run}
      onPause={workflowRun.pause}
      onReset={workflowRun.reset}
      mockControlsEnabled={mockControlsEnabled}
      compact
      onCollapse={hideWorkflow}
    />
  );

  return (
    <div className="space-y-3">
      <div className={gridClass}>
        <LearningCompanionPanel
          course={course}
          onMockWorkflowRun={workflowRun.run}
          onExternalWorkflowBegin={workflowRun.beginExternalRun}
          onWorkflowTrace={workflowRun.applyTrace}
          onShowWorkflow={showWorkflow}
          workflowCollapsed={mode === 'overlay' ? !overlayOpen : collapsed}
        />

        {mode === 'inline' && (
          <div className="hidden xl:block">
            {collapsed ? (
              <WorkflowPanelRail runState={workflowRun.state} onExpand={() => toggle()} />
            ) : (
              canvas
            )}
          </div>
        )}
      </div>

      <ResourceShowcaseTray runState={workflowRun.state} />

      {/* overlay drawer：< 1024px 屏宽时使用，不挤压对话区 */}
      {mode === 'overlay' && overlayOpen && (
        <div
          className="fixed inset-0 z-40 flex items-stretch justify-end bg-slate-950/30 backdrop-blur-sm"
          role="dialog"
          aria-label="智能体编排图"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOverlayOpen(false);
          }}
        >
          <motion.div
            key="workflow-overlay"
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative h-full w-full max-w-[480px] bg-white p-3 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setOverlayOpen(false)}
              aria-label="关闭编排图"
              className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
            {canvas}
          </motion.div>
        </div>
      )}
    </div>
  );
}
