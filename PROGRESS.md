# PROGRESS.md

## 1. 当前状态
- 当前里程碑：M2 完成并已部署公网（2026-11-28 复验通过）；下一步 M3 JD 录入与解析
- 整体进度：约 55%，线上已为 M2 看板版本（公网复验通过）
- 项目当前能否运行：能；公网链接 https://intern-compass-aqhthz2hyy7.qoder.zone（公开访问）
- 最后更新：2026-11-28

## 2. 里程碑清单
- [x] M1 骨架与部署（2026-11-25 完成）
- [x] M2 看板（2026-11-28 完成）
- [ ] M3 JD 录入与解析
- [ ] M4 技能与差距分析
- [ ] M5 打磨
- [ ] M6 作品帖素材

## 3. 当前任务
- 任务：M2 部署与公网复验完成；下一步 M3 开工（先小实验定大模型解析实现路径）
- 涉及模块 / 文件：M3 预计 features/jd-input、lib/parser、服务端 Function（路径待实验）
- 完成标志：M3 见 DESIGN §13——示例 JD 正确解析入库、异常分支有提示、解析有单测
- 当前卡点：无；M3 实现路径待小实验后提请确认

## 4. 下一步
1. M3：JD 录入与解析——用户已决策采用大模型解析（2026-11-25）；实现路径（Function+自带 key vs Qoder Cloud Agents）待 M3 开工时先做小实验验证延迟/成本/套餐支持再定；保留关键词词典作降级
2. M3 完成后按里程碑推进 M4 技能与差距分析

## 5. 已完成记录
- 2026-11-28 M2 部署公网（main 推送 434b6f4..9848d16 后 prepare/publish，action b1c32df4）：
  - 本地 build 后上传 dist（spa: true），发布成功 published: true，地址不变 https://intern-compass-aqhthz2hyy7.qoder.zone（公开）
  - 公网复验：1440px 6 列、长按 220ms 激活、立即移动不拖、落列 applied 刷新仍在、≤3 天标红在；375px chips 6 个单行不滚动、无溢出、滑动不拖、长按 216ms 拖到已结束 chip 高亮落列、视图自动切换、刷新持久化；控制台无报错
- 2026-11-28 M2-2 拖拽改状态 + 持久化（feat/m2-board-dnd，**用户验收通过，已合并 main；M2 完成**）：
  - 方案 A（用户确认）：core droppable 模型，不装 sortable——列与手机 chips 为放置区（data.status）、pointerWithin 碰撞、DragOverlay 跟手浮层；lib/board.ts moveJobStatus + 5 单测（全量 40）
  - 修订链（用户反馈驱动）：① 列高随内容（items-start、去 h-full）；② PointerSensor+TouchSensor 触摸双重激活 → MouseSensor+TouchSensor；③ 落列后手机视图自动切到目标状态（卡片不再"消失"）；④ chips 单行 + 间距留白（ring-2 外描边吃 gap，按视觉净空 6px 重算）；⑤ 用户满意手机长按 0.2s，电脑端统一 MouseSensor delay 200 / tolerance 8
  - 验收：2026-11-28 用户确认长按手感与间距满意后指示合并；AI 自测：40 单测 / lint / build、鼠标+触摸双路径（立即移动不拖、长按激活、落列持久化）、四档宽度、控制台无应用报错
  - 踩坑：DevTools 设备模式与响应式窄窗输入逻辑不同致"时好时坏"；验证脚本须按真实时间等待、同源 iframe 共享 localStorage 需每轮重置；ring 外描边吃 gap（均已入 AGENTS §8）
- 2026-11-28 M2-1 静态 6 列看板（feat/m2-board-static，**用户验收通过，已合并 main**）：
  - BoardPage 按 STATUS_ORDER 渲染 6 列；新增 BoardColumn（列头状态名+数量、低饱和底色静态类名表、空列占位）；JobCard 适配窄列（p-3、去掉状态徽章——列即状态、长文本 truncate+title 提示）；App 看板页近全宽，提示条与其他标签页保持 max-w-6xl
  - 宽度策略（用户确认）：≥1280px grid 6 列并排（每列约 195–222px），<1280px flex 横向滑动 + 固定列宽 240px；DESIGN §15 断点同步在分支提交中
  - build / 35 单测 / lint 全过；同源 iframe 实测 1440/1280/1024/375 四档宽度：布局模式、列数、无页面级溢出全部正确；清空→空状态→撤销恢复 6 卡、三标签切换、标红（≤3 天）/置灰（closed）正确；控制台无报错
  - 流程教训：AI 自测通过后未等用户确认效果即合并 main，用户对效果不满意 → main 回退到 877a2d1（改动保留分支）；AGENTS §9 已写明合并前须用户确认效果
  - 踩坑：面板隐藏时外层 viewport 为 0 致布局测量失效 → 用指定宽度同源 iframe 测量（已入 AGENTS §8）；本地旧示例数据倒计时看似"错红"→ 实为 seed 日期已过数天，重置后逻辑正确
  - 修订（用户反馈驱动，同日验收）：进行中三列高饱和底色+2px 描边+加粗列头醒目化；`interviewStage` 可选字段+面试卡片［一面］［二面］［HR面］chips 点选即持久化；<768px 状态 chips 总览+单列全宽取消横滑；手机 chips 未选中态三进行中状态同样醒目化；DESIGN §7/§9/§15 同步
  - 验收：2026-11-28 用户浏览器（含 Chrome 手机模拟）确认满意后合并 main（AGENTS §9 流程）
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
- 2026-11-28：M2-1 在 AI 自测通过但未获用户效果确认时合并 main，用户对效果不满意需回退。教训：合并条件是用户确认效果，不是 AI 自测（已写入 AGENTS §9）。
- 2026-11-28：隐藏面板下 setTimeout 被 Chrome 节流致含 sleep 的拖拽验证脚本超时；改 MessageChannel 宏任务等待后通过（已入 AGENTS §8）。
- 2026-11-28：隐藏面板下 DragOverlay 退场动画（WAAPI）不派发 onfinish，浮层残留为环境伪影；可见浏览器正常（已入 AGENTS §8）。
- 2026-11-28：M2-2 验收反馈两问题——列高被 stretch 拉伸同步、手机拖拽失效（PointerSensor+TouchSensor 双重激活）；改 items-start/去 h-full 与 MouseSensor+TouchSensor 修复（已入 AGENTS §8）。
- 2026-11-28：脚本模拟 touch 须 dispatch 到卡片元素（TouchSensor 监听挂在触发元素）；initScript 只进顶层 frame，iframe 需 load 后注入节流 shim（已入 AGENTS §8）。
- 2026-11-28：M2-2 复验收反馈——手机拖拽"时好时坏"实为 DevTools 设备模式（触摸逻辑+无光标）与响应式窄窗（鼠标逻辑）切换所致，另落列后视图不切换使卡片看似消失；chips 换行因 flex-wrap。修订：落列自动切换视图、chips 单行紧凑（已入 AGENTS §8）。
- 2026-11-28：验证脚本固定 tick 轮数等待不足 200ms 误判长按未激活；同源 iframe 共享 localStorage 致跨轮状态污染。改按真实时间等待+每轮重置数据（已入 AGENTS §8）。
- 2026-11-28：用户满意手机长按 0.2s 手感，要求电脑端统一（MouseSensor 改 delay 200/tolerance 8）；chips"紧贴"实为 ring-2 外描边吃掉 gap，按视觉净空重算间距（已入 AGENTS §8）。

