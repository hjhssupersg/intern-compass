# DESIGN.md

## 1. 项目背景与目标
- 背景：找实习的大学生每天要看大量岗位 JD，信息散落在各个招聘平台，容易出现三个问题：错过截止日期、不清楚自己投到哪一步、不知道该补哪些技能。
- 目标用户：准备找互联网大厂实习的在校大学生（尤其是计算机相关专业）。
- 核心目标：
  1. 粘贴一段 JD，3 秒内得到结构化结果（公司、岗位、技术栈、截止时间）。
  2. 用看板一眼看清所有投递的进度和临近的截止日期。
  3. 根据所有岗位的高频技术要求，告诉用户"最该先补什么"。
- 成功标准：评委打开公网链接，不看说明书，1 分钟内能完成"粘贴 JD → 看板出现卡片 → 看到差距分析"；手机和电脑上都能顺畅使用。
- 项目性质与约束：比赛项目；1 人开发；必须用 Qoder 完成开发和部署，部署到 Qoder Sites；评分不看技术复杂度，看重问题真实性、可用性、体验与设计、Qoder 使用深度。

## 2. 范围与非目标
**要做（必须）**：
- JD 粘贴与解析，解析结果经用户确认后保存
- 投递看板（6 个状态列，可拖拽，截止倒计时）
- 我的技能清单（勾选已掌握的技术标签）
- 差距分析（高频但未掌握的技术排行）
- 首次打开自动载入示例数据，可一键清空

**可以做（时间允许，按顺序，做完一项再做下一项）**：
1. 顶部"本周要处理"提醒条（7 天内截止的岗位）
2. 岗位匹配度（技能重合率）与一句话理由
3. 面试复盘记录，汇总高频面试题
4. 深色模式

**明确不做**：
- 账号注册登录、多设备同步、后端存储
- 自动爬取招聘网站
- 简历上传与解析
- 任何需要用户先配置才能使用的东西
- 多语言（只做简体中文）

## 3. 用户与使用场景
| 角色 | 想做什么 | 关键场景 |
|---|---|---|
| 大二/大三学生（主要用户） | 管理投递、不错过截止、知道该补什么 | 刷到岗位 → 复制 JD → 粘贴入库；每周查看看板；决定接下来学什么 |
| 评委（体验者） | 快速判断作品是否有用、是否好用 | 点开链接 → 看到示例数据 → 粘贴一段 JD → 拖一张卡片 → 看差距分析 |

## 4. 技术栈
版本以首次 `npm install` 后 `package.json` 锁定的为准，下表为主版本要求，不得随意升级。

| 类别 | 选型 | 版本 |
|---|---|---|
| 语言 / 运行时 | TypeScript / Node.js | TS 5.x / Node 22+（实际开发环境 Node 24） |
| 主框架 | React | 18.x |
| 构建工具 | Vite | 5.x |
| 样式 | Tailwind CSS | 3.4.x |
| 拖拽 | @dnd-kit/core + @dnd-kit/sortable + @dnd-kit/utilities | core 6.x（≥6.3）/ sortable 10.x / utilities 3.x（2026-11-24 经 npm registry 核实配套） |
| 数据库 | 无，使用浏览器 localStorage | - |
| 缓存 / 消息队列 / 中间件 | 无 | - |
| 测试 | Vitest | 2.x |
| 部署 | Qoder Sites（静态站点） | - |

## 5. 总体架构
```
┌──────────────── 浏览器（纯前端 SPA） ────────────────┐
│  App（标签切换：看板 / 我的技能 / 差距分析）            │
│    │                                                  │
│  features/*  ──调用──►  lib/parser   lib/gap          │
│    │                    lib/date                      │
│    └────读写────►  lib/storage.ts ──► localStorage    │
└──────────────────────────────────────────────────────┘
```
- 架构风格：纯前端单页应用，无后端。
- 通信方式：组件之间通过 React 状态和上层 Context 共享数据；持久化只经过 `storage.ts`。
- 关键思路：解析、统计、日期、存储全部做成可单测的纯函数；JD 解析通过 `JDParser` 接口抽象，保证以后可以替换为大模型解析而不改界面。

