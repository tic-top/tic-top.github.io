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
      <h1 class="section-title">Blog</h1>
      <span class="meta">Technical Notes</span>
    </div>
    <p class="lead small">All posts are shared in both Chinese and English blog indexes. Titles are rendered from each post's original front-matter `title`.</p>
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