## 9. 重要变更记录
- 2026-11-22：初始版本，三份文档按模板重写。
- 2026-11-23：确认名称"实习罗盘"、主色靛蓝、Node 24；git init；M1-1 完成并合并回 main。
- 2026-11-23：修复 lint 误扫 Vite 预 bundling 缓存（fix/lint-ignore-vite-cache 合并回 main）。
- 2026-11-24：文档一致性修正：DESIGN §4 dnd-kit 版本更正（core ≥6.3 / sortable 10.x / utilities 3.x）、§7 存储 key 前缀改为 `intern-compass:v1:`；AGENTS §2 补充 AI 会话 shell 为 Git Bash 的说明。
- 2026-11-25：M1-4 部署上线（feat/m1-deploy）：站点公开发布，DESIGN §14 三个待确认项落结论；新增站点描述文件 `.实习罗盘.qoder.site`（工具生成）。
- 2026-11-25：手机公网验证通过（用户实测），M1 勾选完成；用户决策 M3 采用大模型解析，实现路径待方案确认。
- 2026-11-28：M2 拆分为 M2-1（静态 6 列看板）/ M2-2（dnd-kit 拖拽），dnd-kit 安装获用户授权；AGENTS §4 行数限制改为豁免测试文件（业务文件仍 ≤200 行），storage.test.ts（203 行）不再超标、无需拆分。
- 2026-11-28：M2-1 过早合并被回退（main 回到 877a2d1，改动保留 feat/m2-board-static）；AGENTS §9 写明合并回 main 前须用户确认效果。
- 2026-11-28：M2-1 修订（醒目配色/面试轮次细分/手机单列总览/chips 醒目化）用户验收通过，合并回 main。
- 2026-11-28：M2-2 用户验收通过合并回 main（5bb98de），M2 勾选完成；拖拽统一长按 200ms 触发（用户确认手感）。
- 2026-11-28：M2 部署公网并复验通过（用户授权推送+部署）；线上升级为 M2 看板版本。

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
### 2026-11-28 / M2-2（M2 完成）
- 给 Qoder 的关键 prompt："①选A，②认可"（方案 A 不装 sortable）；验收反馈"列高同步/手机拖拽无法实现"；"长按 0.2 秒设定满意，同步到电脑端；chips 间隔近、紧贴观感不好"；"合并"
- 效果 / 截图文件名：拖拽改状态+刷新持久化、手机长按拖到 chips、落列自动切换视图、chips 单行（视觉截图待补：隐藏面板用 iframe 脚本验证）
- 遇到的问题与怎么让 Qoder 解决的：① 手机拖拽失效 → 读 dnd-kit 源码定位 PointerSensor+TouchSensor 双重激活，换 MouseSensor+TouchSensor；② 列高被拉伸同步 → items-start + 去 h-full；③ "拖拽时好时坏" → 查明 DevTools 设备模式/响应式模式输入差异，并修落列后视图不切换的真缺陷；④ chips"紧贴" → ring-2 外描边吃掉 gap，按视觉净空重算间距
### 2026-11-28 / M2-1（M2 进行中，M2-1 已验收）
- 给 Qoder 的关键 prompt："宽度策略按照你的建议来，开始执行"；三点反馈"进行中三列醒目/面试细分一面二面HR面/手机滑动过多"；"手机端还需要将三个状态栏再醒目一些"；验收"好了，改进工作完成，提交吧"
- 效果 / 截图文件名：6 列看板四档宽度实测通过（视觉截图待补：面板隐藏，用 iframe 脚本验证）
- 遇到的问题与怎么让 Qoder 解决的：① 面板隐藏致 viewport 0、布局数据失效 → 同源 iframe 指定宽度测量；② 未获用户确认即合并 → 回退 main、改动保留分支、AGENTS §9 增加合并前置条件；③ 本地旧示例数据倒计时"错红"疑云 → 核实为 seed 日期过期，重置数据后确认标红逻辑正确
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
