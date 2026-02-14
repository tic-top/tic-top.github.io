---
permalink: /en/
layout: v2
title: Home
lang: en
translated_url: /
---

<section class="hero">
  <div class="container hero-center">
    <img src="{{ '/images/1.jpg' | relative_url }}" alt="Yilin Jia avatar" class="avatar" />
    <h1>Hello, I'm <span class="accent">Yilin</span></h1>
    <p class="lead">
      I’m an undergraduate in a dual-degree program between the University of Michigan (CS) and Shanghai Jiao Tong University (ECE), focusing on NLP and multimodal learning.
    </p>
    <p class="lead small">Email: kirp@umich.edu · <a href="https://github.com/tic-top">GitHub</a> · <a href="https://scholar.google.com/citations?user=mJODFtcAAAAJ&hl=en&oi=ao">Google Scholar</a></p>
  </div>
</section>

<section class="section" id="projects">
  <div class="container">
    <h2 class="section-title">Projects</h2>
    <div class="project-grid">
      {% for item in site.data.projects %}
      <article class="project-card">
        <img src="{{ item.image | relative_url }}" alt="{{ item.title }}" />
        <div class="project-content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <p class="tag-row">{% for t in item.tags %}<span>{{ t }}</span>{% endfor %}</p>
          <a href="{{ item.link | relative_url }}">Details →</a>
        </div>
      </article>
      {% endfor %}
    </div>
  </div>
</section>

<section class="section" id="timeline">
  <div class="container panel">
    <h2 class="section-title">Timeline</h2>
    <div class="timeline">
      <div class="timeline-item"><h3>2021 · SJTU Research Assistant</h3><p>Trained an anomaly sound detection model and deployed it on RZ/T2 board.</p></div>
      <div class="timeline-item"><h3>2023 Summer · UMich Research Assistant</h3><p>Evaluated tokenizers and LLMs on PsyQA and other benchmark tasks.</p></div>
      <div class="timeline-item"><h3>2023 Fall · Lakehouse Research</h3><p>Built a model to predict SQL execution time under different lakehouse settings.</p></div>
    </div>
  </div>
</section>

<section class="section" id="tech-blog">
  <div class="container">
    <div class="section-head">
      <h2 class="section-title">Tech Blog</h2>
      <a href="{{ '/en/blog/' | relative_url }}">View all →</a>
    </div>
    <div class="post-grid">
      {% for post in site.posts limit:6 %}
      <a class="post-item" href="{{ post.url | relative_url }}">
        <p class="meta">{{ post.date | date: '%Y-%m-%d' }}</p>
        <h3>{{ post.title }}</h3>
        <p>{{ post.excerpt | strip_html | truncate: 110 }}</p>
      </a>
      {% endfor %}
    </div>
  </div>
</section>
