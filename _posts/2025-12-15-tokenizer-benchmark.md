---
layout: v2_post
title: '中文心理问答场景下的 Tokenizer 选型实验'
date: 2025-12-15
permalink: /posts/2025/12/tokenizer-benchmark/
tags:
  - NLP
  - Tokenizer
  - LLM
---

在做中文心理健康问答（PsyQA）相关的研究时，我们发现不同 tokenizer 对下游任务的影响远超预期。这篇文章记录了我们对多种 tokenizer 在中文心理咨询文本上的评测结果。

## 背景

心理咨询场景的文本有几个特点：
- 口语化表达多，句子长度不固定
- 包含大量情感词汇和隐喻
- 中英混杂（专业术语）

这些特点对 tokenizer 的分词粒度和词表覆盖率提出了挑战。

## 评测维度

我们从三个维度比较了不同 tokenizer 的表现：

1. **序列长度效率**：同一段文本编码后的 token 数量
2. **语义完整性**：关键词是否被合理切分
3. **下游任务性能**：在问答匹配任务上的准确率

## 实验对象

| Tokenizer | 词表大小 | 类型 |
|-----------|---------|------|
| BERT-base-chinese | 21K | WordPiece |
| ChatGLM | 65K | SentencePiece |
| Llama 2 | 32K | BPE |
| Qwen | 152K | BPE |
| Baichuan 2 | 64K | BPE |

## 关键发现

**序列长度**：Qwen 的大词表在中文文本上有明显优势，平均 token 数比 Llama 2 少 42%。这意味着在相同上下文窗口下，Qwen 能处理更长的咨询对话。

**语义完整性**：以"焦虑症"为例，BERT 会切分为 `["焦", "虑", "症"]`，而 Qwen 保持为 `["焦虑症"]` 一个 token。对于心理学专业术语，大词表的优势非常明显。

**下游任务**：在 PsyQA 问答匹配任务上，Qwen tokenizer + 微调后的效果最好，比 BERT tokenizer 方案高出 3.7 个百分点。

## 结论

对于中文专业领域的 NLP 任务，tokenizer 的选择不应该被忽视。词表大小和训练语料的覆盖范围直接影响模型的天花板。在心理咨询场景中，我们推荐使用词表较大且中文优化过的 tokenizer，如 Qwen 或 ChatGLM 系列。
