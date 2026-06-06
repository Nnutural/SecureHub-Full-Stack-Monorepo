# Backend Workflow

## 改动前检查

- 先确认目标模块状态：`[real]` / `[mock]` / `[partial-real]` / `[planned]`。
- 新增业务逻辑不要写在 endpoint 中，路径应是 endpoint -> service -> agent / repository。
- 新增 endpoint、service、repository 时添加状态标注。
- 生成式能力必须接入 RAG 证据和 `agent_runs`。
- 不直接在业务代码中 `print()`，使用 `app.core.logging`。

## API 约定

- 响应用 Pydantic schema。
- 列表接口分页，返回 `{items, total, page, page_size}`。
- ID 使用 UUID 字符串。
- 时间字段使用 ISO 8601。
- 错误响应统一 `{detail: str, code?: str}`。

## Planned 目录落点

- 智能体：`backend/app/agents/<role>/`
- skill：`backend/app/agents/<role>/skills/<skill_name>.py`
- workflow：`backend/app/runtime/graphs/<scene>_<action>.py`
- RAG：`backend/app/rag/`
- 知识加载：`backend/app/knowledge/loaders/`
- 数据库：`backend/app/db/`
- 鉴权：`backend/app/auth/`
- SSE：`backend/app/streaming/`

## 测试

- endpoint 需要 happy path 集成测试。
- skill 需要 happy path 和缺证据测试。
- workflow 需要至少一个完整流程测试。
- RAG 和 guardrails 需要专项回归测试。
