# PROGRESS.md

## 1. 当前状态
- 当前里程碑：M2 看板进行中——M2-1 静态 6 列已完成（2026-11-28），下一步 M2-2 拖拽
- 整体进度：约 45%，已上线公开访问（线上仍为 M1 版本，M2 尚未部署）
- 项目当前能否运行：能；公网链接 https://intern-compass-aqhthz2hyy7.qoder.zone（公开访问）
- 最后更新：2026-11-28

## 2. 里程碑清单
- [x] M1 骨架与部署（2026-11-25 完成）
- [ ] M2 看板
- [ ] M3 JD 录入与解析
- [ ] M4 技能与差距分析
- [ ] M5 打磨
- [ ] M6 作品帖素材

## 3. 当前任务
- 任务：M2-2 dnd-kit 拖拽改状态 + 持久化（方案待确认，尚未开工）
- 涉及模块 / 文件：features/board（BoardPage / BoardColumn / JobCard 接入拖拽）、App.tsx（状态更新与持久化）；安装 dnd-kit core 6.3.1 / sortable 10.0.0 / utilities 3.2.2（用户已授权）
- 完成标志：拖拽改状态刷新后仍在；手机可拖拽（TouchSensor 带 delay/距离阈值）；见 DESIGN §13 M2 行
- 当前卡点：无

## 4. 下一步
1. M2-2：dnd-kit 拖拽改状态 + 持久化（TouchSensor 配 delay/距离阈值）；M2 整体完成标志见 DESIGN §13
2. M2 完成后：重新 build 并部署到 Qoder Sites，公网复验看板
3. M3：JD 录入与解析——用户已决策采用大模型解析（2026-11-25）；实现路径（Function+自带 key vs Qoder Cloud Agents）待 M3 开工时先做小实验验证延迟/成本/套餐支持再定；保留关键词词典作降级

## 5. 已完成记录
- 2026-11-28 M2-1 静态 6 列看板（feat/m2-board-static）：
  - BoardPage 按 STATUS_ORDER 渲染 6 列；新增 BoardColumn（列头状态名+数量、低饱和底色静态类名表、空列占位）；JobCard 适配窄列（p-3、去掉状态徽章——列即状态、长文本 truncate+title 提示）；App 看板页近全宽，提示条与其他标签页保持 max-w-6xl
  - 宽度策略（用户确认）：≥1280px grid 6 列并排（每列约 195–222px），<1280px flex 横向滑动 + 固定列宽 240px；DESIGN §15 已同步断点
  - build / 35 单测 / lint 全过；同源 iframe 实测 1440/1280/1024/375 四档宽度：布局模式、列数、无页面级溢出全部正确；清空→空状态→撤销恢复 6 卡、三标签切换、标红（≤3 天）/置灰（closed）正确；控制台无报错
  - 踩坑：面板隐藏时外层 viewport 为 0 致布局测量失效 → 用指定宽度同源 iframe 测量（已入 AGENTS §8）；本地旧示例数据倒计时看似"错红"→ 实为 seed 日期已过数天，重置后逻辑正确
- 2026-11-25 M1-4 首次部署到 Qoder Sites（feat/m1-deploy）：
  - 本地 build / test（35 单测）/ lint 全过后，`prepare_site`（webDirectory: dist，spa: true）→ `publish_site` 发布成功；站点名"实习罗盘"，slug intern-compass，实际域名 https://intern-compass-aqhthz2hyy7.qoder.zone；经用户授权设为公开访问
  - 电脑端公网实测：首开 6 示例卡片+提示条、三标签切换、刷新不 404、清空→撤销→再清空→刷新不重塞、模拟新访客重新载入示例、375px（iframe）无溢出、控制台无报错——站点域名下 localStorage 读写正常
  - DESIGN §14 三个待确认项全部落结论：平台不代跑构建（本地 build 后上传 dist）、spa 刷新回退正常、支持服务端 Function + Secret（可安全调用大模型，是否采用待用户决策）
  - 手机验证：2026-11-25 用户实测通过，一切正常；M1 全部完成；无 src 代码改动
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
- （已解决 2026-11-25：Qoder Sites 支持服务端 Function + 数据库 + Secret，具备安全调用大模型的条件，结论已记 DESIGN §14；**用户已决策做大模型解析（2026-11-25）**；排期确认先 M2 后 M3；实现路径待 M3 开工时小实验验证后再定）
- （已解决 2026-11-24：dnd-kit 配套版本经 npm registry 核实为 core 6.3.1 / sortable 10.0.0 / utilities 3.2.2，DESIGN §4 已更正；M2 安装时按此锁定）
- （已解决 2026-11-24：存储 key 前缀由 `internboard:v1:` 统一为 `intern-compass:v1:`，与产品/仓库名对齐；决策当时 storage 尚未实现、无迁移成本，后已在 M1-2 按新前缀实现，DESIGN §7 已同步）
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
- 2026-11-25：M1-4 部署上线（feat/m1-deploy）：站点公开发布，DESIGN §14 三个待确认项落结论；新增站点描述文件 `.实习罗盘.qoder.site`（工具生成）。
- 2026-11-25：手机公网验证通过（用户实测），M1 勾选完成；用户决策 M3 采用大模型解析，实现路径待方案确认。
- 2026-11-28：M2 拆分为 M2-1（静态 6 列看板）/ M2-2（dnd-kit 拖拽），dnd-kit 安装获用户授权；AGENTS §4 行数限制改为豁免测试文件（业务文件仍 ≤200 行），storage.test.ts（203 行）不再超标、无需拆分。

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
### 2026-11-28 / M2-1（M2 进行中）
- 给 Qoder 的关键 prompt："宽度策略按照你的建议来，开始执行"（此前按四段式确认方案，并决策 M2 拆两步、豁免测试文件行数限制）
- 效果 / 截图文件名：6 列看板 + 倒计时四档宽度实测通过（视觉截图待补：面板隐藏，用 iframe 脚本验证）
- 遇到的问题与怎么让 Qoder 解决的：① 面板隐藏致 viewport 0、布局数据失效 → 同源 iframe 指定宽度测量；② 旧示例数据倒计时"错红"疑云 → 核实为 seed 日期过期，重置数据后确认标红逻辑正确
### 2026-11-25 / M1-4（M1 收尾）
- 给 Qoder 的关键 prompt："按 1 完成什么 2 文件清单 3 思路与备选 4 验证与提交 四段给方案，确认后开工"；发布后站点默认私有，单独授权改为公开
- 效果 / 截图文件名：公网链接上线、电脑端主流程与 localStorage 验证全过、手机验证通过（部署与验证截图待补）
- 遇到的问题与怎么让 Qoder 解决的：① 新站点默认私有，公网验证被登录墙拦住 → 提请用户授权后设为公开；② 脚本点击后同步读 DOM 拿到旧内容（React 异步渲染）→ 改异步脚本等待后再读
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
