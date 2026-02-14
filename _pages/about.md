---
permalink: /
layout: v2
title: Home
lang: zh-CN
translated_url: /en/
---

<section class="hero">
  <div class="container hero-center">
    <img src="{{ '/images/1.jpg' | relative_url }}" alt="Yilin Jia avatar" class="avatar" />
    <h1>你好，我是 <span class="accent">Yilin</span></h1>
    <p class="lead">
      我是 University of Michigan（CS）与 Shanghai Jiao Tong University（ECE）双学位本科生，
      主要关注自然语言处理与多模态学习。
    </p>
    <p class="lead small">邮箱：kirp@umich.edu · <a href="https://github.com/tic-top">GitHub</a> · <a href="https://scholar.google.com/citations?user=mJODFtcAAAAJ&hl=en&oi=ao">Google Scholar</a></p>
  </div>
</section>

<section class="section" id="projects">
  <div class="container">
    <h2 class="section-title">个人项目</h2>
    <div class="project-grid">
      {% for item in site.data.projects %}
      <article class="project-card">
        <img src="{{ item.image | relative_url }}" alt="{{ item.title }}" />
        <div class="project-content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <p class="tag-row">{% for t in item.tags %}<span>{{ t }}</span>{% endfor %}</p>
          <a href="{{ item.link | relative_url }}">查看详情 →</a>
        </div>
      </article>
      {% endfor %}
    </div>
  </div>
</section>

<section class="section" id="timeline">
  <div class="container panel">
    <h2 class="section-title">时间轴</h2>
    <div class="timeline">
      <div class="timeline-item">
        <h3>2021 · SJTU Research Assistant</h3>
        <p>训练 anomaly sound detection 模型并部署到 RZ/T2 board。</p>
      </div>
      <div class="timeline-item">
        <h3>2023 Summer · UMich Research Assistant</h3>
        <p>在 PsyQA 等任务上评测 tokenizer 与多种 LLM 表现。</p>
      </div>
      <div class="timeline-item">
        <h3>2023 Fall · Lakehouse 系统研究</h3>
        <p>构建模型预测 SQL 执行时延，提升系统调度效率。</p>
      </div>
    </div>
  </div>
</section>

<section class="section" id="tech-blog">
  <div class="container">
    <div class="section-head">
      <h2 class="section-title">技术博客</h2>
      <a href="{{ '/blog/' | relative_url }}">查看全部 →</a>
    </div>
    <div class="post-grid">
      {% for post in site.posts limit:6 %}
      <a class="post-item" href="{{ post.url | relative_url }}">
        <p class="meta">{{ post.date | date: '%Y-%m-%d' }}</p>
        <h3>{{ post.title }}</h3>
        <p>{{ post.excerpt | strip_html | truncate: 110 }}</p>
        {% if post.tags %}
        <p class="tag-row">{% for t in post.tags %}<span>{{ t }}</span>{% endfor %}</p>
        {% endif %}
      </a>
      {% endfor %}
    </div>
    <p class="meta">后续你新增的文章（_posts/*.md）会自动出现在这里。</p>
  </div>
</section>