## 6. 模块划分
| 模块 | 职责 | 依赖 |
|---|---|---|
| `features/jd-input` | 粘贴 JD、展示解析结果、让用户修改并确认保存 | `lib/parser`、`lib/storage` |
| `features/board` | 6 列看板、卡片、拖拽改状态、截止倒计时 | `lib/storage`、`lib/date` |
| `features/skills` | 技术标签池，切换"已掌握" | `lib/storage`、词典 |
| `features/gap` | 展示差距分析结果 | `lib/gap`、`lib/storage` |
| `lib/parser` | JD 文本 → 结构化字段 | 技术标签词典 |
| `lib/gap.ts` | 统计技术标签频次并对比掌握情况 | 无 |
| `lib/date.ts` | 本地日期解析、格式化、倒计时 | 无 |
| `lib/storage.ts` | localStorage 读写、版本、容错 | 无 |
| `lib/seed.ts` | 示例数据工厂、首次载入编排、清空示例 | `lib/storage`、`lib/date` |

- 依赖规则：`features` → `lib`；`lib` 内部不得依赖 `features` 或 React；`features` 之间不得互相引用，需共享的数据通过上层 Context 传递。

## 7. 数据模型
**实体关系**：一个用户（本机浏览器）拥有多个 `Job` 和一份 `SkillState`。

**数据结构**（定义在 `types.ts`）：
```ts
type Status = 'todo' | 'applied' | 'written' | 'interview' | 'offer' | 'closed';

type InterviewStage = 'first' | 'second' | 'hr';

interface Job {
  id: string;            // 随机 id
  company: string;
  title: string;
  location?: string;
  deadline?: string;     // 本地日期 'YYYY-MM-DD'，不带时区
  techTags: string[];    // 词典中的标准标签名，如 'Redis'
  requirements: string;  // 要求摘要
  rawJD: string;         // 原始 JD 文本
  status: Status;
  interviewStage?: InterviewStage; // 面试轮次，仅 status 为 interview 时显示与生效
  note?: string;
  createdAt: string;     // ISO 时间
  isSample?: boolean;    // 是否为示例数据
}

interface SkillState {
  mastered: string[];    // 已掌握的标准标签名
}
```

**存储结构（localStorage）**：
- `intern-compass:v1:jobs`：`Job[]` 的 JSON，永久，用户清除浏览器数据才会丢失
- `intern-compass:v1:skills`：`SkillState` 的 JSON
- `intern-compass:v1:seeded`：`"1"` 表示已载入过示例数据，避免用户清空后又被重新塞入
- 数据损坏时：将原内容备份到 `intern-compass:v1:backup:<时间戳>`，再重置为空并提示用户

**状态流转**：
```
todo → applied → written → interview → offer
任意状态 → closed（未通过 / 放弃 / 已结束）
```
看板允许在任意两列之间自由拖拽，不强制顺序。

**技术标签词典**（`lib/parser/dictionary.ts`）：
- 结构：`{ name: string; aliases: string[]; category: string }`，如 `{ name: 'Spring Boot', aliases: ['springboot', 'spring-boot'], category: '框架' }`
- 匹配时忽略大小写；英文别名要用单词边界，避免 "Java" 误匹配 "JavaScript"。

## 8. 接口契约
本项目没有后端 HTTP 接口，以下为模块间的内部接口契约。

```ts
interface ParsedJD {
  company?: string;
  title?: string;
  location?: string;
  deadline?: string;     // 'YYYY-MM-DD'
  techTags: string[];
  requirements: string;
}

interface JDParser {
  parse(text: string): Promise<ParsedJD>;
}

// lib/gap.ts
interface GapItem { tag: string; jobCount: number; priority: 'high' | 'medium' | 'low' }
function computeGap(jobs: Job[], mastered: string[]): GapItem[];

// lib/storage.ts
function loadJobs(): Job[];
function saveJobs(jobs: Job[]): { ok: boolean; error?: StorageError };
function loadSkills(): SkillState;
function saveSkills(s: SkillState): { ok: boolean; error?: StorageError };
function getLastLoadError(): StorageError | null; // 读取最近一次 load 的错误，读后清除；供 UI 层弹提示
function hasSeeded(): boolean;
function markSeeded(): { ok: boolean; error?: StorageError };

// lib/seed.ts
function ensureSeed(): { jobs: Job[]; skills: SkillState; didSeed: boolean; saveError?: StorageError };
function removeSamples(jobs: Job[], skills: SkillState): { jobs: Job[]; skills: SkillState };
```
- 统一错误类型：`StorageError = 'unavailable' | 'quota' | 'corrupted'`
- load 系列保持"永远返回可用数据"的签名；加载失败（不可用 / 损坏）通过 `getLastLoadError` 暴露给界面层，由 UI 负责提示（2026-11-24 确认）。
- `ensureSeed` 仅在示例保存成功后才写 `seeded` 标记，保存失败时下次打开仍有机会载入；`removeSamples` 只删 `isSample` 岗位与示例带入的技能标签。
- 解析错误：`parse` 对无法识别的字段返回 `undefined`，不抛异常；输入为空或过短（少于 30 字符）由调用方在界面层拦截并提示。
- `computeGap` 规则：只统计 `status !== 'closed'` 的岗位；只返回未掌握的标签；按 `jobCount` 降序，相同则按标签名排序；`jobCount >= 3` 为 high，`2` 为 medium，`1` 为 low。

