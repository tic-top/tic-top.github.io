---
layout: v2_post
title: 'py-alpha-lib: 用 Rust 重写量化因子库，比 Pandas 快 729 倍'
date: 2026-02-10
permalink: /posts/2026/02/py-alpha-lib/
tags:
  - Rust
  - Python
  - Quant
  - Performance
---

在量化交易中，滚动窗口计算（rolling window）是最基础也是最高频的操作之一——无论是计算移动平均、标准差还是更复杂的 Alpha 因子，每一根 K 线都需要回溯一段历史窗口。然而，当数据量达到百万级别、因子数达到 101 个时，Python + Pandas 的方案就显得力不从心了。

## 为什么要重写

[WorldQuant 101 Alphas](https://arxiv.org/abs/1601.00991) 定义了 101 个经典量化因子，涵盖了 `ts_rank`、`ts_corr`、`stddev`、`decay_linear` 等大量滚动窗口操作。用纯 Pandas 实现这些因子在百万行数据上的计算，即使做了向量化优化，单次回测依然需要等待数十秒。

核心瓶颈在于：
- Pandas 的 `rolling()` 底层仍然是 Python 层面的循环
- 每次调用产生大量临时 DataFrame/Series 对象
- GIL 限制了多核并行

## Rust + PyO3 的方案

[py-alpha-lib](https://github.com/tic-top/py-alpha-lib) 使用 Rust 实现核心的滚动窗口算子，通过 PyO3 暴露为 Python 可调用的接口。

关键设计：
- **零拷贝**：利用 NumPy 的 buffer protocol，Rust 直接读写 Python 侧的数组内存
- **SIMD 友好**：连续内存布局让编译器自动向量化
- **无 GIL**：计算密集部分在 Rust 侧完成，释放 GIL 后可以并行调用

```rust
#[pyfunction]
fn ts_mean(data: PyReadonlyArray1<f64>, window: usize) -> PyResult<Py<PyArray1<f64>>> {
    let input = data.as_slice()?;
    let mut output = vec![f64::NAN; input.len()];
    let mut sum = 0.0;
    for i in 0..input.len() {
        sum += input[i];
        if i >= window {
            sum -= input[i - window];
        }
        if i >= window - 1 {
            output[i] = sum / window as f64;
        }
    }
    // ...
}
```

## 性能对比

在 100 万行数据 × 101 个 Alpha 因子的基准测试中：

| 方案 | 耗时 | 加速比 |
|------|------|--------|
| Pandas (vectorized) | ~72.9s | 1x |
| py-alpha-lib (Rust) | ~0.1s | **729x** |

三个数量级的提升，主要来自：
1. Rust 的零开销抽象消除了 Python 解释器的 overhead
2. 滑动窗口采用增量计算而非每次重算
3. 内存局部性好，CPU cache 命中率高

## 使用方式

```bash
pip install py-alpha-lib
```

```python
import alpha_lib as al
import numpy as np

data = np.random.randn(1_000_000)

# 20 日移动平均
result = al.ts_mean(data, 20)

# 时序排名
rank = al.ts_rank(data, 10)

# 衰减线性加权
decay = al.decay_linear(data, 15)
```

API 设计上保持和 Pandas 的命名习惯一致，迁移成本极低。

## 总结

如果你在做量化策略回测，数据量在十万行以上，强烈建议试试用 Rust 重写热路径。PyO3 让 Rust-Python 互操作变得非常丝滑，而性能提升是实打实的——从"等一分钟"到"眨眼就完"。

项目地址：[github.com/tic-top/py-alpha-lib](https://github.com/tic-top/py-alpha-lib)
