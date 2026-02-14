---
permalink: /en/
layout: v2
title: Home
lang: en
translated_url: /
---

<section class="hero">
  <div class="container hero-center">
    <img src="{{ '/images/1.jpg' | relative_url }}" alt="Yilin Jia" class="avatar" />
    <h1>Hello, I'm <span class="accent">Yilin</span></h1>
    <p class="lead">
      Dual-degree undergrad at UMich CS &times; SJTU ECE. I build things at the intersection of language, vision, and performance — from NLP research to high-speed quant libraries in Rust. I ship papers and I ship code.
    </p>
    <div class="social-bar">
      <a href="https://github.com/tic-top" target="_blank" title="GitHub">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
      </a>
      <a href="https://scholar.google.com/citations?user=mJODFtcAAAAJ&hl=en&oi=ao" target="_blank" title="Google Scholar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/></svg>
      </a>
      <a href="mailto:kirp@umich.edu" title="Email">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
      </a>
    </div>
  </div>
</section>

<section class="section" id="blog">
  <div class="container">
    <div class="section-head">
      <h2 class="section-title">Tech Blog</h2>
      <a href="{{ '/en/blog/' | relative_url }}">View all &rarr;</a>
    </div>
    <div class="blog-grid">
      {% for post in site.posts limit:4 %}
      <a class="blog-card" href="{{ post.url | relative_url }}">
        <div class="blog-card-cover">
          <canvas class="auto-cover" data-seed="{{ post.title }}"></canvas>
        </div>
        <div class="blog-card-body">
          <p class="meta">{{ post.date | date: '%Y-%m-%d' }}</p>
          <h3>{{ post.title }}</h3>
          <p>{{ post.excerpt | strip_html | truncate: 100 }}</p>
          {% if post.tags %}
          <p class="tag-row">{% for t in post.tags %}<span>{{ t }}</span>{% endfor %}</p>
          {% endif %}
        </div>
      </a>
      {% endfor %}
    </div>
  </div>
</section>

<section class="section" id="research">
  <div class="container">
    <h2 class="section-title">Research Projects</h2>
    <div class="project-grid">
      {% for item in site.data.projects %}
      <article class="project-card">
        <div class="project-card-cover">
          <canvas class="auto-cover" data-seed="{{ item.title }}"></canvas>
        </div>
        <div class="project-content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <p class="tag-row">{% for t in item.tags %}<span>{{ t }}</span>{% endfor %}</p>
        </div>
      </article>
      {% endfor %}
    </div>
  </div>
</section>

<section class="section" id="timeline">
  <div class="container panel">
    <h2 class="section-title">Research Experience</h2>
    <div class="timeline">
      <div class="timeline-item">
        <h3>2023 Fall · Lakehouse Research</h3>
        <p>Built a model to predict SQL execution time under different lakehouse settings.<br><span class="meta">Supervisor: Lin Ma · University of Michigan</span></p>
      </div>
      <div class="timeline-item">
        <h3>2023 Summer · NLP Research</h3>
        <p>Evaluated tokenizers and LLMs on PsyQA and other benchmark tasks.<br><span class="meta">Supervisor: Rada Mihalcea · University of Michigan</span></p>
      </div>
      <div class="timeline-item">
        <h3>2021 · Anomaly Sound Detection</h3>
        <p>Trained an anomaly sound detection model and deployed it on RZ/T2 board.<br><span class="meta">Supervisor: Fan Wu · Shanghai Jiao Tong University</span></p>
      </div>
    </div>
  </div>
</section>
