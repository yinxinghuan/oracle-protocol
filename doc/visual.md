# 《神谕协议 / Oracle Protocol》视觉规范

## 1. Visual thesis

- Game and audience：面向 AlterU 移动端玩家的 2–4 分钟 AI 主题塔罗体验。
- Emotional promise：打开一套来自未来修道院的个人神谕，而不是操作一套普通科技 UI。
- One-sentence visual thesis：黑色羊皮纸上的古老金箔手抄本，被模型拓扑、数据校注和少量冷色全息光重新激活。
- Signature visual moment：抽到“奇点”时，沉静的骨白蚀刻被一条缓慢移动的棱镜光谱穿过，三张牌短暂形成完整的神经星图。
- Three required qualities：仪式感；卡面收藏感；当代隐喻清晰但不直白画机器人。
- Three directions to avoid：通用蓝紫赛博朋克；廉价灵性水晶店；光滑动漫抽卡。

方向探索记录：

1. **已选：后人类手抄本**——黑羊皮纸、骨白蚀刻、旧金箔与冷青拓扑，最能把塔罗传统与 AI 主题融合。
2. **未选：合成主义包豪斯**——纯几何、红黄蓝数据卡，信息清晰但缺少神谕仪式。
3. **未选：服务器遗迹摄影**——废弃机房与宗教建筑的超现实摄影，叙事强但整套牌的一致性和缩略图辨识风险较高。

## 2. Composition and camera

- Orientation and aspect ratios：响应式竖屏；主验收 390×844，窄屏 320×568；桌面内容最大宽 520 px。
- Camera and perspective：卡面图为正视平面构图；主体采用中央轴线或轻微 8°–15° 斜向张力，禁止强透视。
- Playfield focal area：选牌阶段牌堆中心位于屏幕高度 48%–54%；翻牌阶段三牌区占 54%–62%。
- Foreground：金箔碎片、全息层和翻牌边缘。
- Midground：实体牌堆、牌位与关键词。
- Background：近黑羊皮纸、极低对比神经拓扑和少量金粉，不使用持续扫描线。
- HUD safe areas：顶部 `max(16px, env(safe-area-inset-top))`；底部 `max(18px, env(safe-area-inset-bottom))`。
- Attention path：协议标题 → 当前动作提示 → 牌堆／三张牌 → 主要动作 → 解读。

## 3. Color

- Void Vellum：`#090A0D`，整屏背景，约 62%。
- Raised Vellum：`#15151A`，牌背与面板，约 18%。
- Bone Ink：`#EEE8D8`，主文字和蚀刻线，约 10%。
- Ash Text：`#A9A395`，次级文字，约 4%。
- Old Gold：`#C8A55B`，边线、编号和奖励，约 4%。
- Vermilion Note：`#C84E3B`，警示与逆位校注，约 1%。
- Model Cyan：`#65C7C0`，拓扑与当前状态，约 1%。
- Holographic spectrum：只在 3 张特殊牌内出现粉红、黄、青、蓝、紫；常态透明度 0.26–0.30。
- Forbidden combinations：禁止大面积蓝紫渐变；禁止金色外发光；禁止用红绿单独表达正逆位。

## 4. Typography

- Display Latin：`Cormorant Garamond` 或系统 Georgia 回退，用于英文牌名和标题，34–46 px / 600，字距 `0.04em`。
- Chinese display：`Noto Serif SC`、`Songti SC`、`STSong` 回退，28–38 px / 700。
- UI/body：`Inter`、`Noto Sans SC`、系统无衬线，正文 15–17 px / 1.55。
- Protocol labels：`ui-monospace`，10–12 px / 600，字距 `0.12em`，全大写仅用于短标签。
- Card title：中文 16–19 px / 700；英文 12–14 px / 600。
- Reading prose：16 px，窄屏最低 15 px；每段 45–70 个中文字符。
- 数字与罗马编号使用等宽数字，不加发光或描边。

## 5. Shape, material, and lighting

- Dominant shapes：细长 2:3 卡片、尖拱、同心轨道、断裂圆环、8 角星和贝塞尔拓扑线。
- Corner language：卡牌 14 px 圆角；按钮 2–6 px 裁角感圆角，禁止大胶囊。
- Borders：常规 1 px 骨白 22%；焦点 1 px 旧金 + 2 px 外间隙；特殊牌 1 px 冷青/旧金双线。
- Shadows：卡牌使用 `0 16px 38px rgba(0,0,0,.48)`；UI 使用最多 4 px 的硬边阴影。
- Materials：黑羊皮纸、压凹蚀刻、磨损金箔、半透明校注纸、局部棱镜箔。
- Light direction：卡面插画主光从左上 30°；前端高光从右上扫过，与全息层方向区分。

## 6. Characters, environments, and assets

- 卡面不以人物肖像为主；每张牌用一个中央象征场景表达 AI 原型，例如未完成的门、编织数据的手、沉睡的模型种子、循环版本轮。
- 生成风格：精细铜版蚀刻 + 中世纪手抄本金箔 + 极少冷青数据拓扑；不是 3D 渲染，不是照片，不是动漫。
- 中央主体必须在 160 px 宽缩略图下可读；周边纹理密度降低 45%。
- 所有生成图使用 1024×1024 不透明 PNG 源图；运行时按 2:3 卡窗 `object-fit: cover`，主体安全区为中心 62% 宽、84% 高。
- 提示词禁止可读文字、字母、数字、Logo、水印、UI、手机、芯片特写和人形机器人脸。
- 卡背为严格对称构图：中心神经星图、双环蛇形回路、四角金箔节点；不可出现正面牌意。
- 海报为栅格叙事场景：一位匿名占卜者在暗室中面对三张悬浮卡，顶端 25% 预留标题区，底部 20% 不放关键主体。

