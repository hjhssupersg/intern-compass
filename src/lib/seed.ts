import type { Job, SkillState, StorageError } from '../types'
import { addDays, todayLocal } from './date'
import { hasSeeded, loadJobs, loadSkills, markSeeded, saveJobs, saveSkills } from './storage'

export const SAMPLE_SKILLS: SkillState = { mastered: ['Java', 'MySQL', 'React'] }

export function createSampleJobs(today: string = todayLocal()): Job[] {
  const createdAt = new Date().toISOString()
  const samples: Omit<Job, 'id' | 'createdAt' | 'isSample'>[] = [
    {
      company: '字节跳动',
      title: '后端开发实习生（Java 方向）',
      location: '北京',
      deadline: addDays(today, 2),
      techTags: ['Java', 'Spring Boot', 'Redis', 'MySQL'],
      requirements: '熟悉 Java 与 Spring Boot，了解 Redis、MySQL 常用优化手段',
      rawJD:
        '【字节跳动】后端开发实习生（Java 方向）\n负责抖音电商交易链路的服务端开发。\n要求：熟悉 Java 与 Spring Boot，了解 Redis、MySQL 常用优化手段；有分布式系统课程项目优先。\n截止投递：见招聘官网。',
      status: 'todo',
    },
    {
      company: '阿里巴巴',
      title: '前端开发实习生',
      location: '杭州',
      deadline: addDays(today, 5),
      techTags: ['React', 'TypeScript'],
      requirements: '熟悉 React 与 TypeScript，有组件库或开源项目经验加分',
      rawJD:
        '【阿里巴巴】前端开发实习生\n参与淘宝商家后台的前端建设。\n要求：熟悉 React 与 TypeScript，理解组件化与状态管理；有组件库或开源项目经验加分。',
      status: 'applied',
    },
    {
      company: '腾讯',
      title: '后端开发实习生（Go 方向）',
      location: '深圳',
      deadline: addDays(today, 9),
      techTags: ['Go', 'Redis', 'Docker'],
      requirements: '熟悉 Go 并发模型，了解 Redis 与容器化部署',
      rawJD:
        '【腾讯】后端开发实习生（Go 方向）\n负责微信视频号推荐服务的开发与压测。\n要求：熟悉 Go 并发模型，了解 Redis 与容器化部署；有 ACM 或校赛经历优先。',
      status: 'written',
    },
    {
      company: '美团',
      title: '数据开发实习生',
      location: '北京',
      deadline: addDays(today, 14),
      techTags: ['Python', 'MySQL', 'Docker'],
      requirements: '熟悉 Python 与 SQL，了解数据仓库分层与调度',
      rawJD:
        '【美团】数据开发实习生\n参与外卖履约数据仓库的建模与报表开发。\n要求：熟悉 Python 与 SQL，了解数据仓库分层与调度；有 Spark 使用经验加分。',
      status: 'interview',
    },
    {
      company: '小红书',
      title: '前端开发实习生',
      location: '上海',
      techTags: ['React', 'TypeScript'],
      requirements: '熟悉 React 与 TypeScript，关注交互细节与性能',
      rawJD:
        '【小红书】前端开发实习生\n参与社区创作工具的前端开发。\n要求：熟悉 React 与 TypeScript，关注交互细节与性能；长期实习优先。',
      status: 'offer',
    },
    {
      company: '网易',
      title: '后端开发实习生（云音乐）',
      location: '杭州',
      deadline: addDays(today, -1),
      techTags: ['Java', 'Spring Boot', 'Kubernetes'],
      requirements: '熟悉 Java 与 Spring Boot，了解 Kubernetes 基本编排',
      rawJD:
        '【网易】后端开发实习生（云音乐）\n负责歌单推荐服务的接口开发。\n要求：熟悉 Java 与 Spring Boot，了解 Kubernetes 基本编排。',
      status: 'closed',
    },
  ]
  return samples.map((sample, index) => ({
    ...sample,
    id: `sample-${index + 1}`,
    createdAt,
    isSample: true,
  }))
}

export interface SeedResult {
  jobs: Job[]
  skills: SkillState
  didSeed: boolean
  saveError?: StorageError
}

export function ensureSeed(): SeedResult {
  const jobs = loadJobs()
  const skills = loadSkills()
  if (hasSeeded()) return { jobs, skills, didSeed: false }

  const sampleJobs = createSampleJobs()
  const saveError = saveJobs(sampleJobs).error ?? saveSkills(SAMPLE_SKILLS).error
  // 保存失败时不写 seeded 标记，下次打开仍有机会载入示例
  if (!saveError) {
    const markError = markSeeded().error
    return { jobs: sampleJobs, skills: SAMPLE_SKILLS, didSeed: true, saveError: markError }
  }
  return { jobs: sampleJobs, skills: SAMPLE_SKILLS, didSeed: true, saveError }
}

export function removeSamples(jobs: Job[], skills: SkillState): { jobs: Job[]; skills: SkillState } {
  return {
    jobs: jobs.filter((job) => !job.isSample),
    skills: {
      mastered: skills.mastered.filter((tag) => !SAMPLE_SKILLS.mastered.includes(tag)),
    },
  }
}