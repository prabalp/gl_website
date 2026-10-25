---
title: How to Get Your Brand Cited in ChatGPT, Perplexity and Google AI Overviews
description: The questions founders actually ask about showing up in AI answers, answered with what OpenAI, Google and Perplexity document, and what the research shows.
slug: get-cited-in-chatgpt-ai-search
date: 2026-10-25
category: AI Visibility
author: Growth Loop
related: geo, ai-readiness-tool, inbound
---

:::tldr
- AI assistants can only cite pages their crawlers can reach. Check that your robots.txt and CDN aren't silently blocking **OAI-SearchBot**, **PerplexityBot** or **Googlebot**.
- Search and training are separate switches. You can block AI training and still appear in ChatGPT search.
- For Google's AI Overviews and AI Mode there is no special trick: Google says an indexed page that can show a snippet is eligible. Classic SEO still does the heavy lifting.
- Content that cites sources, quotes experts and includes concrete numbers was cited more often in the main academic study of this, by up to 40%.
- The strongest correlate of AI visibility in Ahrefs' 75,000-brand study was how often your brand is **mentioned around the web**, well ahead of backlinks.
:::

Buyers increasingly ask an AI assistant before they ever visit a website: *"What's the best agency for X?"*, *"Which tool should a 20-person team use for Y?"*. If your brand isn't in that answer, a competitor's is.

This guide answers the questions we hear most from founders and marketing leads, using what the AI companies themselves document and what the research actually measured. Where the evidence is thin, we say so.

## Can I pay to appear in ChatGPT's answers?

No, not in the organic answer. There is no programme that buys a mention inside ChatGPT's, Perplexity's or Google's AI-written response.

