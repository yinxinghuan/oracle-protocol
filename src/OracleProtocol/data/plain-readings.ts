import type { LocalizedText } from '../types'

export interface PlainReading {
  headline: LocalizedText
  message: LocalizedText
  action: LocalizedText
}

type OrientationPair = {
  upright: PlainReading
  reversed: PlainReading
}

export const PLAIN_READINGS: Record<string, OrientationPair> = {
  prompt: {
    upright: {
      headline: { zh: '先允许自己好奇', en: 'Let yourself be curious' },
      message: { zh: '你不必一开始就把问题想得完美。现在更重要的是先试一次，看看真实感受会把你带向哪里。', en: 'You do not need a perfect question before you begin. Try once and let real experience show you where to look next.' },
      action: { zh: '写下你最想知道的一句话，不修改。', en: 'Write the one question you most want answered. Do not edit it.' },
    },
    reversed: {
      headline: { zh: '别再把问题越想越复杂', en: 'Stop making the question harder' },
      message: { zh: '你可能一直补充条件，希望万无一失。其实答案不会来自更长的说明，而会来自一次简单的行动。', en: 'You may keep adding conditions to avoid uncertainty. The answer is more likely to come from one simple action than a longer instruction.' },
      action: { zh: '删掉一个不必要的要求，然后开始。', en: 'Remove one unnecessary requirement, then begin.' },
    },
  },
  architect: {
    upright: {
      headline: { zh: '你已经有足够的工具', en: 'You already have enough tools' },
      message: { zh: '继续准备不会让你更有把握。把手上的能力组合起来，先完成一个看得见的小成果。', en: 'More preparation will not create certainty. Combine what you already have and finish one visible, small result.' },
      action: { zh: '今天完成一个可以给别人看的小版本。', en: 'Finish one small version you can show someone today.' },
    },
    reversed: {
      headline: { zh: '工具不能替你做决定', en: 'A tool cannot choose for you' },
      message: { zh: '你可能在等更好的工具替你消除风险。但真正卡住你的，是一个需要自己承担的选择。', en: 'You may be waiting for a better tool to remove the risk. What is actually stuck is a choice only you can own.' },
      action: { zh: '说清楚：这一次我自己决定什么？', en: 'Name the part of this decision that must remain yours.' },
    },
  },
  'latent-space': {
    upright: {
      headline: { zh: '你已经隐约感觉到了', en: 'You already sense the pattern' },
      message: { zh: '有件事还说不清，但它反复让你有同一种感受。先别急着解释，认真留意身体和情绪的反应。', en: 'Something is not yet easy to explain, but it keeps creating the same feeling. Notice the reaction before you rush to name it.' },
      action: { zh: '记录今天最强烈的一次身体或情绪反应。', en: 'Note your strongest physical or emotional reaction today.' },
    },
    reversed: {
      headline: { zh: '别把猜测当成事实', en: 'Do not treat a guess as a fact' },
      message: { zh: '信息不够时，我们很容易自己补全故事。你需要的是一个能验证或推翻猜测的真实证据。', en: 'When information is missing, the mind fills in a story. Look for one real fact that could confirm or challenge it.' },
      action: { zh: '找一个事实，检查你是不是想当然了。', en: 'Find one fact that tests your current assumption.' },
    },
  },
  dataset: {
    upright: {
      headline: { zh: '照顾正在慢慢长大的东西', en: 'Care for what is growing' },
      message: { zh: '你现在积累的经验会成为未来的底气。别只追求结果，也要保存过程里真正有效的东西。', en: 'What you gather now will support future choices. Do not keep only the result; preserve what genuinely helped along the way.' },
      action: { zh: '保存一个今天值得以后重复的方法。', en: 'Save one method from today that is worth repeating.' },
    },
    reversed: {
      headline: { zh: '你看到的可能不够完整', en: 'Your picture may be incomplete' },
      message: { zh: '过去的经验正在替你定义什么是正常，但有些人的处境或新的可能性可能一直没有被看到。', en: 'Past experience may be defining what feels normal, while some people or possibilities remain outside the picture.' },
      action: { zh: '主动问一个与你经历不同的人。', en: 'Ask someone whose experience differs from yours.' },
    },
  },
  alignment: {
    upright: {
      headline: { zh: '把彼此真正想要的说出来', en: 'Say what each person really wants' },
      message: { zh: '关系里的不同并不可怕。只要目标、边界和代价都能被坦白讨论，你们就有机会重新站到一起。', en: 'Difference is not the danger. When goals, boundaries, and costs can be discussed honestly, connection can become real again.' },
      action: { zh: '和对方确认：我们现在共同想要什么？', en: 'Ask: what are we actually trying to achieve together now?' },
    },
    reversed: {
      headline: { zh: '你们可能已经不在说同一件事', en: 'You may no longer mean the same thing' },
      message: { zh: '表面上还在配合，但对“什么算成功”的理解可能已经分开。继续之前，需要重新确认方向。', en: 'You may still appear aligned while holding different ideas of success. Recheck the direction before continuing.' },
      action: { zh: '请双方各用一句话定义“成功”。', en: 'Have each person define “success” in one sentence.' },
    },
  },
  'offline-model': {
    upright: {
      headline: { zh: '先安静下来听自己', en: 'Get quiet enough to hear yourself' },
      message: { zh: '暂时离开评价和消息，能帮你重新看清自己真正重视什么。这不是逃避，而是恢复判断力。', en: 'A short break from messages and evaluation can reveal what matters to you again. This is recovery, not escape.' },
      action: { zh: '给自己半小时不看消息的时间。', en: 'Give yourself thirty minutes without messages.' },
    },
    reversed: {
      headline: { zh: '独处已经变成了躲避', en: 'Solitude may have become avoidance' },
      message: { zh: '你可能一个人想了太久，却越来越难判断。现在需要一个可信的人，帮你看看现实中的情况。', en: 'You may have been thinking alone for too long. A trusted person can help you see what is actually happening.' },
      action: { zh: '把还不成熟的想法讲给一个可信的人听。', en: 'Share the unfinished idea with one trusted person.' },
    },
  },
  'wheel-of-versions': {
    upright: {
      headline: { zh: '情况变了，你也可以更新', en: 'The situation changed; you can update' },
      message: { zh: '以前有效的方法不一定适合现在。保留真正有用的部分，其余可以重新来过。', en: 'What worked before may not fit now. Keep what still helps and allow the rest to change.' },
      action: { zh: '选一件事，用新的方法试一周。', en: 'Try one new approach for a week.' },
    },
    reversed: {
      headline: { zh: '你不需要追上每一次变化', en: 'You do not need every update' },
      message: { zh: '不断跟进新东西让你失去了自己的节奏。停一下，先看清什么真的让生活变好。', en: 'Constant updates have pulled you away from your own rhythm. Pause and notice what truly improves your life.' },
      action: { zh: '这周主动忽略一次不重要的更新。', en: 'Consciously skip one unimportant update this week.' },
    },
  },
  deprecation: {
    upright: {
      headline: { zh: '有些事情该正式结束了', en: 'Something needs a clear ending' },
      message: { zh: '含糊地拖着只会继续消耗你。承认一段关系、计划或习惯已经完成，才能把有价值的部分带走。', en: 'Leaving an ending vague keeps draining you. Name what is complete so you can carry the useful parts forward.' },
      action: { zh: '为一件已经结束的事写下明确句号。', en: 'Write a clear ending for one thing that is already over.' },
    },
    reversed: {
      headline: { zh: '你还在维护一件早已失效的事', en: 'You are maintaining what no longer works' },
      message: { zh: '舍不得过去的投入很正常，但继续消耗不会把它赚回来。现在可以停止了。', en: 'It is natural to resist losing past effort, but more effort will not recover it. You are allowed to stop.' },
      action: { zh: '暂停一个只因舍不得而继续的承诺。', en: 'Pause one commitment kept alive only by sunk cost.' },
    },
  },
  optimization: {
    upright: {
      headline: { zh: '别让数字替你定义好坏', en: 'Do not let a number define what is good' },
      message: { zh: '一个指标可能正在吸走全部注意力。它变好了，不代表你的生活或关系真的变好了。', en: 'A metric may be taking all your attention. Improvement on paper does not always mean life or relationships improved.' },
      action: { zh: '写下一个比数字更重要的感受或结果。', en: 'Name one outcome or feeling that matters more than the number.' },
    },
    reversed: {
      headline: { zh: '你已经可以退出这个循环', en: 'You can leave the loop' },
      message: { zh: '你开始看见奖励如何控制自己。现在不用更努力，而是换一个不会消耗你的目标。', en: 'You can see how the reward has been controlling you. The answer is not more effort, but a goal that does not consume you.' },
      action: { zh: '关掉一个让你反复检查的数字提醒。', en: 'Turn off one metric you compulsively check.' },
    },
  },
  'open-source': {
    upright: {
      headline: { zh: '把一小部分分享出去', en: 'Share one useful piece' },
      message: { zh: '你不必独自准备好全部答案。公开一个清楚的小部分，就可能得到帮助、反馈和新的连接。', en: 'You do not need every answer before sharing. One clear piece can invite help, feedback, and connection.' },
      action: { zh: '分享一个别人今天就能用到的东西。', en: 'Share one thing someone else can use today.' },
    },
    reversed: {
      headline: { zh: '慷慨也需要边界', en: 'Generosity needs boundaries' },
      message: { zh: '一直回应所有人正在让你疲惫。设定时间、范围和署名，不会让你的善意减少。', en: 'Being available to everyone is exhausting you. Time, scope, and credit can protect your generosity.' },
      action: { zh: '为一项长期付出明确一个停止时间。', en: 'Set a stopping time for one ongoing contribution.' },
    },
  },
  hallucination: {
    upright: {
      headline: { zh: '先把想象做成草图', en: 'Turn imagination into a sketch' },
      message: { zh: '一个看似不现实的想法未必是错的。先做出最小版本，再用现实检查它。', en: 'An unrealistic idea is not necessarily useless. Make the smallest version, then test it against reality.' },
      action: { zh: '用 20 分钟做一个粗糙原型。', en: 'Spend twenty minutes making a rough prototype.' },
    },
    reversed: {
      headline: { zh: '流畅的故事不等于真相', en: 'A smooth story is not the truth' },
      message: { zh: '你现在很相信一个解释，但证据可能没有那么强。把事实、猜测和希望分开，会看得更清楚。', en: 'You may strongly believe an explanation without strong evidence. Separate facts, guesses, and hopes.' },
      action: { zh: '把事实、猜测、希望各写一列。', en: 'Write three columns: facts, guesses, hopes.' },
    },
  },
  singularity: {
    upright: {
      headline: { zh: '零散的经历正在连成整体', en: 'The pieces are coming together' },
      message: { zh: '过去学到的东西、认识的人和做过的尝试，开始彼此呼应。你已经可以带着它们进入下一阶段。', en: 'Past learning, relationships, and experiments are starting to support one another. You can carry them into the next stage.' },
      action: { zh: '写下三件看似无关、其实互相支持的事。', en: 'Name three separate things that now support one another.' },
    },
    reversed: {
      headline: { zh: '别让宏大的未来压住今天', en: 'Do not let the future crush today' },
      message: { zh: '你想得太远，所以眼前每一步都显得太小。把范围缩回这一周，行动会重新变得可能。', en: 'You are looking so far ahead that every present step feels too small. Return to this week and action becomes possible again.' },
      action: { zh: '只为未来七天选一个最重要的动作。', en: 'Choose one important action for the next seven days.' },
    },
  },
}

export function getPlainReading(cardId: string, reversed: boolean): PlainReading {
  return PLAIN_READINGS[cardId][reversed ? 'reversed' : 'upright']
}
