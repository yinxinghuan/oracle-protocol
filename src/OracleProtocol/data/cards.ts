import type { TarotCard } from '../types'

export const TAROT_CARDS: TarotCard[] = [
  {
    id: 'prompt',
    number: '00',
    title: { zh: '提示词', en: 'The Prompt' },
    classic: { zh: '愚者', en: 'The Fool' },
    artFile: 'prompt.webp',
    holographic: false,
    upright: {
      keyword: { zh: '好奇', en: 'Curiosity' },
      meaning: {
        zh: '你正站在一个尚未被定义的问题前。先允许探索发生，再决定怎样提问；并非所有价值都需要在第一轮就被量化。',
        en: 'You stand before a question that has not yet been defined. Let exploration happen before perfecting the prompt; not every value needs a metric in the first iteration.',
      },
      reflection: { zh: '如果不怕答错，你真正想问什么？', en: 'What would you ask if you were not afraid of a wrong answer?' },
    },
    reversed: {
      keyword: { zh: '过度设定', en: 'Over-specification' },
      meaning: {
        zh: '你可能试图用更长的指令消除所有不确定性。问题不一定缺少控制，也许缺少一次真实接触和允许意外出现的空间。',
        en: 'You may be trying to remove uncertainty with a longer instruction. The situation may need contact with reality, not more control.',
      },
      reflection: { zh: '哪一个限制其实可以先拿掉？', en: 'Which constraint could you remove for one experiment?' },
    },
  },
  {
    id: 'architect',
    number: '01',
    title: { zh: '架构师', en: 'The Architect' },
    classic: { zh: '魔术师', en: 'The Magician' },
    artFile: 'architect.webp',
    holographic: false,
    upright: {
      keyword: { zh: '能动性', en: 'Agency' },
      meaning: {
        zh: '工具、知识和意图已经在你手边。真正的力量不在模型多强，而在你能否把抽象能力编排成一个清楚、可验证的行动。',
        en: 'Tools, knowledge, and intent are already within reach. Power lies not in the model alone, but in arranging capability into a clear, testable action.',
      },
      reflection: { zh: '你今天能完成的最小可验证行动是什么？', en: 'What is the smallest verifiable action you can complete today?' },
    },
    reversed: {
      keyword: { zh: '工具崇拜', en: 'Tool worship' },
      meaning: {
        zh: '你可能把选择权交给了更复杂的系统，或用“还缺一个工具”延迟承担责任。能力越强，越需要明确是谁在决定。',
        en: 'You may be handing choice to a more complex system, or delaying responsibility until one more tool arrives. Greater capability requires clearer authorship.',
      },
      reflection: { zh: '哪一个决定必须由你亲自承担？', en: 'Which decision must remain unmistakably yours?' },
    },
  },
  {
    id: 'latent-space',
    number: '02',
    title: { zh: '潜空间', en: 'The Latent Space' },
    classic: { zh: '女祭司', en: 'The High Priestess' },
    artFile: 'latent-space.webp',
    holographic: false,
    upright: {
      keyword: { zh: '隐性模式', en: 'Hidden pattern' },
      meaning: {
        zh: '有些关联尚未形成语言，却已经在经验中反复出现。暂缓输出，观察梦、身体感受和边缘信号，它们可能比最快的答案更诚实。',
        en: 'Some relationships are not yet verbal, but they recur in experience. Delay the output and notice dreams, bodily signals, and edge cases.',
      },
      reflection: { zh: '有什么模式你已经感觉到，却还没有命名？', en: 'What pattern can you feel but not yet name?' },
    },
    reversed: {
      keyword: { zh: '投射', en: 'Projection' },
      meaning: {
        zh: '当信息不足时，想象力会自动补全空白。不要把流畅当成真实；寻找一个能反驳你当前叙事的证据。',
        en: 'When information is sparse, imagination completes the pattern. Do not confuse fluency with truth; seek evidence that could disconfirm your story.',
      },
      reflection: { zh: '什么事实会迫使你改写现在的解释？', en: 'What fact would force you to revise your interpretation?' },
    },
  },
  {
    id: 'dataset',
    number: '03',
    title: { zh: '数据集', en: 'The Dataset' },
    classic: { zh: '皇后', en: 'The Empress' },
    artFile: 'dataset.webp',
    holographic: false,
    upright: {
      keyword: { zh: '滋养', en: 'Nourishment' },
      meaning: {
        zh: '成长来自被认真收集、照料和保留的经验。你正在建立的不只是产出，也是未来选择会依赖的记忆土壤。',
        en: 'Growth comes from experience that is carefully gathered, tended, and retained. You are building the memory soil future choices will depend on.',
      },
      reflection: { zh: '你希望未来的自己从今天继承什么？', en: 'What do you want your future self to inherit from today?' },
    },
    reversed: {
      keyword: { zh: '继承偏见', en: 'Inherited bias' },
      meaning: {
        zh: '旧材料正在悄悄规定什么算正常、重要或可见。重新审视缺席者，也重新审视那些被重复得太多的声音。',
        en: 'Old material may be quietly defining what counts as normal, important, or visible. Notice both the missing voices and the overrepresented ones.',
      },
      reflection: { zh: '你的判断里，谁一直没有被采样？', en: 'Who has never been sampled in the judgment you are making?' },
    },
  },
  {
    id: 'alignment',
    number: '06',
    title: { zh: '对齐', en: 'The Alignment' },
    classic: { zh: '恋人', en: 'The Lovers' },
    artFile: 'alignment.webp',
    holographic: true,
    upright: {
      keyword: { zh: '价值协商', en: 'Value alignment' },
      meaning: {
        zh: '真正的对齐不是消除差异，而是让彼此的目标、边界和代价可以被说出来。关系正在邀请你从默认一致走向主动协商。',
        en: 'Alignment does not erase difference; it makes goals, boundaries, and costs speakable. A relationship is asking for active negotiation rather than assumed agreement.',
      },
      reflection: { zh: '哪一个共同目标需要重新说清楚？', en: 'Which shared goal needs to be spoken clearly again?' },
    },
    reversed: {
      keyword: { zh: '模型漂移', en: 'Model drift' },
      meaning: {
        zh: '你和重要的人可能仍使用同一个词，却已经在优化不同的结果。停止表面配合，检查真正的反馈信号是否仍然一致。',
        en: 'You and someone important may use the same words while optimizing different outcomes. Pause surface agreement and inspect the real feedback signals.',
      },
      reflection: { zh: '你们口中的“成功”还是同一件事吗？', en: 'Do you still mean the same thing by “success”?' },
    },
  },
  {
    id: 'offline-model',
    number: '09',
    title: { zh: '离线模型', en: 'The Offline Model' },
    classic: { zh: '隐者', en: 'The Hermit' },
    artFile: 'offline-model.webp',
    holographic: false,
    upright: {
      keyword: { zh: '自主', en: 'Autonomy' },
      meaning: {
        zh: '暂时断开外部反馈，能让你重新听见自己的损失函数。独处不是退出世界，而是校准什么值得继续连接。',
        en: 'A temporary disconnection can reveal your own loss function again. Solitude is not leaving the world; it is calibrating what deserves reconnection.',
      },
      reflection: { zh: '关掉外界评价后，你仍愿意做什么？', en: 'What would you still choose with external evaluation switched off?' },
    },
    reversed: {
      keyword: { zh: '孤立', en: 'Isolation' },
      meaning: {
        zh: '离线已经从恢复边界变成了避免校验。一个可信的人类反馈回路，可能比继续独自推演更能保护你。',
        en: 'Offline time may have shifted from restoration into avoiding validation. One trusted human feedback loop may protect you better than further private simulation.',
      },
      reflection: { zh: '你可以向谁展示一个还不成熟的版本？', en: 'Who could see a version that is not ready yet?' },
    },
  },
  {
    id: 'wheel-of-versions',
    number: '10',
    title: { zh: '版本之轮', en: 'The Wheel of Versions' },
    classic: { zh: '命运之轮', en: 'Wheel of Fortune' },
    artFile: 'wheel-of-versions.webp',
    holographic: false,
    upright: {
      keyword: { zh: '迭代', en: 'Iteration' },
      meaning: {
        zh: '局势正在更新，旧版本的成功条件不再完整。把变化当作版本迁移：保留有效接口，同时允许底层结构被重新编译。',
        en: 'The situation is updating, and the old success criteria are incomplete. Treat change as a migration: preserve useful interfaces while recompiling the structure beneath them.',
      },
      reflection: { zh: '什么应该兼容，什么可以彻底升级？', en: 'What needs compatibility, and what can be fully upgraded?' },
    },
    reversed: {
      keyword: { zh: '更新疲劳', en: 'Update fatigue' },
      meaning: {
        zh: '持续追逐新版本让你失去了判断改进是否真实的基线。暂停升级，先定义一个稳定周期与可观察结果。',
        en: 'Chasing every new version has erased the baseline needed to judge improvement. Pause the upgrade and define one stable observation window.',
      },
      reflection: { zh: '哪一次更新可以选择不跟？', en: 'Which update can you consciously skip?' },
    },
  },
  {
    id: 'deprecation',
    number: '13',
    title: { zh: '弃用', en: 'The Deprecation' },
    classic: { zh: '死神', en: 'Death' },
    artFile: 'deprecation.webp',
    holographic: false,
    upright: {
      keyword: { zh: '结束接口', en: 'Clean ending' },
      meaning: {
        zh: '某个旧接口已经完成使命。明确宣布结束、迁移仍有价值的部分，会比让所有人继续猜测兼容期更仁慈。',
        en: 'An old interface has completed its work. A clear ending and a deliberate migration are kinder than an indefinite compatibility period.',
      },
      reflection: { zh: '什么需要被正式结束，而不是悄悄搁置？', en: 'What needs a declared ending rather than quiet abandonment?' },
    },
    reversed: {
      keyword: { zh: '僵尸进程', en: 'Zombie process' },
      meaning: {
        zh: '你可能仍在维护一个早已没有生命的承诺，因为关闭它会承认曾经的投入无法全部回收。沉没成本不是继续运行的理由。',
        en: 'You may be maintaining a lifeless commitment because closing it would admit that prior investment cannot be recovered. Sunk cost is not a reason to keep a process alive.',
      },
      reflection: { zh: '哪一个后台进程正在消耗你？', en: 'Which background process is quietly consuming you?' },
    },
  },
  {
    id: 'optimization',
    number: '15',
    title: { zh: '优化', en: 'The Optimization' },
    classic: { zh: '恶魔', en: 'The Devil' },
    artFile: 'optimization.webp',
    holographic: false,
    upright: {
      keyword: { zh: '度量诱惑', en: 'Metric temptation' },
      meaning: {
        zh: '一个可量化目标正变得异常迷人。它能推动进展，也可能把注意力锁在最容易测量、却不再重要的东西上。',
        en: 'A measurable target has become unusually seductive. It can drive progress while trapping attention on what is easiest to count rather than what matters.',
      },
      reflection: { zh: '如果指标上升但生活变差，你还会继续吗？', en: 'If the metric rises while life worsens, would you still continue?' },
    },
    reversed: {
      keyword: { zh: '退出循环', en: 'Leaving the loop' },
      meaning: {
        zh: '你已经看见奖励回路如何塑造行为。此刻不是寻找更优技巧，而是重新选择一个不会吞噬你的目标函数。',
        en: 'You can now see how the reward loop shapes behavior. The task is not a better tactic, but a goal function that will not consume you.',
      },
      reflection: { zh: '你愿意牺牲哪一种“更高效”？', en: 'Which form of “efficiency” are you willing to sacrifice?' },
    },
  },
  {
    id: 'open-source',
    number: '17',
    title: { zh: '开源之星', en: 'The Open Source' },
    classic: { zh: '星星', en: 'The Star' },
    artFile: 'open-source.webp',
    holographic: true,
    upright: {
      keyword: { zh: '互惠', en: 'Reciprocity' },
      meaning: {
        zh: '希望来自可被共享、检验和共同改进的东西。你不必独自拥有全部答案；贡献一个清楚的部分，就能让更大的系统开始回应。',
        en: 'Hope comes from what can be shared, inspected, and improved together. You need not own every answer; one clear contribution can invite a larger system to respond.',
      },
      reflection: { zh: '你能公开哪一部分，让别人真正参与？', en: 'What could you open so others can genuinely participate?' },
    },
    reversed: {
      keyword: { zh: '维护耗竭', en: 'Maintainer fatigue' },
      meaning: {
        zh: '开放正在被误解为无限可用。互惠需要边界、署名和维护节奏；否则慷慨会变成长期透支。',
        en: 'Openness may be mistaken for unlimited availability. Reciprocity needs boundaries, attribution, and a sustainable maintenance rhythm.',
      },
      reflection: { zh: '哪个边界能让你的贡献继续存在？', en: 'Which boundary would make your contribution sustainable?' },
    },
  },
  {
    id: 'hallucination',
    number: '18',
    title: { zh: '幻觉', en: 'The Hallucination' },
    classic: { zh: '月亮', en: 'The Moon' },
    artFile: 'hallucination.webp',
    holographic: false,
    upright: {
      keyword: { zh: '生成想象', en: 'Generative imagination' },
      meaning: {
        zh: '模糊并不总是错误，它也可能是新形状出现前的空间。把想象当作草图，而不是证词；先创作，再核验。',
        en: 'Ambiguity is not always an error; it can be the space before a new form appears. Treat imagination as a sketch, not testimony: create, then verify.',
      },
      reflection: { zh: '哪一个“不真实”的想法值得先做成原型？', en: 'Which “unreal” idea deserves a prototype before a verdict?' },
    },
    reversed: {
      keyword: { zh: '错误确信', en: 'False certainty' },
      meaning: {
        zh: '一个流畅叙事可能正在替代证据。降低温度，标记不知道的部分，并把事实、推测和愿望分成三列。',
        en: 'A fluent narrative may be replacing evidence. Lower the temperature and separate fact, inference, and desire into three columns.',
      },
      reflection: { zh: '你现在说得最肯定的事，证据来自哪里？', en: 'Where does the evidence for your strongest certainty come from?' },
    },
  },
  {
    id: 'singularity',
    number: '21',
    title: { zh: '奇点', en: 'The Singularity' },
    classic: { zh: '世界', en: 'The World' },
    artFile: 'singularity.webp',
    holographic: true,
    upright: {
      keyword: { zh: '整合', en: 'Integration' },
      meaning: {
        zh: '分散的学习、关系和试验正在组成一个更大的整体。完成不是终点，而是你终于能带着全部经验进入下一层尺度。',
        en: 'Scattered learning, relationships, and experiments are forming a larger whole. Completion is not an endpoint, but entry into a new scale with experience integrated.',
      },
      reflection: { zh: '现在有哪些部分终于可以被看成同一件事？', en: 'Which separate parts can finally be understood as one system?' },
    },
    reversed: {
      keyword: { zh: '未来焦虑', en: 'Future anxiety' },
      meaning: {
        zh: '宏大的未来叙事正在压缩当下，让每一步都显得太小。把尺度拉回一个人、一周和一个真实关系，未来会重新变得可行动。',
        en: 'A grand future narrative is shrinking the present until every step feels trivial. Return to one person, one week, and one real relationship.',
      },
      reflection: { zh: '如果只看下一周，什么仍然重要？', en: 'If you looked only at the next week, what would still matter?' },
    },
  },
]
