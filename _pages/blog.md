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
      <h1 class="section-title">技术博客</h1>
      <a href="{{ '/en/blog/' | relative_url }}">English &rarr;</a>
    </div>
    <p class="lead small">中英文博客共享同一批文章，标题保持原文。</p>
    <div class="blog-grid">
      {% for post in site.posts %}
      <a class="blog-card" href="{{ post.url | relative_url }}">
        <div class="blog-card-cover">
          <canvas class="auto-cover" data-seed="{{ post.title }}"></canvas>
        </div>
        <div class="blog-card-body">
          <p class="meta">{{ post.date | date: '%Y-%m-%d' }}</p>
          <h3>{{ post.title }}</h3>
          <p>{{ post.excerpt | strip_html | truncate: 120 }}</p>
          {% if post.tags %}
          <p class="tag-row">{% for t in post.tags %}<span>{{ t }}</span>{% endfor %}</p>
          {% endif %}
        </div>
      </a>
      {% endfor %}
    </div>
  </div>
</section>
