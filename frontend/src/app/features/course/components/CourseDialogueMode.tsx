import { useEffect, useMemo, useState } from 'react';
import { isMockMode } from '@/lib/mock';
import type { CourseCatalogItem } from '../catalog/courseCatalog.types';
import { LearningCompanionPanel } from '../companion/LearningCompanionPanel';
import { AgentWorkflowCanvas } from '../workflow/AgentWorkflowCanvas';
import { useWorkflowRun } from '../workflow/useWorkflowRun';
import { workflowById } from '../workflow/workflows';
import type { WorkflowDefinition } from '../workflow/types';
import { ResourceShowcaseTray } from './ResourceShowcaseTray';

export function CourseDialogueMode({ course }: { course: CourseCatalogItem }) {
  const [workflowId, setWorkflowId] = useState<WorkflowDefinition['id']>(course.defaultWorkflowId);

  // 课程切换：把工作流模板复位到该课程默认的工作流。
  useEffect(() => {
    setWorkflowId(course.defaultWorkflowId);
  }, [course.defaultWorkflowId, course.id]);

  const workflow = useMemo(() => workflowById[workflowId], [workflowId]);
  const workflowRun = useWorkflowRun(workflow);
  const mockControlsEnabled = isMockMode();

  return (
    <div className="space-y-3">
      <div className="grid gap-4 xl:grid-cols-[minmax(320px,5fr)_minmax(0,7fr)]">
        <LearningCompanionPanel
          course={course}
          onMockWorkflowRun={workflowRun.run}
          onExternalWorkflowBegin={workflowRun.beginExternalRun}
          onWorkflowTrace={workflowRun.applyTrace}
        />
        <AgentWorkflowCanvas
          workflow={workflow}
          runState={workflowRun.state}
          onWorkflowChange={setWorkflowId}
          onRun={workflowRun.run}
          onPause={workflowRun.pause}
          onReset={workflowRun.reset}
          mockControlsEnabled={mockControlsEnabled}
        />
      </div>
      <ResourceShowcaseTray runState={workflowRun.state} />
    </div>
  );
}
