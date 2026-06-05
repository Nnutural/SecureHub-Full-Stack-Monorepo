# Codegraph Structure Snapshot

Snapshot date: 2026-06-05
Source: `codegraph_files(format="tree", maxDepth=6, includeMetadata=true)`

## 顶层

- `backend/`：FastAPI 后端。
- `frontend/`：React + Vite 前端。
- `docs/`：旧版架构说明和计划文档，权威性低于 `CLAUDE.md`。
- `scripts/`：开发启动提示脚本。
- `docker-compose.yml`：双服务编排。

## Backend

- `backend/app/main.py`：FastAPI app factory + CORS。
- `backend/app/deps.py`：依赖别名。
- `backend/app/api/router.py`：聚合 v1 router。
- `backend/app/api/v1/api.py`：挂载子 router。
- `backend/app/api/v1/endpoints/`：
  - `health.py`
  - `system.py`
  - `placeholder.py`
  - `research.py`
  - `ctftime.py`
  - `policy.py`
- `backend/app/core/`：配置与日志。
- `backend/app/schemas/`：Pydantic schema。
- `backend/app/services/research_service.py`：research service。
- `backend/app/repositories/research_repository.py`：in-memory research repository。
- `backend/tests/`：health 和 research 测试。

## Frontend

- `frontend/src/main.tsx`：React 入口。
- `frontend/src/lib/api.ts`：统一 API 客户端。
- `frontend/src/app/App.tsx`：路由入口。
- `frontend/src/app/components/`：
  - `Layout.tsx`
  - `PageShell.tsx`
  - `EvidenceDrawer.tsx`
  - `GlobalSearch.tsx`
  - `DataTag.tsx`
  - `ui/` shadcn/Radix 基础组件。
- `frontend/src/app/pages/`：Landing、Workspace、Practice、Research、Writing、Chat、Forum、Careers、Tasks、Profile 及 legacy 页面。
- `frontend/src/app/features/`：
  - `workspace/`
  - `chat/`
  - `tasks/`
  - `writing/`
  - `forum/`
  - `careers/`
  - `profile/`
  - `research/`

## 观察

codegraph 当前索引到 268 个文件。部分文档、脚本、构建产物或空 planned 目录可能不出现在 codegraph 结构中，遇到不确定时以文件系统和 `CLAUDE.md` 补充确认。
