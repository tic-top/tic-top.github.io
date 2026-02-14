---
layout: v2_post
title: '我用 Claude Code 升级 py-alpha-lib：把 101 因子跑到 3.6 秒'
date: 2026-02-10
permalink: /posts/2026/02/py-alpha-lib/
tags:
  - Rust
  - Python
  - Quant
  - Performance
  - Claude Code
---

这次不是“从零写个 Rust 库”的故事，而是一次更真实的工程升级：我用 Claude Code，把一个能跑的 Python 因子库，升级成了一个能在百万行数据上稳定、快速、可验证的 Py+Rust 引擎。

目标很直接：

- **正确性**：对齐 Alpha101 数学定义，不靠“看起来像”；
- **性能**：在 4000 股 × 261 日（1,044,000 行）上把全量计算压到秒级；
- **可维护**：DSL、Python wrapper、Rust 内核三层语义一致。

## 升级前的痛点

之前的实现不是不能用，而是到了规模就暴露问题：

- Pandas 参考实现里有公式错误；
- DSL 里有歧义表达（`MAX` 到底是逐点还是窗口？）；
- 跨截面和时序算子对 NaN 的处理口径不一致；
- Python 层存在大量不必要的 dtype copy。

结论是：先别急着吹“快了几百倍”，先把“算得对”这件事做扎实。

## 我怎么和 Claude Code 协作

我把这次升级拆成四段，Claude Code 负责“改代码 + 回归 + 对比 + 记录”，我负责“定义标准 + 决策语义”：

1. **先建对比框架**
   - 三方对比：`pandas / alpha-lib / polars_ta`
   - 指标不只看 `pearson`，还看 `ic_mean`（避免暖窗期误判）
2. **再修定义层问题**
   - 修 DSL 公式歧义、窗口参数缺失、运算优先级
3. **再修内核语义问题**
   - 修 `RANK` NaN 处理、`TS_RANK` 重复值、`SIGNEDPOWER` 定义
4. **最后才做性能优化**
   - Python wrapper 改成 `_to_f64()`，避免 float64 输入重复拷贝
   - Rust 侧统一有效值判断：`!is_nan()`

这个顺序很关键：**正确性没过，所有性能数字都不可信。**

## 结果：101 因子全部支持，75 个可直接和 pandas 对比

Alpha101 正确性总览（来自 `COMPARISON.md`）：

- 完全一致（pearson ≥ 0.99）：47 个
- 高度一致（0.95 ≤ pearson < 0.99）：6 个
- 常量输出无法算相关：6 个
- 暖窗期行为差异（ic_mean ≥ 0.99）：8 个
- Pandas 参考实现 bug：3 个
- `decay_linear` NaN 策略差异：3 个
- 浮点精度边界：1 个
- 数据不足：3 个
- `IndNeutralize` 新增支持：19 个

这组结果最重要的一点不是“完全一致有多少”，而是：
**差异基本都能解释为语义选择、参考实现错误或数值边界，而不是黑盒误差。**

## 几个最有代表性的坑

1. `alpha_038 / 036 / 047`：Pandas 参考实现公式写错了  
2. `TS_RANK`：用 `BTreeMap<value, idx>` 会被重复值覆盖，窗口统计直接漂移  
3. `SIGNEDPOWER(x,p)`：负数底数 + 非整数幂，`np.power` 会 NaN，必须显式 `sign(x)*abs(x)^p`  
4. `Float::is_normal()`：会把 `0.0` 当“无效值”，导致 MA/STDDEV/CORR 误跳过  
5. GTJA191 原始公式文本有歧义，像 `MAX`/`MIN`/`SEQUENCE` 必须做 DSL 层修订

## 性能对比（同一数据集）

测试集：4000 只股票 × 261 个交易日 = 1,044,000 行

| 方案 | 耗时 | 加速比 |
|------|------|--------|
| Pandas（75 因子） | 2,643,373ms（44min） | 1x |
| polars_ta（81 因子） | 58,130ms（58s） | 45x |
| **alpha-lib（101 因子）** | **3,628ms（3.6s）** | **729x** |

含长窗口 `ts_rank` / `correlation` 的因子，常见加速是 **1000x - 7000x**。

GTJA191 这边也跑了一版：

- 191 个因子中 190 个可计算；
- 总耗时约 **4.5 秒**；
- 唯一不可计算的是 #030（需要 Fama-French 三因子数据，数据源缺失）。

## 这次升级给我的三个结论

1. 性能优化是最后一步，先把数学语义和回归基线立住。  
2. AI 写代码最强的场景，不是“替你拍脑袋”，而是“高频修复 + 快速验证 + 全量记录”。  
3. 量化工程里最贵的 bug 往往不是 crash，而是“默默算错一点点”。  

项目地址：  
[https://github.com/tic-top/py-alpha-lib](https://github.com/tic-top/py-alpha-lib)

过程记录（完整对比和修复明细）：  
[https://github.com/tic-top/py-alpha-lib/blob/main/COMPARISON.md](https://github.com/tic-top/py-alpha-lib/blob/main/COMPARISON.md)