ChatGPT does now carry ads. OpenAI runs a separate crawler, OAI-AdsBot, that only visits "pages submitted as ads" ([OpenAI](https://developers.openai.com/docs/bots)). Those are labelled placements next to the answer, not citations within it. Being *recommended* in the answer itself is earned the same way trust is earned elsewhere: by being findable, credible and widely referenced.

## How do ChatGPT, Perplexity and Google decide what to cite?

There are two different routes into an AI answer, and they need different work:

| Route | How it works | How fast it changes |
|---|---|---|
| **Training data** | What the model learned during training, from a snapshot of the web | Slow: months, tied to model releases |
| **Live retrieval** | The assistant searches the web at question time and cites the pages it reads | Fast: as soon as your page is crawled and ranks |

For a business trying to be recommended, **live retrieval is where most of the opportunity is**. When ChatGPT search, Perplexity or Google AI Overviews show a source link, that link came from retrieval. To be retrieved you need two things: the AI company's search crawler must be allowed to read your site, and your page must be a strong answer to the question being asked.

## Is my website blocking AI assistants without me knowing?

This is the most common problem we find, and it's invisible from the outside. Three places can block AI crawlers:

1. **Your robots.txt file.** A blanket `Disallow` added years ago, or a security plugin's defaults, can shut out new crawlers.
2. **Your CDN or firewall.** In July 2025 Cloudflare began [blocking AI crawlers by default](https://searchengineland.com/cloudflare-to-block-ai-crawlers-by-default-with-new-pay-per-crawl-initiative-457708) for new domains. If your site sits behind Cloudflare, check the AI crawler settings rather than assuming.
3. **Content hidden behind JavaScript.** If your key text only appears after scripts run, some crawlers see an empty page. Google's own guidance is to keep important content in text form ([Google Search Central](https://developers.google.com/search/docs/appearance/ai-features)).

:::cta Check my site free | /ai-readiness-tool.html
Not sure which applies to you? Our free AI Readiness Checker tests your site the way AI crawlers see it, including robots.txt rules and firewall blocks, in about 30 seconds.
:::

## Should I block GPTBot? Will that remove me from ChatGPT?

Blocking GPTBot does **not** remove you from ChatGPT search. OpenAI runs separate crawlers for separate jobs, and documents that "each setting is independent of the others" ([OpenAI](https://developers.openai.com/docs/bots)):

| Crawler | Company | What it's for | If you block it |
|---|---|---|---|
| `OAI-SearchBot` | OpenAI | Showing sites in ChatGPT search answers | You won't be shown in ChatGPT search answers |
| `GPTBot` | OpenAI | Crawling content that may train future models | Signals your content shouldn't be used for training |
| `ChatGPT-User` | OpenAI | Fetching a page when a user asks ChatGPT to | OpenAI says robots.txt "may not apply", because a person asked |
| `PerplexityBot` | Perplexity | Surfacing and linking sites in Perplexity search; not used for training | You lose Perplexity search visibility ([Perplexity](https://docs.perplexity.ai/guides/bots)) |
| `Googlebot` | Google | Google Search, including AI Overviews and AI Mode | You disappear from Google Search entirely |
| `Google-Extended` | Google | Limits use in AI training and grounding in "some of Google's other systems" | No effect on Google Search ranking ([Google](https://developers.google.com/search/docs/appearance/ai-features)) |

So a business that wants to be recommended but not used for training can allow the search crawlers and block the training one:

```
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: GPTBot
Disallow: /
```

Changes aren't instant: OpenAI says it can take about 24 hours for robots.txt updates to apply to search, and Perplexity says "up to 24 hours".

## Do I need an llms.txt file?

It's optional, and you shouldn't expect it to change your visibility. llms.txt is a proposed plain-text map of your site for AI systems. In June 2025 Google's John Mueller said that ["no AI system currently uses llms.txt"](https://seroundtable.com/google-ai-llms-txt-39607.html), and Google's own guidance for AI Overviews says you "don't need to create new machine readable files, AI text files, or markup" to appear ([Google](https://developers.google.com/search/docs/appearance/ai-features)).

It costs little to add one (we have [ours](/llms.txt)), but spend your time on crawl access, content and reputation first.

## Does SEO still matter if people ask AI instead of Google?

Yes, and for Google's AI features it's the entry ticket. Google states there are "no additional requirements to appear in AI Overviews or AI Mode": a page needs to be indexed and eligible to be shown in Google Search with a snippet ([Google](https://developers.google.com/search/docs/appearance/ai-features)). The same page lists the classic fundamentals: allow crawling, link to important pages internally, keep content in text, and make sure structured data matches what's visible on the page.

Rankings and AI citations also overlap heavily. In a July 2025 study of 1.9 million citations, [Ahrefs found](https://ahrefs.com/blog/search-rankings-ai-citations) that 76.1% of pages cited in AI Overviews also ranked in Google's top 10 for that query. Other studies with different methods report lower overlap, so treat the exact number loosely, but the direction is consistent: pages that rank well get cited more.

> Good SEO doesn't guarantee AI citations, but weak SEO makes them much less likely. Fix the foundations first.

## What kind of content actually gets cited?

The most rigorous evidence comes from [*GEO: Generative Engine Optimization*](https://arxiv.org/abs/2311.09735), a peer-reviewed paper accepted at the KDD 2024 conference. They tested how rewriting content changed its visibility in AI-generated answers across a benchmark of queries, and found that the right changes can boost visibility by **up to 40%**. The methods that worked best added **citations to credible sources, quotations, and statistics**. Traditional keyword stuffing did not help.

In practice that means writing pages an AI can confidently lift a passage from:

- **Answer first.** Put a direct, one- or two-sentence answer at the top of each section, then explain.
- **Use the question as the heading.** Phrase headings the way buyers ask ("How much does X cost?"), not as clever slogans.
- **Be specific.** Real numbers, named methods, dates and concrete examples beat general claims.
- **Show your sources.** Link to primary research, documentation or your own data.
- **Add what only you know.** Original data, client lessons and expert opinion are the hardest things for AI to find elsewhere, and the most likely to be cited.
- **Keep it current.** Show a "last updated" date and refresh important pages.

## Why do competitors get mentioned and I don't?

Usually because the web talks about them more. Ahrefs studied 75,000 brands to see what correlates with being mentioned in Google's AI Overviews ([Ahrefs](https://ahrefs.com/blog/ai-overview-brand-correlation/)):

| Factor | Correlation with AI Overview mentions |
|---|---|
| Branded web mentions | 0.664 |
| Branded anchor text | 0.527 |
| Branded search volume | 0.392 |
| Domain Rating | 0.326 |
| Number of backlinks | 0.218 |

Ahrefs is clear that correlation isn't causation, but the pattern makes sense: AI systems summarise what many sources say. If industry lists, reviews, podcasts, forums and partner pages consistently describe you as a leader in your niche, the AI answer will tend to say so too.

Practical ways to earn those mentions:

- Get included in the "best X for Y" roundups your buyers read, and in relevant directories and review sites.
- Answer questions genuinely in the communities where your buyers ask them, such as Reddit and industry forums, without pitching.
- Publish original data that others want to quote.
- Appear on podcasts, webinars and partner content in your niche.
- Keep your company description consistent everywhere (LinkedIn, directories, your own site), so every source tells the same story.

## How long does it take to show up in AI answers?

It depends on which route you're working on. Crawler access changes apply within about a day for OpenAI and Perplexity. New or improved pages can be cited as soon as they're crawled and competitive for the question, which is often weeks. Reputation-driven visibility, where AI tools recommend you because the wider web does, typically builds over months.

Be wary of anyone promising guaranteed citations: AI answers vary by question, by user and over time, and the GEO researchers themselves found results vary by domain.

## How do I measure AI visibility?

There's no single "rank" to track, so measure it from three angles:

1. **A prompt panel.** Write down 20 to 50 questions your buyers actually ask. Run them monthly in ChatGPT, Perplexity, Gemini and Google, and record whether you're mentioned, whether you're cited with a link, and which competitors appear.
2. **Referral traffic.** In your analytics, watch visits from AI assistants such as chatgpt.com, perplexity.ai and gemini.google.com, and which pages they land on.
3. **Search Console.** Google includes AI Overviews and AI Mode traffic in the Performance report under the "Web" search type ([Google](https://developers.google.com/search/docs/appearance/ai-features)). Watch impressions for question-style queries.

## A 30-day plan to get started

| Week | Do this |
|---|---|
| 1 | Run an AI readiness check. Fix robots.txt and CDN blocks for OAI-SearchBot, PerplexityBot and Googlebot. Verify your site in Google Search Console and Bing Webmaster Tools. |
| 2 | Build your prompt panel of 20 to 50 buyer questions. Record your baseline: where you appear, who appears instead. |
| 3 | Rewrite your three most important pages answer-first, with question headings, specific numbers and sources. Add an FAQ answering the panel questions you're missing. |
| 4 | Start earning mentions: pitch two roundups, update your directory listings, and answer five genuine questions in buyer communities. Re-run the panel next month. |

## Frequently asked questions

### Can I pay to be recommended by ChatGPT?

No. ChatGPT now shows ads, which are labelled and separate from the answer, but there is no way to buy a recommendation inside the AI-written answer itself.

### Does blocking GPTBot remove my site from ChatGPT?

No. GPTBot is OpenAI's training crawler. ChatGPT search uses OAI-SearchBot, which you can allow separately while blocking GPTBot.

### Do I need llms.txt to appear in AI answers?

No. Google says no AI text files are needed for AI Overviews or AI Mode, and its Search Advocate John Mueller said in 2025 that no AI system used llms.txt.

### Does SEO still matter for AI search?

Yes. Google's AI features draw on pages that are indexed and eligible for a snippet, and Ahrefs found most pages cited in AI Overviews also rank in the top 10.

### How long does it take to appear in AI answers?

Crawler access changes apply within about 24 hours for OpenAI and Perplexity. Content improvements can show up within weeks; reputation-driven recommendations usually take months.

## Sources

<ul class="st-sources">
<li>OpenAI, <a href="https://developers.openai.com/docs/bots" target="_blank" rel="noopener">Overview of OpenAI crawlers</a></li>
<li>Perplexity, <a href="https://docs.perplexity.ai/guides/bots" target="_blank" rel="noopener">Perplexity crawlers</a></li>
<li>Google Search Central, <a href="https://developers.google.com/search/docs/appearance/ai-features" target="_blank" rel="noopener">AI features and your website</a></li>
<li>Aggarwal et al., <a href="https://arxiv.org/abs/2311.09735" target="_blank" rel="noopener">GEO: Generative Engine Optimization</a>, KDD 2024</li>
<li>Ahrefs, <a href="https://ahrefs.com/blog/ai-overview-brand-correlation/" target="_blank" rel="noopener">An Analysis of AI Overview Brand Visibility Factors (75K Brands Studied)</a>, May 2025</li>
<li>Ahrefs, <a href="https://ahrefs.com/blog/search-rankings-ai-citations" target="_blank" rel="noopener">Study of AI Overview citations and Google rankings (1.9M citations)</a>, July 2025</li>
<li>Search Engine Roundtable, <a href="https://seroundtable.com/google-ai-llms-txt-39607.html" target="_blank" rel="noopener">Google: No AI System Currently Uses LLMs.txt</a>, June 2025</li>
<li>Search Engine Land, <a href="https://searchengineland.com/cloudflare-to-block-ai-crawlers-by-default-with-new-pay-per-crawl-initiative-457708" target="_blank" rel="noopener">Cloudflare to block AI crawlers by default</a>, July 2025</li>
</ul>
