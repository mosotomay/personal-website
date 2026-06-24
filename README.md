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
    ├── the-future-of-web3-wallets.html
    ├── rookie-revelations.html
    ├── my-petroleum-past.html
    └── door-dash-for-more-cash.html
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
1. Copy an existing post (e.g. `blogs/my-petroleum-past.html`) and rename it,
   e.g. `blogs/my-new-post.html`. The file name becomes the URL.
2. Update the title, kicker, date, and body inside the new file.
3. Add a new `<a class="post-card">…</a>` card at the top of `blogs/index.html`.

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
