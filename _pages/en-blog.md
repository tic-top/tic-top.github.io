---
layout: v2
title: Blog
permalink: /en/blog/
lang: en
translated_url: /blog/
---

<section class="section">
  <div class="container">
    <div class="section-head">
      <h1 class="section-title">Tech Blog</h1>
      <a href="{{ '/blog/' | relative_url }}">中文 &rarr;</a>
    </div>
    <p class="lead small">All posts are shared across both Chinese and English blog pages. Titles are kept in their original language.</p>
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