## 9. 核心业务流程
**主链路 A：粘贴 JD 入库**
1. 用户点击"＋ 粘贴 JD"，弹出输入框。
2. 用户粘贴 JD 文本，点击"解析"。
3. `JDParser.parse` 返回结果，界面展示为可编辑表单（公司、岗位、地点、截止日期、技术标签、要求摘要）。
4. 用户修改后点击"加入看板"，生成 `Job`（状态 `todo`），写入存储，看板出现卡片。

异常分支（必须实现并测试）：
- 文本为空或少于 30 字符：禁止解析，提示"请粘贴完整的岗位描述"。
- 解析不出任何技术标签：仍展示表单，提示"没有识别到技术栈，可手动添加"，用户可手动选标签。
- 解析不出公司或岗位：对应字段留空，必填校验提示用户补充。
- 存在相同"公司 + 岗位"的岗位：提示"已存在，是否仍要添加"。
- 存储失败（不可用 / 写满）：卡片保留在内存中，顶部显示"当前无法保存，刷新后数据会丢失"。

**主链路 B：看板拖拽改状态**
1. 用户拖动卡片到另一列。
2. 更新该 `Job.status`，写入存储。
3. 若拖入 `closed` 列，卡片变灰；截止倒计时不再标红。

异常分支：拖拽到列外则回弹原位；存储失败时同上提示。

**面试轮次细分**：面试列卡片提供［一面］［二面］［HR面］三个切换按钮，点击更新 `interviewStage` 并立即持久化；其他列不显示该组按钮，字段值保留（2026-11-28 确认）。

**主链路 C：差距分析**
1. 用户在"我的技能"勾选已掌握技术。
2. 切换到"差距分析"，`computeGap` 统计结果并展示排行。

异常分支：没有任何岗位时展示空状态并引导粘贴 JD；没有勾选任何技能时，所有标签都视为未掌握，并提示"先去勾选你已掌握的技术，结果会更准"。

**首次打开**：检测 `seeded` 标记，不存在则载入 5～6 条示例岗位（标记 `isSample`）和若干已掌握技能，并显示"这是示例数据，[清空示例]"提示条。

## 10. 关键技术决策及理由
| 决策 | 理由 | 备选方案及放弃原因 |
|---|---|---|
| 纯前端 + localStorage | 免登录、打开即用，评委上手零成本；也避免依赖 Qoder Sites 的后端能力 | 后端 + 数据库：需要账号体系，增加评委使用门槛，且部署不确定 |
| JD 解析默认用关键词词典 | 离线可用、结果稳定、响应快；大模型调用需要保护密钥，前端无法安全做到 | 前端直连大模型：会泄露密钥；仅依赖大模型：一旦不可用整个主流程失效 |
| 解析结果必须经用户确认 | 规则解析会出错，不能让错误数据直接入库 | 全自动入库：错误数据会污染差距分析 |
| `JDParser` 接口抽象 | 以后若 Qoder Sites 支持后端调用模型，只需新增实现，不改界面 | 解析逻辑写死在组件中：以后替换要大改 |
| 不用前端路由，用状态切换标签 | 避免静态部署后刷新 404 | React Router：需要部署端配置回退规则，风险不确定 |
| 截止日期存本地日期字符串 | 避免 UTC 转换造成日期差一天 | 存 ISO 时间戳：时区换算易出错 |
| 看板允许自由拖拽 | 真实投递流程不一定线性（比如笔试后直接挂） | 强制顺序流转：限制用户 |
| 示例数据首次自动载入 | 评委打开即可看到完整效果，不用自己准备 JD | 空白起步：评委需要先找 JD，体验差 |

## 11. 非功能性需求
- 性能：首屏加载小于 2 秒（普通宽带）；解析 1 篇 JD 小于 100ms；100 张卡片拖拽流畅。
- 一致性与幂等：每次状态变更立即写入存储；示例数据只载入一次（`seeded` 标记）。
- 安全与隐私：JD 文本按纯文本渲染；所有数据只保存在用户本机浏览器，不上传；前端不得出现任何密钥。
- 可靠性：存储不可用、数据损坏时界面不崩溃，有明确提示，且有备份。
- 可访问性：可点击元素有明确的悬停和焦点状态；文字与背景对比度足够；按钮最小点击区域约 40px。
- 兼容性：最新版 Chrome / Edge / Safari；手机宽度 375px 起可用。

