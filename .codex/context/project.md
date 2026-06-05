# Project Context

## 一句话定位

SecureHub / CyberLadder 是面向网络安全人才培养的智能化产教研融合中枢系统，覆盖入门学习、竞赛备赛、科研创新、就业对接等周期；A3 软件杯主战场是“基于多智能体的个性化课程学习”。

## 赛事与演示重点

- 挑战杯叙事：网络安全人才培养中枢。
- 软件杯 A3 叙事：个性化资源生成与学习多智能体系统。
- 演示重点：课程学习主线走满，研究/竞赛/就业等中枢能力作为延展证明。

## 技术栈

- 前端：React 18 + Vite 6 + TypeScript + Tailwind v4 + shadcn/ui，已有 lucide-react、Radix、recharts、motion 等依赖。
- 后端：FastAPI + Pydantic + pytest，当前以 mock / partial-real 能力为主。
- 部署：顶层 `docker-compose.yml` 编排 frontend 和 backend。

## 当前实现状态

- 前端活跃页面：Landing、Workspace、Practice、Research、Writing、Chat、Forum、Careers、Tasks、Profile。
- 前端 legacy 页面：Home、Planner、Assets、DataHub、DocStudio、IdeaLab、Opportunities、Recommender。不要在这些页面扩展新功能。
- 后端已实现基础 API：health、system、placeholder、research、ctftime、policy。
- 后端 planned 区域：agents、runtime、llm、rag、knowledge、db、auth、streaming。

## A3 核心需求

- 对话式学生画像，至少 6 个维度。
- 画像随学习行为更新。
- 显式多智能体协作。
- 生成 5 种以上学习资源。
- 个性化学习路径、资源推荐、流式输出和进度追踪。
- 防幻觉与内容安全过滤。
- 使用讯飞星火 / TTS，并在文档中标注。
