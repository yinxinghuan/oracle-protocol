# 《神谕协议》屏幕与状态合同

## Global environment

- Playfield type：响应式 DOM + 固定比例卡面混合。
- Target viewports：390×844、320×568，竖屏；桌面最大 520 px。
- Input methods：Pointer/Touch、Enter/Space、数字键 1/2/3。
- Platform overlays：平台内无访客栏；外部访客栏只作发布可用性检查，不改变主构图。
- Persistent elements：右下角 AlterU 白色水印；顶部短协议标签。

## Screen/state matrix

| State | Player question | Primary focus | Primary action | Recovery |
|---|---|---|---|---|
| Entry | 这是什么、安全吗？ | 标题、主卡和一句承诺 | 开始连接 | 查看娱乐性声明 |
| Shuffling | 牌正在准备吗？ | 收拢并错动的牌堆 | 等待 700ms | 动画降级后直接进入 |
| Choosing 1–3 | 我该选哪张？ | 扇形牌堆与当前牌位 | 点击一张牌 | 资源缺失仍可选 |
| Reveal 1–3 | 这张牌意味着什么？ | 当前翻开的牌 | 翻开下一张 | 降低动效或直接显示 |
| Reading | 三张牌如何连起来？ | 综合神谕 | 再次连接 | 展开完整牌义 |
| Profile fallback | 系统知道我是谁吗？ | 不打断玩法 | 无 | 使用 AlterU 称呼 |
| Asset error | 卡图去哪了？ | 几何占位与牌名 | 继续 | 文字牌义完整保留 |

## Component state matrix

| Component | Default | Pressed | Focus | Disabled | Loading | Success/error |
|---|---|---|---|---|---|---|
| 主按钮 | 深黑+旧金上边 | 下移2px | 骨白2px外框 | 灰度+说明 | 三段装订线 | 金色封印/朱红校注 |
| 牌堆卡 | 卡背+低投影 | 上移4px | 骨白外框 | 饱和度-70% | 不适用 | 抽中后移入牌位 |
| 牌位 | 空轮廓 | 不适用 | 不适用 | 不适用 | 细线脉冲 | 卡背落位 |
| 翻牌卡 | 背面 | 缩放.985 | 骨白外框 | 前序未翻时禁用 | 中点切面 | 正面+关键词 |
| 全息牌 | 静态正面 | 不额外位移 | 双线外框 | 不适用 | 不适用 | 0.34峰值后0.28 |

## HUD contract

- Protected finger area：牌堆主体周围 24 px；选择时不放文字按钮覆盖扇面。
- Stable regions：顶部协议标题；中上动作提示；中部牌堆／牌位；底部主要动作。
- Quiet information：抽取 `1/3`、牌位标签和用户名。
- High emphasis：全息翻开与最终“协议完成”印记。
- Long copy：结果页独立滚动；标题最多两行，玩家名截断到 24 个可见字符。

## Onboarding contract

- First action：点击“开始连接”。
- Demonstration：牌堆自动洗牌并展开，当前提示变成“选一张作为过去”。
- Practice response：首次抽牌立即进入对应牌位并播放纸牌声。
- Dismissal：完成第一次抽牌后不再显示解释性引导。
- Fallback：牌堆下方始终有短标签“从扇面中选择”。