## 12. 部署与运行环境
- 依赖组件及版本：仅 Node.js 22+（构建时；实际开发环境 Node 24）。
- 编排方式：无，不使用 Docker。
- 端口规划：开发服务器 5173。
- 配置管理：MVP 无环境变量；如启用大模型解析，密钥只能放服务端。
- 本地启动顺序：`npm install` → `npm run dev`。
- 部署：执行 `npm run build`，将 `dist/` 作为静态站点通过 Qoder 部署到 Qoder Sites；部署后用手机和电脑各打开一次公网链接验证。

## 13. 里程碑与任务拆分
| 里程碑 | 内容 | 完成标志 |
|---|---|---|
| M1 骨架与部署 | 项目初始化、三个标签页骨架、示例数据与存储封装、首次部署 | 公网链接可访问，三个标签可切换，示例数据显示正常 |
| M2 看板 | 6 列看板、卡片、拖拽、截止倒计时、持久化 | 拖拽改状态刷新后仍在，手机可拖拽，3 天内截止标红 |
| M3 JD 录入与解析 | 粘贴弹窗、关键词解析、确认表单、异常分支 | 示例 JD 能正确解析入库，所有异常分支有提示，解析有单元测试 |
| M4 技能与差距分析 | 技能勾选、`computeGap`、差距页 | 勾选技能后排行实时变化，有单元测试 |
| M5 打磨 | 空状态、动效、响应式、可访问性、加分项 | 主流程在桌面和手机上流畅，无控制台报错 |
| M6 作品帖素材 | 整理截图、prompt 记录、5 步流程、发帖 | 作品帖草稿完成，包含 Qoder 账号与公网链接 |

## 14. 风险与待决问题
- 【已确认 2026-11-25】Qoder Sites 支持服务端 Function、数据库与 Secret（密钥放服务端），具备安全调用大模型的条件。**用户已决策采用大模型解析（2026-11-25）**；实现路径（自带 key 的 Function vs Qoder Cloud Agents）、降级策略与排期在 M3 方案中确认后同步 §10。
- 【已确认 2026-11-25】Qoder Sites 不代跑构建：本地 `npm run build` 后将 `dist/` 作为产物目录上传（`prepare_site` 的 `webDirectory: "dist"`）；开启 `spa: true` 后刷新回退到 index.html，公网实测刷新不 404。
- 【已确认 2026-11-25】localStorage 在站点域名（*.qoder.zone）下读写正常：示例载入、清空、刷新不重塞均公网实测通过。
- 【已确认】产品正式名称为"实习罗盘"，主色为靛蓝（2026-11-23 确认）。
- 风险：关键词词典覆盖面有限，可能漏识别；缓解：解析结果可人工修改，词典可持续追加。
- AI 遇到新的待确认事项时，必须停下来问我，不得自行决定。

## 15. 视觉与交互规范
- 风格：简洁、留白充足、信息密度适中，类似现代效率工具。
- 色彩：一个主色（靛蓝）+ 中性灰；6 个状态列以不同色相底色区分，其中已投递/笔试/面试三列用高饱和底色 + 加粗同色列头 + 2px 描边醒目化（进行中的岗位是用户关注重点），其余列低饱和；临近截止（3 天内）用红色强调，已结束用灰色。
- 字体：系统字体栈，中文可读性优先。
- 组件：自行用 Tailwind 实现，不引入组件库。
- 布局：顶部为标签栏和右上角固定的"＋ 粘贴 JD"主按钮；看板 ≥1280px 时 6 列并排（近全宽），768–1279px 横向滑动（固定列宽 240px），<768px 为状态 chips 总览（带数量、换行排布）+ 单列全宽，无横滑（2026-11-28 确认断点与手机模式）。
- 空状态：每个页面必须有引导文案（如看板为空提示"粘贴你的第一条 JD"）。
- 反馈：所有操作有即时反馈；删除类操作提供撤销。
- 响应式：兼顾手机（375px 起）与桌面。
- 参考：Notion / Linear 的看板气质（只参考风格，不复制）。

## 16. 术语表
| 术语 | 含义 |
|---|---|
| JD | Job Description，岗位描述 |
| 技术标签 | 从 JD 中识别出的标准化技术名称，如 Redis、Docker |
| 掌握 | 用户在"我的技能"中勾选过的技术标签 |
| 差距分析 | 统计所有进行中岗位的技术要求，列出用户未掌握但高频的技术 |
| 进行中岗位 | 状态不是 `closed` 的岗位 |
| 示例数据 | 首次打开自动载入的演示岗位，带 `isSample` 标记 |
