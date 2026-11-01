---
title: GEO Case Study: How Webflow Grew AI Search Signups From 2% to 10%
description: A sourced breakdown of Webflow's generative engine optimization (AEO) programme, covering the tests it ran, the page changes, the Reddit strategy, how it measures AI visibility and what didn't work.
slug: webflow-geo-case-study
date: 2026-11-01
category: AI Visibility
author: Growth Loop
related: geo, ai-readiness-tool, b2b
---

:::tldr
- **Result:** AI search went from **2% of Webflow's new signups in October 2024 to 8% in June 2025**, and about **10% by November 2025**, up 4x year on year.
- **Conversion:** visitors from ChatGPT convert at **24%**, about **6x** the rate of Google or non-brand SEO traffic.
- **Biggest measured win:** headers rewritten as questions lifted AI visits **58%** in a controlled test, and restructured tables of contents showed **+60%** in a second test.
- **Also worked:** answer-first copy on 1,500 template pages, content refreshes five times faster, and helpful, non-promotional Reddit replies.
- **What didn't:** Webflow tested **llms.txt** and saw no significant lift.
- **How they measure it:** visibility (how often AI cites Webflow), comprehension (whether AI describes Webflow correctly) and conversion (signups), each checked on its own schedule.
:::

Most GEO case studies are about anonymous clients and tiny baselines. Webflow is different. It's a well-known SaaS company with about 300,000 customers, and it has published its own numbers. Its SEO partner has published the controlled tests behind them, and its VP of Growth has explained how the team measures the results.

That makes it the most useful **generative engine optimization case study** available for a B2B founder. It shows what moved AI visibility, by how much, and what turned out to be a waste of time.

