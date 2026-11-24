# PROGRESS.md

## 1. 当前状态
- 当前里程碑：M1 骨架与部署（进行中，M1-1、M1-2、M1-3 已完成）
- 整体进度：约 30%，骨架、存储、示例数据与首开体验就绪，剩部署验证
- 项目当前能否运行：能（本地 `npm run dev`，尚未部署）
- 最后更新：2026-11-24

## 2. 里程碑清单
- [ ] M1 骨架与部署
- [ ] M2 看板
- [ ] M3 JD 录入与解析
- [ ] M4 技能与差距分析
- [ ] M5 打磨
- [ ] M6 作品帖素材

## 3. 当前任务
- 任务：M1-4 首次部署到 Qoder Sites，验证构建命令、产物目录、单页刷新行为、localStorage 在站点域名下是否可用
- 涉及模块 / 文件：部署配置（按 Qoder Sites 要求）、DESIGN §14 与本文第 7 节记录结论
- 完成标志：公网链接可访问，三标签可切换，示例数据显示正常；手机与电脑各打开一次验证
- 当前卡点：无

## 4. 下一步
1. M1-4：部署验证（见上）
2. M2：看板（M1 全部完成后再开始；dnd-kit 配套版本已核实并写入 DESIGN §4：core ≥6.3 / sortable 10.x / utilities 3.x）

## 5. 已完成记录
- 2026-11-24 M1-3 示例数据与首次载入（feat/m1-seed）：
  - `lib/date.ts`（todayLocal/addDays/daysUntil，本地时区）+ 11 个单测；`lib/seed.ts` 6 条示例覆盖 6 状态、截止日相对今天生成；`ensureSeed` 保存成功才写 seeded 标记
  - storage 增加 `hasSeeded/markSeeded`；UI：JobCard 只读卡片（≤3 天/过期标红、closed 灰）、SampleBanner 清空/撤销两态、App 存储失败红色提示条
  - 35 个单测全过；浏览器实测：首开 6 卡片+提示条、技能页 3 标签、清空→撤销→再清空→刷新不重塞、375px 无溢出、控制台无报错
  - 踩坑：遗留 dev server 占 5173 致 HMR 混合模块假 bug，换 5174 复测通过（已入 AGENTS §8）
- 2026-11-24 M1-2 存储封装与单元测试（feat/m1-storage）：
  - `src/lib/storage.ts`：loadJobs/saveJobs/loadSkills/saveSkills，key 前缀 `intern-compass:v1:`；损坏数据备份到 `backup:<时间戳>` 后重置；quota 按 DOMException name 区分（含 Firefox 变体）
  - 新增 `getLastLoadError()`（读后清除）解决 load 签名无错误出口的问题，DESIGN §8 已同步；`StorageError`、`SaveResult` 落在 types.ts
  - 13 个单元测试覆盖正常读写、不可用、写满、损坏 JSON/结构错误、备份失败仍重置；未引入 jsdom，用 Map stub 模拟 localStorage
  - test 脚本移除 `--passWithNoTests`；test / lint / build 全过；无 UI 改动，未做浏览器验证
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
| 无 | - | - |

## 7. 待我决策的问题
- Qoder Sites 是否支持后端函数 / 调用大模型？（M1-4 部署验证后决定是否做大模型解析，在此之前一律按纯前端开发）
- （已解决 2026-11-24：dnd-kit 配套版本经 npm registry 核实为 core 6.3.1 / sortable 10.0.0 / utilities 3.2.2，DESIGN §4 已更正；M2 安装时按此锁定）
- （已解决 2026-11-24：存储 key 前缀由 `internboard:v1:` 统一为 `intern-compass:v1:`，与产品/仓库名对齐；storage 尚未实现，无迁移成本，DESIGN §7 已同步）
- （已解决 2026-11-23：产品名称定为"实习罗盘"，主色靛蓝；Node 用当前环境的 24，文档已同步）

## 8. 踩坑记录
- 2026-11-23：Qoder 内置浏览器面板隐藏时，截图报 NATIVE_BROWSER_VIEWPORT_UNAVAILABLE、坐标点击"成功"但不生效；take_snapshot 与 evaluate_script 脚本点击仍可用。功能验证改用脚本点击，视觉截图需先打开浏览器面板。（已同步 AGENTS.md 第 8 节）
- 2026-11-23：跑过 dev 并打开页面后 `npm run lint` 报错：ESLint 9 扫到项目根 `.vite/deps` 预 bundling 缓存，React 产物内 eslint-disable 注释引用未安装的 react-internal 规则。全局 ignores 加 `**/.vite`，`.gitignore` 加 `.vite` 后恢复。（已同步 AGENTS.md 第 8 节）
- 2026-11-24：上一会话遗留 dev server 占用 5173，新 server 换到 5174；浏览器连旧端口拿到 HMR 混合新旧模块的页面，表现为标签点击不生效、SkillsPage 收到新 props 却渲染旧逻辑。用 React fiber 读 memoizedProps 定位后换端口复测通过。（已同步 AGENTS.md 第 8 节）

## 9. 重要变更记录
- 2026-11-22：初始版本，三份文档按模板重写。
- 2026-11-23：确认名称"实习罗盘"、主色靛蓝、Node 24；git init；M1-1 完成并合并回 main。
- 2026-11-23：修复 lint 误扫 Vite 预 bundling 缓存（fix/lint-ignore-vite-cache 合并回 main）。
- 2026-11-24：文档一致性修正：DESIGN §4 dnd-kit 版本更正（core ≥6.3 / sortable 10.x / utilities 3.x）、§7 存储 key 前缀改为 `intern-compass:v1:`；AGENTS §2 补充 AI 会话 shell 为 Git Bash 的说明。

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
### 2026-11-24 / M1-2（M1 进行中）
- 给 Qoder 的关键 prompt："确认 getLastLoadError 方案，开始执行"（先给四要素方案：文件清单、设计决策与备选、验证与提交）
- 效果 / 截图文件名：13 个存储单测全过、无新依赖；终端测试输出截图由用户提供
- 遇到的问题与怎么让 Qoder 解决的：① load 签名无错误出口 → 新增 getLastLoadError 读后清除并同步 DESIGN §8；② 测试输出里的预期 console.warn 被误认为报错 → 解释为故意失败场景的设计内提示
### 2026-11-24 / M1-3（M1 进行中）
- 给 Qoder 的关键 prompt："按 1 完成什么 2 文件清单 3 思路与备选 4 验证与提交 四段给方案，确认后开工"
- 效果 / 截图文件名：首开 6 卡片+示例提示条、清空/撤销、刷新不重塞、375px 通过（视觉截图待补：用脚本验证，未截成图）
- 遇到的问题与怎么让 Qoder 解决的：遗留 dev server 占端口导致 HMR 混合模块假 bug → 读 vite 输出发现 5174、用 fiber props 取证后换端口复测，坑入 AGENTS §8
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
