# Handoff: Animated Brain Logo (hover fluid flow)

## Overview
The site logo (top-left of mauriciosotomayor.com) is the existing circuit-brain icon. On hover,
purple fluid enters at the base of the brain stem and flows through the icon's **real pathways**,
branching outward and reaching the far extremities last, over ~3 seconds. On mouse-out it drains
back to plain white in ~1.4 seconds. Keyboard focus/blur trigger the same animation.

## About the Design Files
`brain-icon-embed.html` is a **self-contained, framework-agnostic reference implementation**
(vanilla JS + `<canvas>`, no dependencies, the logo image inlined as a base64 data URI). It is
production-ready: lift the `.brain-logo` element + the `<script>` into the site and wire it to the
existing header logo slot, adapting to the site's framework (React/Astro/Next/plain HTML). Point
it at your own logo asset by adding `data-src="/path/to/logo.png"` to the `.brain-logo` element
(must be same-origin or CORS-enabled so the canvas can read its pixels); otherwise it uses the
inlined favicon.

`Brain Icon.dc.html` is the interactive prototype (same engine).

## Fidelity
**High-fidelity.** The white icon is the **original logo image itself** (extracted from its pixels),
so it matches exactly — do not re-draw it. Preserve the animation method below; it's what makes the
fluid follow the true pathways.

## How it works (the important part — keep this method)
Rather than hand-tracing vector paths (which did not match), the effect is computed from the logo
image's pixels, guaranteeing a perfect match:

1. The logo PNG is drawn to an offscreen canvas at `R=340`. Each pixel's luminance becomes an alpha
   weight — `alpha = clamp((lum-45)/210, 0, 1)` — which extracts the bright brain strokes and drops
   the dark background. This alpha-weighted white is painted to the **base canvas** (the static
   white logo).
2. A **geodesic distance** is computed from the stem tip (the bottom-most bright pixels) outward,
   constrained to the bright pixels only, via a chamfer BFS (weights 10 orthogonal / 14 diagonal).
   Distance to every pixel is normalized 0..1. This distance = "how far the fluid must travel
   through the actual connected pathways to reach this pixel."
3. On hover a `requestAnimationFrame` clock advances progress `gt` 0→1 (hover-in over `--flow`),
   1→0 (hover-out over `--drain`). Each frame, every bright pixel's purple alpha is
   `smoothstep((gt - distanceNorm)/0.055) * luminance`. The `0.055` band gives a soft advancing
   liquid front. This purple is painted to the **fluid canvas** (stacked over the base, with a
   `drop-shadow` glow). At `gt<=0` all purple alpha is 0 — nothing shows at rest.

Because both layers come from the same image pixels, the purple overlays the white perfectly and
flows along the real traces/branches.

## Markup
```html
<a class="brain-logo" href="/" aria-label="Home">
  <canvas class="base"></canvas><canvas class="fluid"></canvas>
</a>
```
Any host element works (`a`/`button`/`div`) as long as it has class `brain-logo` and contains the
two canvases. The script finds all `.brain-logo` on the page and mounts each.

## Theming (CSS custom properties on `.brain-logo`)
- `width` / `height` — render size (e.g. `56px` in the header; canvases scale to fit).
- `--fluid` — fluid color. **`#5046e6`** (the "Read the blog" button purple). Default.
- `--flow` — hover-in fill duration. **`3s`**. Default.
- `--drain` — hover-out drain duration. **`1.4s`**. Default.
- `data-src` attribute (optional) — URL of your own logo image to animate.

## Design Tokens
- Fluid / accent purple: `#5046e6`
- Extracted brain white: `#e9e9f2`
- Internal render resolution: `340×340`
- Fluid front softness (band): `0.055` of normalized distance
- Glow: CSS `drop-shadow(0 0 4px var(--fluid))`
- Timing: flow-in `3s`, drain-out `1.4s`

## Interactions & Behavior
- `mouseenter` / `focus` → fill. `mouseleave` / `blur` → drain. Interruptible (animates from the
  current position, no snapping).
- Purely visual; no layout shift.
- Optional: gate under `@media (prefers-reduced-motion: reduce)` to show the static white icon.

## Assets
The logo image is inlined in `brain-icon-embed.html` as a base64 data URI. `ref-favicon.png` is the
same image, included for reference. In production, prefer pointing `data-src` at the site's real
logo asset.

## Files (in this bundle)
- `brain-icon-embed.html` — self-contained reference implementation to integrate.
- `Brain Icon.dc.html` — interactive prototype (engine reference).
- `ref-favicon.png` — the logo image the effect is derived from.

## Note for the implementer
The browser-tab **favicon** stays the static raster. This animation is for the **in-page header
logo**, which must be the canvas-based component above (an `<img>`/CSS-background can't receive
hover/JS). Reading image pixels requires the source to be same-origin or CORS-enabled.
