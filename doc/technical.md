# 《神谕协议 / Oracle Protocol》V2 技术文档

## 1. 技术栈

- React 18 + TypeScript，Vite 5 构建，`base: './'`，输出 `dist/`。
- Less 负责响应式布局、圆环、聚焦、翻牌、分页过渡和粒子。
- `computeBarajaOrbit()` 将 Codrops Baraja 的“显式卡序 → 每牌变换与层级”机制扩展为 360° 椭圆牌阵。
- CSS Holographic Masks 改造层只用于当前特殊主卡，使用 `mix-blend-mode: color-dodge`。
- Web Audio API 合成反馈音；所有创建与播放异常静默降级。
- Aigram `callAigramAPI()` 获取玩家 `name` 与 `head_url` 资料；资料失败不阻塞。
- 卡面与卡背为制作期通过 Aigram transit 绘图接口生成并编码的 WebP。

第三方来源与 MIT 声明在 `public/THIRD_PARTY_NOTICES.txt`，构建后同步进入 `dist/`。

## 2. 目录结构

```text
oracle-protocol/
├── _artifacts/                         # 绘图原图、生成记录与审核材料
├── _production/                        # 卡图生成、编码与海报制作脚本
├── _qa/
│   ├── capture-v2.mjs                  # V2 全流程双尺寸浏览器 QA
│   └── ui/                             # platform-layout / external-guest 证据
├── doc/
│   ├── requirements.md                 # V2 玩法蓝图
│   ├── visual.md                       # 神谕圆环视觉规范
│   ├── screen-contract.md              # 逐幕屏幕合同
│   ├── feedback-matrix.md              # 输入与反馈时序
│   └── technical.md                    # 本文档
├── public/
│   ├── card-art/*.webp                 # 12 张牌面与卡背
│   ├── poster.png
│   └── THIRD_PARTY_NOTICES.txt
└── src/
    ├── game-id.ts                      # 永久游戏 UUID
    └── OracleProtocol/
        ├── OracleProtocol.tsx           # 状态机、圆环交互、单牌与分页阅读
        ├── OracleProtocol.less          # 全部界面与动效
        ├── data/cards.ts                # 传统牌义、正逆位与反思问题
        ├── data/plain-readings.ts       # 面向普通玩家的白话解释与行动
        ├── lib/baraja-layout.ts         # 扇形与圆环变换计算
        ├── lib/baraja-deck.ts           # 可复用卡序控制器
        ├── styles/                      # Baraja 基础与全息箔
        ├── i18n/index.ts                # zh/en 界面文案
        └── utils/audio.ts               # 非阻塞合成音
```

## 3. 核心模块

### 状态机

`OracleProtocol.tsx` 使用 `intro → shuffling → choosing → focus → reveal → meaning → reading` 七阶段状态机。每屏只渲染当前任务：

- `choosing`：12/11/10 张牌沿圆环排布。
- `focus`：候选牌保存正逆位，从圆环位置动画到中央；可撤销。
- `reveal`：当前牌翻面，只呈现标题与白话结论。
- `meaning`：显示 2–3 行解释和一条行动建议。
- `reading`：`readingPage` 在 0–3 之间切换，分别显示过去、当下、下一步与今日提示。

`actionLockRef` 在同一事件循环中同步阻止重复输入；所有关键解锁使用有上限的 `setTimeout`，不依赖 `animation.finished` 或 `transitionend`。

### 圆环布局

`computeBarajaOrbit(count, settings)` 按卡序计算角度、`translateX/Y`、朝向圆心的旋转和 z-index。主组件根据 `innerWidth / innerHeight` 选择 `103×126` 或 `138×178` 半径。CSS 变量将姿态交给每个卡牌按钮，保持可访问按钮语义。

### 白话解读

`plain-readings.ts` 为 12 张牌的正逆位各提供：

- `headline`：一眼能懂的结论。
- `message`：不超过 3 行的生活化解释。
- `action`：今天可执行的一件小事。

经典牌义与反思问题仍保留在 `cards.ts`，只在分页阅读的“问问自己”区域使用。界面不再展示模型漂移、损失函数或版本迁移等技术黑话。

### 视觉、响应式与无障碍

卡面固定 2:3；圆环和中央主卡使用响应式尺寸。390×844 与 320×568 有独立半径、主卡和排版规则。功能图标为同一套 SVG，按钮最小 44×44 px，圆环每张牌为真实按钮并有 `aria-label`。`prefers-reduced-motion` 下直接到达相同布局终态。

### 音频与平台

`audio.ts` 首次操作后创建或恢复 `AudioContext`，每个节点创建都包在异常保护中。`usePlayerName.ts` 按调试覆盖、Aigram 当前玩家、平台外 `AlterU` 回退；资料请求与图片失败都不阻塞游戏。

## 4. 扩展点

- 调整圆环半径、旋转或层级：`src/OracleProtocol/lib/baraja-layout.ts` 与 `OracleProtocol.tsx` 的 orbit settings。
- 修改页面顺序或抽牌规则：`OracleProtocol.tsx` 的阶段处理函数。
- 改白话解读与今日行动：`data/plain-readings.ts`。
- 改经典牌义、反思问题或新增牌：`data/cards.ts`，并在 `public/card-art/` 添加图片。
- 调整色彩、字号、主卡尺寸、全息强度和短屏布局：`OracleProtocol.less`。
- 修改 zh/en 界面按钮：`i18n/index.ts`。
- 新增声音：`utils/audio.ts`，保持异常不阻塞状态机。
- 发布元数据：根目录 `meta.json`、`README.md`、`public/poster.png` 和 games 仓库条目。
