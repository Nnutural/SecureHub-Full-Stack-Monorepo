# Codex Workspace

本目录保存 Codex 会话使用的项目上下文与工作框架。仓库权威文档仍然是根目录的 `CLAUDE.md`；如果本目录内容与 `CLAUDE.md` 或代码现状冲突，以代码和 `CLAUDE.md` 为准，并同步更新这里。

## 目录

- `context/project.md`：项目定位、技术栈、当前模块状态。
- `context/architecture-rules.md`：从 `CLAUDE.md` 提炼的不可违反架构约束。
- `context/codegraph-structure.md`：基于 codegraph 的项目结构快照。
- `workflows/backend.md`：后端改动前检查项与落点约定。
- `workflows/frontend.md`：前端改动前检查项与落点约定。
- `templates/implementation-plan.md`：较大改动的计划模板。
- `plans/`：后续任务计划或拆解记录。
- `sessions/`：重要会话记录或交接摘要。

## 每次开工前

1. 先读 `CLAUDE.md` 的 §3、§19、§20.5。
2. 使用 codegraph 查看目标区域结构，再改文件。
3. 检查 `git status`，不要覆盖用户或工具已产生的无关改动。
4. 判断目标代码状态是 `[real]` / `[mock]` / `[partial-real]` / `[planned]` / `[legacy]`。
5. 涉及架构、数据库、智能体清单变化时，同步更新 `CLAUDE.md` 对应章节。
