---
permalink: /
layout: v2
title: Home
---

<section class="hero">
  <div class="container hero-center">
    <div class="avatar-wrap">
      <img src="{{ '/images/1.jpg' | relative_url }}" alt="Yilin Jia" class="avatar" />
    </div>
    <div class="status-line">
      <span class="status-dot"></span>
      Open to opportunities
    </div>
    <h1><span data-typing="Hi, I'm Yilin."></span></h1>
    <p class="lead">
      M.S. student in Computer Science at the University of Michigan, following a dual-degree B.S. in CS (UMich) and ECE (SJTU). I like building things with AI.
    </p>
    <div class="skill-badges">
      <span class="skill-badge">Python</span>
      <span class="skill-badge">Rust</span>
      <span class="skill-badge">C/C++</span>
      <span class="skill-badge">PyTorch</span>
      <span class="skill-badge">SQL</span>
      <span class="skill-badge">LaTeX</span>
    </div>
    <div class="social-bar">
      <a href="https://github.com/tic-top" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub">
        <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
      </a>
      <a href="https://scholar.google.com/citations?user=mJODFtcAAAAJ&hl=en&oi=ao" target="_blank" rel="noopener" aria-label="Google Scholar" title="Google Scholar">
        <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/></svg>
      </a>
      <a href="mailto:kirp@umich.edu" aria-label="Email" title="Email">
        <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
      </a>
    </div>
  </div>
</section>

<section class="section fade-in" id="blog">
  <div class="container">
    <div class="section-marker">Latest Posts</div>
    <div class="section-head">
      <h2 class="section-title">Blog</h2>
      <a href="{{ '/blog/' | relative_url }}">View all &rarr;</a>
    </div>
    <div class="blog-grid">
      {% for post in site.posts limit:4 %}
      <a class="blog-card" href="{{ post.url | relative_url }}">
        <div class="blog-card-cover">
          <canvas class="auto-cover" data-seed="{{ post.title | escape }}"></canvas>
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

<section class="section fade-in" id="publications">
  <div class="container">
    <div class="section-marker">Research</div>
    <div class="section-head">
      <h2 class="section-title">Publications</h2>
      <a href="{{ site.author.googlescholar }}" target="_blank">Google Scholar &rarr;</a>
    </div>
    {% for pub in site.publications reversed %}
    <div class="pub-item">
      <h3><a href="{{ pub.paperurl }}" target="_blank">{{ pub.title }}</a></h3>
      <p class="meta">{{ pub.venue }}</p>
      <p>{{ pub.excerpt }}</p>
    </div>
    {% endfor %}
  </div>
</section>

<section class="section fade-in" id="research">
  <div class="container">
    <div class="section-marker">Builds</div>
    <h2 class="section-title">Projects</h2>
    <div class="empty-state">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
      <p class="meta">In progress</p>
      <p>项目页正在整理中,近期会放上几个正在做的东西。</p>
    </div>
  </div>
</section>
