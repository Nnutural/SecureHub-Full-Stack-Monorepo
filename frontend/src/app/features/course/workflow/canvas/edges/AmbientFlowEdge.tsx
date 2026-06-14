import { EdgeLabelRenderer, getBezierPath, type EdgeProps } from 'reactflow';
import type { EdgeStatus } from '../../types';

export type AmbientEdgeData = {
  status: EdgeStatus;
  label?: string;
};

/**
 * 轻量边：
 * - idle：淡灰极细虚线，几乎不抢视觉；
 * - active：品牌蓝双层流光，沿路径粒子；
 * - done：极细绿色实线。
 *
 * 设计目标：让画布像辅助编排图，而不是后台 DAG，因此 stroke 比上一版更细
 * （1.1 / 1.8），idle 间隔更稀疏。
 */
export function AmbientFlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps<AmbientEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.22,
  });

  const status = data?.status ?? 'idle';
  const isActive = status === 'active';
  const isDone = status === 'done';
  const stroke = isActive ? '#003399' : isDone ? '#10b981' : '#cbd5e1';

  return (
    <>
      {/* 底层细线 */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        markerEnd={markerEnd}
        style={{
          stroke,
          strokeOpacity: isActive ? 0.92 : isDone ? 0.6 : 0.45,
          strokeWidth: isActive ? 1.8 : 1.1,
          strokeDasharray: status === 'idle' ? '3 8' : undefined,
          strokeLinecap: 'round',
        }}
      />

      {isActive && (
        <>
          {/* 浅色发光层 */}
          <path
            d={edgePath}
            fill="none"
            style={{
              stroke: '#003399',
              strokeOpacity: 0.18,
              strokeWidth: 6,
              strokeLinecap: 'round',
            }}
          />
          {/* 沿路径流动的粒子 */}
          <circle r={3} fill="#003399" opacity={0.92}>
            <animateMotion dur="1.4s" repeatCount="indefinite" path={edgePath} />
          </circle>
          <circle r={2} fill="#5b8def" opacity={0.85}>
            <animateMotion dur="1.4s" begin="0.5s" repeatCount="indefinite" path={edgePath} />
          </circle>
        </>
      )}

      {data?.label && (
        <EdgeLabelRenderer>
          <div
            className="pointer-events-none absolute select-none rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-medium text-slate-500 shadow-sm ring-1 ring-slate-200/80 backdrop-blur"
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
