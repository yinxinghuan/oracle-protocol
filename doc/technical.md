# 《神谕协议 / Oracle Protocol》技术文档

## 1. 技术栈

- 框架：React 18 + TypeScript。
- 构建：Vite 5，`base: './'`，`npm run build` 输出可部署的 `dist/`。
- 样式：Less；界面、卡牌翻转、全息箔和粒子均由 DOM/CSS 完成。
- 牌组动画：项目内的无依赖 TypeScript `BarajaDeck`，依据 Codrops Baraja
  v1.0.0 的 MIT 源码机制重写，扇形几何与 DOM 控制器分离。
- 音频：Web Audio API 运行时合成，不加载音频文件。
- 玩家资料：复用本地 `@shared/runtime` 的 `callAigramAPI()`。
- 图像：制作期通过 Aigram transit 绘图接口生成 1024×1024 PNG 源图，运行时
  转为质量 86 的 WebP；浏览器内不等待生图。

第三方来源、固定版本、许可证与完整保留声明位于
`public/THIRD_PARTY_NOTICES.txt`，构建后同样进入
`dist/THIRD_PARTY_NOTICES.txt`。

## 2. 目录结构

```text
oracle-protocol/
├── _artifacts/                    # 绘图原图、被淘汰版本、生成日志与 QA 缩略图
├── _production/
│   ├── generate_card_art.py       # 串行调用 Aigram 绘图接口并记录 URL/提示词
│   ├── encode_card_art.mjs        # 将审核通过的 PNG 批量压缩成运行时 WebP
│   └── make_poster.mjs            # 给平台生成的叙事底图做栅格排版
├── doc/
│   ├── requirements.md            # 玩法与产品要求
│   ├── visual.md                  # 视觉系统与实机验收结论
│   ├── screen-contract.md         # 屏幕、状态和响应式合同
│   ├── feedback-matrix.md         # 事件反馈矩阵
│   └── technical.md               # 本文档
├── public/
│   ├── card-art/*.webp            # 12 张牌面、卡背与海报底图
│   ├── poster.png                 # 1024×1024 正式封面
│   └── THIRD_PARTY_NOTICES.txt
├── src/
│   ├── OracleProtocol/
│   │   ├── components/            # SVG 图标与 AlterU 水印
│   │   ├── data/cards.ts          # 12 张牌、正逆位牌义和反思问题
│   │   ├── hooks/usePlayerName.ts # 玩家称呼与回退顺序
│   │   ├── i18n/index.ts          # zh/en 文案
│   │   ├── lib/                   # Baraja 控制器与纯布局函数
│   │   ├── styles/                # 第三方机制适配后的牌组/全息基础样式
│   │   ├── utils/audio.ts         # 合成音效
│   │   ├── OracleProtocol.tsx     # 状态机、输入与全部屏幕
│   │   └── OracleProtocol.less    # 视觉系统、响应式与动效
│   ├── shared/runtime/            # 平台桥接运行时
│   └── game-id.ts                 # 永久游戏 UUID
├── index.html
├── meta.json
└── vite.config.ts
```

## 3. 核心模块

### 状态与主流程

`OracleProtocol.tsx` 使用五态状态机：
`intro → shuffling → choosing → reveal → reading`。`remaining` 保存未抽牌，
`drawn` 保存牌与本局固定的正逆位，`revealedCount` 保证必须按过去、现在、
未来逐张翻开。`locked` 覆盖洗牌、抽牌置顶和翻牌恢复窗口，防止快速重复输入。

洗牌使用 `crypto.getRandomValues` 驱动 Fisher–Yates；单张逆位概率为 35%。
综合神谕不请求网络，由三张已抽牌的确定性牌义组合，因此资料接口或网络失败
不会阻塞第一层反馈。

### 牌组与屏幕适配

`lib/baraja-layout.ts` 是纯函数：根据卡数、扇面角度、方向、位移和变换原点
生成每张牌的姿态。`lib/baraja-deck.ts` 只负责真实 DOM 的动画、层级和置顶。
390×844 使用 54° 扇面；320 宽或 640 高以下降低到 38°–44°，并缩小卡宽。

牌面固定为 2:3，使用 `object-fit: cover` 从方形生成图中取中央安全区。图片失败
时显示几何版画占位，同时保留牌名、方向、关键词和全部解读。

### 输入与无障碍

开始、抽牌和翻牌使用 `onPointerDown`，避免移动端 mouse/touch 双触发；结果页
的“再次连接”位于可滚动内容内，使用 `onClick`。扇面牌额外处理 Enter/Space，
键盘 `1/2/3` 可选左、中、右候选。隐藏牌的无障碍名称只描述“扇面第 n 张”，
不泄露真实牌号。所有功能图标是同一线性 SVG 系统，目标至少 44×44。

入口 `index.html` 包含 iOS 长按保护。`prefers-reduced-motion` 会将牌堆与翻牌
过渡缩短或取消，并保留静态全息材质。

### 全息与音频

`holographic-card-foil.css` 仅应用于 `holographic: true` 的“对齐”“开源之星”
和“奇点”。它使用卡内伪元素的多层渐变、混合模式与 `background-position`
动画，不复制原 Demo 图片或遮罩纹理。稀有牌翻开时触发 10 个棱镜细片和四音
上行；普通牌为 6 个金箔细片和双音反馈。

音频模块在首次用户操作后解锁 `AudioContext`。创建或播放失败会静默降级，
不改变游戏状态。

### 多语言与玩家身份

所有界面文案通过 `i18n/index.ts` 的 `t()` 读取，支持 `zh/en`，语言选择保存在
`game_locale`。玩家称呼顺序为：

1. `?user_name=` 调试覆盖；
2. AlterU 内调用
   `/note/telegram/user/get/info/by/telegram_id?telegram_id=…`，优先读取
   `data.name`，兼容 `data.user_name`；
3. 平台外或接口失败使用 `AlterU`。

本作的视觉主体是固定的原创大阿尔卡那插画，不读取示例人物照片，也不把头像
仅装饰在 HUD；玩家身份通过名字进入仪式称呼和结果标题。

## 4. 扩展点

- 改牌义或新增牌：编辑 `src/OracleProtocol/data/cards.ts`；新增牌时同时添加
  `public/card-art/<id>.webp`，并检查扇面在 320×568 的暴露点击区。
- 改牌阵：编辑 `POSITIONS`、抽牌上限、`choicePrompt` 和结果三段映射；若超过
  3 张，需要重新设计翻牌网格，不能只压缩卡宽。
- 调整随机或正逆位概率：修改 `shuffledCards()` 与 `handleDraw()`。
- 调视觉：优先改 `OracleProtocol.less` 顶部颜色变量和相应组件块；全息强度在
  `.op-card-face` 的 `--hcf-opacity/--hcf-duration` 调整。
- 换卡图：修改 `_production/generate_card_art.py` 的场景与工艺提示，串行生成后
  做视觉审查，再压缩为同名 WebP。`generation-log.json` 必须保留请求 URL、
  原始提示词和拒绝记录。
- 加后端保存：在进入 `reading` 后持久化牌号、正逆位、协议 ID 与时间；恢复时
  直接重建 `drawn`，不要重新随机。游戏 UUID
  `6c0e2a8d-a814-4de8-bf4a-c61ac04fdf1e` 永久不变。
- 换音效：编辑 `utils/audio.ts` 的频率、波形、包络；仍需保持首次操作后才创建
  AudioContext。