## 7. UI and icons

- Icon family：自制 24×24 SVG，1.5 px 骨白线，端点为方形；只使用星图、翻牌、重置和信息四种语义。
- Primary button：骨白字、旧金上边线、深黑实底；按下下移 2 px并降低阴影。
- Secondary button：透明底、骨白 28% 边；结果页放在主按钮之后。
- Targets：所有按钮至少 44×44；扇形卡暴露点击区在 320 px 宽时至少 46 px。
- HUD：抽牌进度以 3 个牌位文字和细线表示，不使用普通进度条。
- Default：安静骨白边；Pressed：旧金边收紧；Focus：2 px Bone Ink 外框；Disabled：灰度 70% + 明确文字；Loading：三段装订线依次亮起；Error：朱红校注线 + 文本；Success：旧金封印 + 文本。
- Emoji policy：功能图标禁止使用 Emoji。

## 8. Motion and VFX

- Motion personality：有重量的纸牌、克制的仪式动作、精密但不机械的模型校准。
- Tokens：按下 80 ms；牌堆展开 520 ms；抽牌置顶 260 ms；落位 320 ms；翻转 560 ms；解读淡入 280 ms；页面切换 360 ms。
- 抽牌：卡片先沿原扇面收拢，再向上 18 px，缩至牌位尺寸并落下；不使用弹簧弹跳。
- 翻牌：Y 轴 180° 翻转，中点切面；逆位正面旋转 180°，文字层保持正向排版并明确显示“逆位”。
- 全息：3.8–6.4 秒的卡内光谱位置动画，只用 background-position 和 opacity；不跟随页面滚动。
- 粒子：旧金细条、骨白纸屑、少量棱镜四边形；禁止发光圆球。
- Reduced motion：取消扇面飞行、翻转、震动和碎片位移；120 ms 交叉淡入，静态光谱保留。

## 9. References translated into principles

- Reference：Codrops Baraja。
- Useful principle：实体牌堆通过按层级变化的旋转、位移和变换原点形成可理解的扇形。
- Adaptation：只展示卡背并用于三次真实抽牌；窄屏降低角度和位移，不复制原 Demo UI 与图片。
- Element not to copy：旧 jQuery 外壳、示例插画、网页导航控件。

- Reference：传统三张塔罗牌阵。
- Useful principle：过去／现在／未来提供清楚的叙事顺序，正逆位增加多义性。
- Adaptation：用 AI 当代隐喻替换陈旧决定论，未来位描述“下一次迭代”而非确定预言。
- Element not to copy：健康、财富、爱情的确定性承诺和恐吓式牌义。

- Reference：CSS Holographic Masks。
- Useful principle：低透明度移动光谱能让少数稀有卡产生材质差异。
- Adaptation：只作用于 3 张特殊牌，卡面文字和焦点层始终在其上。
- Element not to copy：原 Demo 图片、遮罩纹理和页面固定背景。

## 10. Anti-patterns

- 禁止全屏赛博蓝紫霓虹、网格地板、扫描线和代码雨。
- 禁止水晶球、星座贴纸、廉价闪粉、New Age 商店式粉紫渐变。
- 禁止厚重 Hearthstone 奇幻框、塑料宝石、卡包抽奖 UI。
- 禁止每张牌都加全息；普通牌必须更安静。
- 禁止 Emoji 功能图标、胶囊按钮、通用玻璃拟态面板。
- 禁止生成图中的文字、Logo、伪 UI、手机、芯片、机器人脸。
- 禁止把综合解读写成绝对预测、人格诊断或专业建议。
- 视觉漂移示例：金色扩张成奢华赌场；冷青扩张成通用黑客界面；手抄本变成泛奇幻 RPG。

## 11. Vertical-slice acceptance

- Entry/start：3 秒内看出“未来塔罗”而非普通聊天工具；主按钮和娱乐性说明清楚。
- Gameplay：牌堆可展开并连续抽取 3 张；390×844 与 320×568 不溢出，牌位和提示不被遮挡。
- High-feedback moment：至少 1 张全息特殊牌翻开时明显高于普通牌，但牌名、方向和关键词仍清楚。
- Completion/end：过去／现在／未来顺序、正逆位、综合神谕、反思问题和再次连接入口完整。
- Narrow mobile：320×568 的可见卡边不低于 46 px，按钮不低于 44 px，正文不低于 15 px，可滚动结果页不误触。
- Visual QA findings and decision：已在真实浏览器完成 `390×844` 与 `320×568`
  的平台内首屏、扇形牌堆、逐张翻牌、全息牌、长用户名、英文界面、结果滚动
  和再次连接检查；同时保留 `390×844` 外部访客栏检查。平台内构图不依赖访客
  栏高度。首轮发现屏幕阅读器标签暴露隐藏牌编号，已改为“扇面第 n 张未知牌”，
  并补充卡牌 Enter/Space 抽取。生成图里的非语言版画边款通过 2:3 中央裁切和
  底部牌名层压住，不让其成为可读信息。全息“开源之星”在窄屏仍能保持牌名、
  正逆位与关键词清楚，最终方向通过。
