---
layout: v2
title: Blog
permalink: /blog/
---

<section class="section">
  <div class="container">
    <h1 class="section-title">Blog</h1>
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
