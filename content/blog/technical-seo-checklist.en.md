---
title: >-
  Technical SEO Checklist: The Foundations That Help Search Engines Understand
  Your Site
description: >-
  A practical technical SEO checklist covering crawlability, indexing, speed,
  and structured data for SMBs.
excerpt: The technical groundwork that lets search engines read and rank your site.
date: '2026-06-25'
category: SEO & Growth
keywords:
  - technical SEO
  - technisches SEO
  - SEO checklist
  - crawlability
  - structured data
  - site speed
  - indexing
graphic: load-waterfall
---
Most conversations about SEO start with content and keywords, and those things matter. But before any of that work pays off, search engines need to be able to find, read, and understand your site in the first place. That is what technical SEO is about: making sure the infrastructure underneath your content is clean, consistent, and machine-readable. It is not glamorous work, but it is the layer everything else rests on.

## Crawlability: Can Search Engines Actually Get In?

Search engines discover pages by following links, guided by a file called `robots.txt` and, for larger sites, an XML sitemap. If either of these is misconfigured, whole sections of a site can become invisible to crawlers without any obvious sign that something is wrong. A common mistake is blocking a staging environment during development and then forgetting to update those rules before launch. The result is a live site that search engines are politely told to ignore.

A basic crawl audit (using a tool like Screaming Frog or Google Search Console's coverage report) will surface pages that return errors, redirect chains that are longer than they should be, and URLs that are accidentally excluded from indexing.

## Indexing: What Gets Stored, and How

Crawlability and indexability are related but distinct. A page can be crawlable and still be excluded from the index: intentionally, via a `noindex` tag, or accidentally, because of duplicate content that confuses the search engine about which version to store.

Canonical tags (`<link rel="canonical" ...>`) are the standard way to tell search engines which URL is the authoritative version of a page. Without them, a single piece of content might be indexed under several slightly different URLs (with query parameters, trailing slashes, or HTTP versus HTTPS variants), splitting whatever authority the page has earned across multiple copies.

## Page Speed and Core Web Vitals

Google uses a set of user-experience signals called Core Web Vitals as part of its ranking criteria. The three that matter most are Largest Contentful Paint (how fast the main content loads), Interaction to Next Paint (how quickly the page responds to input), and Cumulative Layout Shift (how stable the page is while loading).

These are measurable with PageSpeed Insights or the Chrome User Experience Report. Common culprits for poor scores include unoptimised images, render-blocking scripts, and web fonts loaded without a fallback strategy. Fixing them is technical work — adjusting build configurations, implementing lazy loading, choosing appropriate image formats — but the results benefit real users just as much as search engines.

## Structured Data: Giving Context to Content

HTML tells a browser what to display. Structured data tells a search engine what something *means*. Using schema.org vocabulary (typically written as JSON-LD in the `<head>` of a page), you can mark up a business's address, a product's name and availability, an article's author and publication date, and more.

A concrete example: a local service business that adds `LocalBusiness` schema with accurate name, address, phone, and opening hours gives search engines the information they need to display that business correctly in local results and knowledge panels, without the search engine having to guess from unstructured text on the page.

Structured data is not a ranking shortcut. It is a communication layer. It helps search engines be confident about what they are indexing, which in turn makes the index more accurate.

## HTTPS, Mobile, and the Basics That Still Trip Sites Up

A few fundamentals are worth naming plainly because they still cause problems in practice. HTTPS is expected: a site served over plain HTTP will be flagged as not secure in most browsers, and search engines treat it as a signal of lower trustworthiness. Mobile-friendliness matters because Google predominantly uses the mobile version of a page for indexing. And a clear, consistent URL structure (without unnecessary parameters, session IDs, or duplicate paths) makes a site easier to crawl and easier to understand.

None of these are advanced topics. They are baseline requirements, and they are worth checking before investing heavily in content or link building.

Technical SEO is not a one-time task. Sites change — new pages are added, templates are updated, third-party scripts are introduced — and each change can affect how search engines interpret the site. Treating it as an ongoing discipline rather than a launch checklist is what keeps a site in good standing over time. If you would like to understand where your site currently stands, the [SEO & Growth overview](/en/seo) covers how this work fits into a broader context, or you are welcome to [get in touch](/en/contact) to talk through what a technical review might look like for your specific setup.
