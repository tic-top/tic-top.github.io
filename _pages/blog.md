---
layout: v2
title: Blog
lang: zh-CN
translated_url: /en/blog/
permalink: /blog/
---

<section class="section">
  <div class="container">
    <div class="section-head">
      <h1 class="section-title">Blog</h1>
      <span class="meta">Technical Notes</span>
    </div>
    <p class="lead small">中英文博客页都会展示同一批文章，标题保持每篇 `_posts/*.md` 的 `title` 原文。</p>
    <div class="post-grid">
      {% for post in site.posts %}
      <a class="post-item" href="{{ post.url | relative_url }}">
        <p class="meta">{{ post.date | date: '%Y-%m-%d' }}</p>
        <h3>{{ post.title }}</h3>
        <p>{{ post.excerpt | strip_html | truncate: 150 }}</p>
        {% if post.tags %}
        <p class="tag-row">{% for t in post.tags %}<span>{{ t }}</span>{% endfor %}</p>
        {% endif %}
      </a>
      {% endfor %}
    </div>
  </div>
</section>
