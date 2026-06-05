# Architecture Rules

这些规则来自 `CLAUDE.md` §3 和 §19。违反任一项都应视为实现方向错误。

## 智能体边界

- 永远保持 9 个智能体角色，不新增第 10 个角色。
- 固定角色：
  - `policy_interpreter`
  - `hot_analyst`
  - `job_analyst`
  - `competition_advisor`
  - `career_planner`
  - `topic_explorer`
  - `doc_archivist`
  - `task_orchestrator`
  - `outcome_evaluator`
- A3 新能力必须作为现有智能体的 skill 叠加。

## 横切基础设施

以下能力不算智能体，只能作为框架层、service 或 middleware：

- 多源数据采集：`backend/app/knowledge/loaders/`
- 知识检索与证据链：`backend/app/rag/`
- 系统调度与编排：`backend/app/runtime/`
- 安全监控与合规审核：`backend/app/runtime/guardrails/`

## 数据与画像

- 所有 domain 共用 `documents` + `chunks`，用 `domain` 字段区分。
- 不要新增 `course_chunks`、`fund_chunks` 等并列表。
- `user_profiles` 是全平台唯一画像源。
- 画像更新统一走 `outcome_evaluator.update_capability` 和 `career_planner.update_persona`。

## 生成与日志

- 生成式 skill 必须先经 `rag/retriever.py` 取证据，再拼 prompt。
- 生成结果必须绑定 `evidence_chunk_ids`。
- 所有智能体调用必须落 `agent_runs`。
- 新增 endpoint / service / repository 必须标注 `# Status: [real] / [mock] / [partial-real]`。

## 文档同步

- 修改架构、数据库、智能体清单、铁律或差异决策时，必须同步更新 `CLAUDE.md` §19。