**Sources, and how much to trust them.** Two of the four sources are Webflow itself:
- A [post by Webflow's AEO/SEO lead Vivian Hoang](https://webflow.com/blog/inside-aeo-strategy).
- An [interview with VP of Growth Josh Grant](https://www.growthunhinged.com/p/traffic-is-no-longer-reliable) on Growth Unhinged.

The other two are case studies by vendors Webflow pays, so we label those figures as vendor-reported:
- [Graphite](https://graphite.io/five-percent/case-studies/webflow-llm-signups), its SEO agency.
- [AirOps](https://www.airops.com/blog/webflow-case-study), its content tool.

## The results: AI search grew from 2% to 10% of signups

| When | AI's share of new Webflow signups | Source |
|---|---|---|
| October 2024 | 2% | Webflow blog |
| June 2025 | 8% ("AI search signups grew 4x in six months") | Webflow blog |
| November 2025 | ~10%, up 4x year on year | Josh Grant, Growth Unhinged |

The quality of that traffic matters as much as the volume. Josh Grant reports:
- **ChatGPT traffic converts at 24%**, about 6x Google. Graphite gives the comparison as 24% against 4% for non-brand SEO.
- **Two in three LLM-referred conversions happen within seven days.**
- **AI chatbots drive about two in five non-brand organic signups.**
- **ChatGPT sends 91% of Webflow's LLM referrals.** Perplexity sends 4%, Copilot 2%, Gemini 2% and Claude 1%.

Grant also describes what this does to traffic: "A lot of our lower value and lower intent traffic has gone down, but there's higher quality traffic occurring even as the aggregate declines." In other words, total traffic can fall while signups rise.

## Webflow's two-part AEO strategy

In its own words, Webflow's approach has [two objectives](https://webflow.com/blog/inside-aeo-strategy): **increase earned visibility** (what others say about Webflow) and **optimize owned content** (Webflow's own pages).

The team doesn't treat this as a new discipline. Grant calls AEO "the next evolution of it and it's an extension of good SEO." Hoang lists the content principles, and almost all of them are classic SEO pointed at a new reader:
- Deliver meaningful content and avoid fluff.
- Answer search intent quickly and clearly.
- Structure headlines, sections and formats so machines can parse them.
- Break content into concise questions that match how people search.
- Provide original value: data, examples and frameworks.

Here is what that looked like in practice.

## Tactic 1: Rewrite blog headers as questions (+58% AI visits)

**What changed.** Graphite rewrote blog headers into the questions people actually type into AI chat. For example, "Benefits of a headless CMS" might become "What are the benefits of a headless CMS?"

**How it was tested.** 10 test URLs were compared against 10 control URLs over four weeks.

**Result (vendor-reported).** Average AI visits on the test pages rose from 41 to 70. After adjusting for the control group, Graphite reports a **58% uplift (p = 0.001)**.

**Why it likely works.** AI assistants answer questions. A section whose heading *is* the question, with the answer directly under it, is an easy passage for a model to find, quote and cite.

## Tactic 2: Turn the table of contents into a list of sub-questions (+60%)

**What changed.** Graphite restructured each article's table of contents to show the sub-questions it answers.

**How it was tested.** 10 test URLs against 10 controls, again over four weeks.

**Result (vendor-reported).** A **60% control-adjusted uplift in AI visits (p = 0.002)**, plus a 23% control-adjusted lift in clicks.

**Read with care.** On the test pages alone, the raw AI visits barely moved (119 to 127). Most of the reported effect comes from how the control pages performed. Treat this one as promising but less certain than the header test.

## Tactic 3: Put a direct answer above the fold on 1,500 template pages

**What changed.** Webflow's template pages previously had nothing above the fold but an H1. Graphite researched the questions people ask AI assistants about templates, picked **1,500 template pages**, and gave each one unique copy above the fold built from four parts:
1. The question the searcher has, e.g. *real estate website templates*.
2. A branded money term, e.g. *in Webflow*.
3. The specific user, e.g. *agents and realty firms*.
4. The pain point or outcome, e.g. *connecting buyers with listings*.

**Result (vendor-reported).** LLM signups from these pages rose from **168 in Q1 2025 to 983 in Q2 2025**.

**Caveat.** There was no control group, and AI traffic was rising everywhere in that period. Graphite's own clients averaged 100–300% LLM traffic growth from January to July 2025. The change helped, but the 485% jump isn't all down to the copy.

**The lesson for founders.** Every high-intent page (templates, integrations, use cases, pricing) should answer, in its first two sentences, who it's for, what it does and why it's the right choice. If it doesn't, an AI model has nothing to quote.

## Tactic 4: Target long-tail questions instead of head terms

**What changed.** Graphite built a blog page around **10 longer questions**. Each one combined a head question with a team type and an integration tool, which is how people actually phrase prompts. "What's the best CMS?" becomes "What's the best CMS for a marketing team that uses HubSpot?"

**Result (vendor-reported).** Share of voice rose for 70% of those questions within about three weeks of publishing. For one question it went from 38% to 100%.

**Why it matters.** Prompts are longer and more specific than Google searches. Pages that match the full prompt, not just the keyword, get cited.

## Tactic 5: Refresh content five times faster

**What changed.** Webflow's blog has over 1,000 articles. Hoang [writes](https://webflow.com/blog/inside-aeo-strategy) that each refresh used to take keyword research, competitor analysis, writing, editing and manual CMS updates, so the team could update only about four articles a month.

The team automated those steps with an AI workflow, built on AirOps, that:
- Researches keywords and competitors.
- Drafts improvements in Webflow's brand voice.
- Routes every change through human editorial review.
- Publishes straight to the CMS.

**Result (company-reported).** Five times more refreshes than before, going from under 50 articles a year to dozens every month. Hoang reports "a 40% uplift in total organic traffic for updated content" within days.

**Why it matters for AI search.** Grant notes that "every query is a fresh model run that reshuffles sources in real time based on context, trust, and recency." Stale pages lose citations to newer ones.

## Tactic 6: Earn mentions on Reddit and YouTube by being helpful

**The research behind it.** Graphite analysed AI citations across 100 priority queries:
- Reddit was a top-five cited source, appearing in about **10% of ChatGPT citations**.
- YouTube appeared in about **5% of ChatGPT** and **32% of Perplexity** responses.

Hoang's post names the same targets: "tech publications, Reddit, YouTube, and industry sites."

**What they did.**
- Built a workflow to monitor relevant threads.
- Posted helpful, non-promotional replies. As Grant puts it, "We focus on adding value, not dropping links."
- Used Reddit as research too, mining threads for competitive sentiment and churn signals.

**Result (vendor-reported).**
- 98% of Webflow's engagements got positive or neutral responses.
- Year on year, r/Webflow views grew 135%, and posts and comments grew 145%.

**Why it matters.** This matches outside research. Ahrefs found branded web mentions correlate far more strongly with AI Overview visibility than backlinks do: 0.664 against 0.218 across 75,000 brands ([Ahrefs](https://ahrefs.com/blog/ai-overview-brand-correlation/)).

:::cta Check my site free | /ai-readiness-tool.html
Before any of this works, AI crawlers have to be able to read your pages. Check yours in a minute.
:::

## What didn't work: llms.txt

Webflow tested an llms.txt file, a proposed standard for pointing AI models at your key content, and **saw no significant lift**. The team moved its effort to content optimization instead.

This matches what Google has said publicly. No special AI files are needed for AI Overviews or AI Mode, and an indexed page that is eligible to show a snippet can be cited. We cover this in our guide to [getting your brand cited in ChatGPT and AI search](/blog/get-cited-in-chatgpt-ai-search). If you're short on time, llms.txt is the one item on most GEO checklists you can safely skip.

## How Webflow measures AI visibility

AI referrals are easy to undercount: many arrive without a referrer, and you can't see the prompts. Webflow tracks three layers, each checked at a different cadence ([Growth Unhinged](https://www.growthunhinged.com/p/traffic-is-no-longer-reliable)):

| Layer | Question it answers | How often | How |
|---|---|---|---|
| Visibility | How often are we cited, where, and in which content types? | A few times a week | Profound, an AI visibility tracker |
| Comprehension | Do AI models describe Webflow accurately compared with competitors? | Weekly | The same prompts run side by side in several LLMs |
| Conversion | Do AI visitors sign up and become customers, and how fast? | Daily | Signups, new business customers and time to convert from LLM traffic |

Comprehension is the layer most teams skip. Grant explains why it matters: "If the narrative is off, it tells us where we need to improve structure or trust signals." Being mentioned with the wrong positioning or out-of-date pricing can cost you the sale.

## How to apply Webflow's playbook to your B2B company

You don't need 1,500 template pages or a dedicated SEO agency. Here are the same moves at founder scale, in order:

1. **Set up measurement first.** Write 30–50 long-tail prompts your buyers really ask, like "best [category] for a [team type] using [tool]". Record who AI assistants name today and whether they describe you correctly, and add "AI assistant (ChatGPT, Perplexity…)" to your "How did you hear about us?" field.
2. **Make sure crawlers can read you.** Check that your robots.txt and CDN aren't blocking AI crawlers, and that key pages render without JavaScript. Our [free AI readiness checker](/ai-readiness-tool.html) tests both.
3. **Rewrite headers as questions on your top 20 pages.** This is Webflow's best-supported result, and an afternoon's work.
4. **Add answer-first copy to every high-intent page.** Use Webflow's four parts: the question, your brand, the specific user, and the outcome.
5. **Write pages for long-tail prompts.** Combine your category with team types, use cases and the tools buyers already use.
6. **Refresh on a schedule.** Prioritise pages that drive signups or that AI already cites, and use AI to draft updates with a human approving each one.
7. **Show up where AI looks.** Answer real questions in the subreddits, YouTube comments and publications your buyers use, as a named person, without dropping links.
8. **Skip llms.txt** until there's evidence it does something.

Webflow's AI share of signups took about six months to go from 2% to 8%. The formatting tests showed results within four weeks, while the community and reputation work compounds more slowly.

:::cta Book a call | https://calendly.com/prabal-growthloopconsulting/30min
Want this run for your company? We set up prompt tracking, rebuild the pages and run the community work.
:::

## Frequently asked questions

### How much of Webflow's signups come from AI search?

About 10% as of November 2025, according to VP of Growth Josh Grant, up 4x year on year. Webflow's own blog reported 2% in October 2024 and 8% in June 2025.

### Does AI search traffic convert better than Google?

At Webflow it does. ChatGPT traffic converts at 24%, about 6x Google and non-brand SEO traffic, and two in three LLM-referred conversions happen within seven days.

### What GEO tactic had the biggest measured impact at Webflow?

Rewriting blog headers as questions. In a controlled test of 10 pages against 10 control pages, AI visits rose 58% over four weeks (p = 0.001). Restructuring tables of contents into sub-questions showed a 60% control-adjusted lift.

### Did llms.txt help Webflow's AI visibility?

No. Webflow tested llms.txt and saw no significant lift, so it focused on content optimization instead.

### What tools does Webflow use for AEO?

Webflow uses Profound to track AI visibility and citations, AirOps to automate content refreshes with human review, Gumloop to mine Reddit for sentiment, and Graphite as its SEO and AEO partner.

### Is GEO different from SEO?

Webflow treats it as an extension of SEO, not a replacement. The same fundamentals apply, including clear structure, quality content, a fast site and brand authority. What's added is attention to question-shaped content, long-tail prompts and mentions on sites AI engines cite.

## Sources

<ul class="st-sources">
<li>Webflow, <a href="https://webflow.com/blog/inside-aeo-strategy" target="_blank" rel="noopener">How we're optimizing for AI search at Webflow (and what we've learned so far)</a>, Vivian Hoang, June 2025</li>
<li>Growth Unhinged, <a href="https://www.growthunhinged.com/p/traffic-is-no-longer-reliable" target="_blank" rel="noopener">Traffic is no longer a reliable growth metric</a> (interview with Webflow's Josh Grant), November 2025</li>
<li>Graphite, <a href="https://graphite.io/five-percent/case-studies/webflow-llm-signups" target="_blank" rel="noopener">Webflow LLM signups case study</a>, January 2026</li>
<li>AirOps, <a href="https://www.airops.com/blog/webflow-case-study" target="_blank" rel="noopener">Webflow customer story</a>, 2026</li>
<li>Ahrefs, <a href="https://ahrefs.com/blog/ai-overview-brand-correlation/" target="_blank" rel="noopener">An Analysis of AI Overview Brand Visibility Factors (75K Brands Studied)</a>, May 2025</li>
<li>Google Search Central, <a href="https://developers.google.com/search/docs/appearance/ai-features" target="_blank" rel="noopener">AI features and your website</a></li>
</ul>
