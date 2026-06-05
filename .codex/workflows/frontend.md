# Frontend Workflow

## 改动前检查

- 新功能优先放入活跃页面或对应 `features/<feature>/`。
- 不扩展 legacy 页面：Home、Planner、Assets、DataHub、DocStudio、IdeaLab、Opportunities、Recommender。
- 侧边栏导航修改位置：`frontend/src/app/components/Layout.tsx`。
- 二级 tab 按对应 feature 的 `types.ts` 和页面 `tabs` 结构扩展。

## 组件与状态

- 新组件优先使用 shadcn/ui 和 lucide-react。
- 新 feature 组件放在 `features/<feature>/components/`。
- 全局复用组件放在 `frontend/src/app/components/`。
- API 调用走 `frontend/src/lib/api.ts` 的统一封装，不直接散落 `fetch`。
- 状态扩展沿用现有 feature store，不引入 Redux / Zustand。

## A3 重点交互

- 流式输出使用 SSE / EventSource，并处理 progress、evidence、artifact、error、done 等事件。
- 证据卡片要展示来源、摘要和 evidence id。
- 多智能体路由可视化优先考虑 react-flow。
- 资源生成至少覆盖 doc、ppt、mindmap、quiz、lab、video storyboard 中的 5 类。

## 视觉约束

- 保持现有产品型后台风格，优先信息密度和可扫描性。
- 避免在工具型界面里加入营销式 hero 或装饰性大卡片。
- 按现有 Tailwind / shadcn 习惯实现，不引入新的 UI 体系。
