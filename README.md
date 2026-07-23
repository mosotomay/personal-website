# mauriciosotomayor.com

My personal website — plain HTML and CSS, no build step. The files in this
folder *are* the website. Edit a file, save it, and that's the change.

## File structure

```
/
├── index.html                 ← Home page (dark space-themed hero)
├── styles.css                 ← One stylesheet shared by every page
├── README.md                  ← This file
├── images/
│   └── brain-logo.png         ← Brand logo (white, sits on dark header)
└── blogs/
    ├── index.html             ← Blog listing page
    ├── building-bulls-eyes-with-ai.html   ← Newest post
    ├── the-future-of-web3-wallets.html
    ├── rookie-revelations.html
    ├── my-petroleum-past.html
    └── door-dash-for-more-cash.html        ← Oldest post
```

## How to preview it
Double-click `index.html` and it opens in your browser — the real site,
exactly as visitors will see it.

## How to change the look
All colors, fonts, and spacing live in `styles.css`. The palette is in the
`:root` block at the top (e.g. `--accent` is the indigo). Fonts are Playfair
Display (headings) + Hanken Grotesk (body), loaded from Google Fonts.

## How to edit a blog post
Open the post's `.html` file in `blogs/`. The text lives between the
`<article>` tags. Edit the words inside the tags; leave the tags alone.

## How to add a NEW blog post

Follow **every** step below. Steps 4 and 5 are the ones most easily forgotten —
they keep the site's navigation consistent, so don't skip them.

1. **Copy an existing post** (e.g. `blogs/the-future-of-web3-wallets.html`) and
   rename it, e.g. `blogs/my-new-post.html`. The file name becomes the URL.
2. **Update the content:** the `<title>`, `<meta>` description + Open Graph tags
   (`og:title`, `og:description`, `og:url`, `og:image`), the `<h1>`, the date and
   read-time in `.meta`, the cover image, and the body text inside `<article>`.
3. **Add it to the listing:** add a new `<a class="post-card">…</a>` card in
   `blogs/index.html`. Posts are listed newest-first, so a brand-new post goes at
   the **top** of the grid.
4. **Header social icons (must be on every page):** the header `<nav class="nav-links">`
   contains two `<a class="pill">` links, side by side on the right — LinkedIn
   first, then GitHub (`https://github.com/mosotomay`). Because they use the
   `.pill` class they stay visible and right-aligned at every browser width
   (mobile CSS only hides `a:not(.pill)`). Copying an existing post carries these
   over automatically — just confirm both pills are present.
5. **Bottom post-to-post navigation (`.post-nav`):** every post ends with a
   `<div class="post-nav">` holding two arrow links, just before `</article>`.
   The convention is **`←` = newer post, `→` = older post**. When you add a new
   (newest) post you must update the chain in BOTH directions:
   - New post: left side is an empty `<span></span>` (nothing newer); right side
     links `→` to the post that was previously newest.
   - Previously-newest post: change its left `<span></span>` into a `←` link back
     to the new post.
   The oldest post keeps an empty `<span></span>` on its right side. The full
   chain should read continuously from newest to oldest and back.
6. **Call-to-action buttons (download / external link):** wrap the button in a
   paragraph with the `btn-row` class so it is centered — e.g.
   `<p class="btn-row"><a class="btn btn--primary" href="…">Download Thesis (PDF)</a></p>`.
   Do **not** use a plain `<p>`: inline article-link styling would paint the
   button text the same purple as its background and make it invisible. The
   `.btn` class is excluded from that link styling in `styles.css`, so the white
   button label stays legible.

## Images — IMPORTANT (do before cancelling Squarespace)
Several images still load from the old Squarespace servers and will break when
you cancel:
- The About photo (`index.html`)
- All blog cover + inline images
- The thesis PDF link (`my-petroleum-past.html`)
- The hero background (a hot-linked Flickr photo in `styles.css`)

Save local copies into `images/` and update those URLs. Claude can do this for
you in one pass.

## Publishing changes
This folder connects to GitHub → Cloudflare Pages. After you save changes,
commit/upload them to GitHub and the live site rebuilds automatically in about
a minute.

## Note
The `Website redesign suggestions v2/` folder and `product-owner-vs-pm.png` are
leftover source/design files. They are NOT part of the live site and don't need
to be uploaded to GitHub.
