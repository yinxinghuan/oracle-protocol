# 《神谕协议》反馈矩阵

| Event | Player intent | Immediate acknowledgement | Result | Visual/motion | Audio/haptic | Intensity | Recovery/next | Reduced mode |
|---|---|---|---|---|---|---:|---|---|
| 开始连接 | 开启牌阵 | 按钮下压、标题变暗 | 洗牌 | 牌堆短促错位 | 196/392Hz | 2 | 700ms后展开 | 120ms淡入 |
| 选择卡牌 | 抽一张 | 卡边亮金、输入锁 | 卡进入牌位 | 置顶、收拢、落位 | 420→610Hz | 2 | 520ms后再展开 | 直接落位 |
| 普通翻牌 | 看牌义 | 按钮文字切换 | 显示正面 | 560ms Y翻转、金线 | 520/780Hz | 3 | 显示短解 | 交叉淡入 |
| 全息翻牌 | 看稀有牌 | 冷青双边出现 | 显示特殊牌 | 光谱升至.34、8–12碎片 | 四音上行 | 4 | 回落至.28 | 静态光谱 |
| 完成牌阵 | 获取综合解读 | 第三张关键词锁定 | 结果页 | 三牌形成神经星图 | 四音分解和弦 | 4 | 再次连接 | 无位移淡入 |
| 资源失败 | 继续玩法 | 朱红校注线 | 使用占位图 | 无突兀空白 | 146→110Hz | 1 | 文字牌义可用 | 相同 |
| 重玩 | 新一次随机 | 按钮下压 | 清空旧牌阵 | 结果页淡出 | 196Hz短音 | 2 | 回到洗牌 | 直接切换 |

## Timing notes

- Input-to-feedback target：同一帧，目标低于 50ms。
- Anticipation duration：抽牌 80ms；翻牌 120ms。
- Contact/impact frame：抽牌 260ms；翻牌 280ms。
- Peak duration：普通翻牌 180ms；全息 900ms。
- Settle/recovery duration：抽牌总计 520ms；翻牌总计 560ms。
- Async completion：资料接口和图片资源均不阻塞第一层反馈。

## Intensity ladder

1. Routine：按钮、错误占位。
2. Progress：开始、抽牌、重玩。
3. Reveal：普通牌翻开。
4. Rare/completion：全息牌、三牌完成。
5. Critical：本游戏无危险或失败反馈。

## Verification evidence

- Required：普通翻牌与全息翻牌各 1 组前／中／后帧。
- Stress：连续快速点击牌堆不会抽出超过 3 张或破坏顺序。
- Audio-muted：所有状态仍由文字、方向和卡面变化表达。
- Reduced-motion：抽牌与翻牌到达相同最终状态，静态全息仍可读。
- Known exceptions：无 haptic；避免在 WebView 中制造不可控震动。

