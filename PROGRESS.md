# PROGRESS.md

## 1. 当前状态
- 当前里程碑：M1 骨架与部署（进行中，M1-1 已完成）
- 整体进度：约 15%，工具链与三标签页骨架就绪，尚无业务逻辑
- 项目当前能否运行：能（本地 `npm run dev`，尚未部署）
- 最后更新：2026-11-23

## 2. 里程碑清单
- [ ] M1 骨架与部署
- [ ] M2 看板
- [ ] M3 JD 录入与解析
- [ ] M4 技能与差距分析
- [ ] M5 打磨
- [ ] M6 作品帖素材

## 3. 当前任务
- 任务：M1-2 实现 `lib/storage.ts`（loadJobs/saveJobs/loadSkills/saveSkills，try/catch、损坏数据备份、`StorageError`）及单元测试；同时去掉 test 脚本中的 `--passWithNoTests`
- 涉及模块 / 文件：`src/lib/storage.ts`、`src/lib/storage.test.ts`、`src/types.ts`（`StorageError` 类型）
- 完成标志：测试覆盖正常读写、localStorage 不可用、写满、损坏 JSON 的备份与重置；`npm run test`、`npm run lint`、`npm run build` 通过
- 当前卡点：无

## 4. 下一步
1. M1-2：存储封装与单元测试（见上）
2. M1-3：实现 `lib/seed.ts` 示例数据（5～6 条岗位 + 若干已掌握技能），首次打开自动载入，并显示"清空示例"提示条
3. M1-4：先部署一次到 Qoder Sites，验证构建命令、产物目录、localStorage 是否可用，把结论写入第 7 节和 DESIGN.md 第 14 节
4. M2：看板（以上全部完成后再开始；安装 dnd-kit 前先确认配套版本号）

## 5. 已完成记录
- 2026-11-23 M1-1 项目初始化与三标签页骨架：
  - Vite 5.4 + React 18.3 + TS 5.6 + Tailwind 3.4 + Vitest 2.1 + ESLint 9，按 DESIGN §4 锁主版本；dnd-kit 未安装（M2 再加）
  - `src/types.ts` 落地 §7 数据模型与状态常量；`App.tsx` 状态切换标签（无路由）；三个空状态页面 + TabBar / EmptyState / CompassLogo 组件
  - 靛蓝主色、罗盘标志、入场动效、自定义滚动条；"＋ 粘贴 JD"为禁用占位（M3 启用）
  - 验证：build / lint / test 通过；内置浏览器脚本点击实测三标签切换正常、控制台无报错、825px 与 375px（iframe 模拟）均无横向溢出
  - Git 初始化：main 文档基线，feat/m1-skeleton 开发并合并

**更早的摘要**：无。

## 6. 遗留问题与技术债
| 问题 | 影响 | 计划处理时间 / 里程碑 |
|---|---|---|
| test 脚本含 `--passWithNoTests`（当前无测试文件） | 无测试时也显示通过 | M1-2 有真实测试后移除 |

## 7. 待我决策的问题
- Qoder Sites 是否支持后端函数 / 调用大模型？（M1-4 部署验证后决定是否做大模型解析，在此之前一律按纯前端开发）
- DESIGN §4 中 @dnd-kit/sortable 写为 6.x，但该包没有 6.x 版本线；M2 安装前由 AI 给出配套版本号再确认
- （已解决 2026-11-23：产品名称定为"实习罗盘"，主色靛蓝；Node 用当前环境的 24，文档已同步）

## 8. 踩坑记录
- 2026-11-23：Qoder 内置浏览器面板隐藏时，截图报 NATIVE_BROWSER_VIEWPORT_UNAVAILABLE、坐标点击"成功"但不生效；take_snapshot 与 evaluate_script 脚本点击仍可用。功能验证改用脚本点击，视觉截图需先打开浏览器面板。（已同步 AGENTS.md 第 8 节）

## 9. 重要变更记录
- 2026-11-22：初始版本，三份文档按模板重写。
- 2026-11-23：确认名称"实习罗盘"、主色靛蓝、Node 24；git init；M1-1 完成并合并回 main。

## 10. 下次会话的开场提示词
```
请先阅读 AGENTS.md、DESIGN.md、PROGRESS.md，然后告诉我：
1. 你理解的项目当前状态
2. 你认为的下一步任务
3. 开始前你有什么需要我确认的问题
确认后再动手，先给方案，不要直接写代码。
```

## 11. 作品帖素材（比赛要求，随开发积累）
**过程记录**，每个里程碑结束后补一条：
```
### 日期 / 里程碑
- 给 Qoder 的关键 prompt：
- 效果 / 截图文件名：
- 遇到的问题与怎么让 Qoder 解决的：
```
### 2026-11-23 / M1-1（M1 进行中）
- 给 Qoder 的关键 prompt："先读三份文档，复述当前状态和下一步，不清楚的先问；确认后本次只做 M1-1：Vite + React + TS + Tailwind 初始化 + 三标签空状态骨架"
- 效果 / 截图文件名：三标签骨架可运行、靛蓝视觉壳完成（视觉截图待补：当时内置浏览器面板隐藏，未截成图）
- 遇到的问题与怎么让 Qoder 解决的：① DESIGN 把 @dnd-kit/sortable 版本写成不存在的 6.x → 推迟到 M2 安装前提请确认；② 浏览器面板隐藏导致坐标点击不生效 → 改用 evaluate_script 脚本点击完成功能验证，并记入踩坑

**发帖清单**：
- [ ] 标题：【StudyHack】作品名
- [ ] 自我介绍
- [ ] 作品是什么 / 为什么做
- [ ] 怎么用（5 步以内，配截图）
- [ ] 怎么用 Qoder 做出来的（开发和部署各至少 3 张截图）
- [ ] 使用的 Qoder 账号
- [ ] Qoder Sites 公网链接（评委点开即可访问）
