---
title: This Website
summary: A read-only static site built with Astro to showcase my projects and hobbies.
date: 2026-07-19
links:
  - label: Astro
    url: https://astro.build
tags: [astro, aws, static-site]
---

The site you're looking at right now. It's a fully static site generated with
Astro — every project and hobby is a markdown file, and the build turns them
into listing cards and detail pages automatically.

## Design goals

- Read-only, no server-side logic
- Cheap to host: builds to plain files destined for S3 + CloudFront
- Adding content is just dropping a markdown file into a folder
