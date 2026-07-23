/*
 * Animated brain logo — hover fluid flow.
 *
 * Ported from the design handoff (design/design_handoff_brain_logo/). The pixel /
 * geodesic method is kept intact: the logo image's bright pixels are extracted by
 * luminance, a chamfer-BFS geodesic distance is computed from the stem tip, and a
 * soft purple front advances along that distance on hover. Two stacked canvases
 * (.base static white + .fluid animated purple) live inside each .brain-logo host.
 *
 * Adaptations for this static multi-page site:
 *  - The .base canvas draws the real logo asset's pixels directly, so the icon at
 *    rest is pixel-identical to the previous <img> (zero visual change).
 *  - focus/blur bind to the nearest focusable ancestor (the brand <a>), so keyboard
 *    focus animates the logo even though the host itself is a <span>.
 *  - prefers-reduced-motion: reduce shows the static logo and never animates.
 *
 * Each .brain-logo must carry data-src="<same-origin logo url>" so the canvas can
 * read the image pixels.
 */
(function () {
  var R = 340;        // internal render resolution (square)
  var BAND = 0.055;   // softness of the advancing liquid front (normalized distance)
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  function hex2rgb(h) {
    h = (h || '#5046e6').trim().replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }

  function mount(host) {
    var base = host.querySelector('.base'), fluid = host.querySelector('.fluid');
    if (!base || !fluid) return;
    var src = host.getAttribute('data-src');
    if (!src) return; // need a same-origin image to read pixels from
    var cs = getComputedStyle(host);
    var flow = parseFloat(cs.getPropertyValue('--flow')) || 3;
    var drain = parseFloat(cs.getPropertyValue('--drain')) || 1.4;
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () { prep(host, base, fluid, img, flow, drain); };
    img.src = src;
  }

  function prep(host, base, fluid, img, flow, drain) {
    base.width = base.height = R; fluid.width = fluid.height = R;

    // Offscreen copy used only to sample pixels (luminance -> ink mask + geodesic).
    var off = document.createElement('canvas'); off.width = off.height = R;
    var octx = off.getContext('2d'); octx.drawImage(img, 0, 0, R, R);
    var data = octx.getImageData(0, 0, R, R).data;

    // Base layer: the real logo pixels, so the rest state is identical to the old <img>.
    var bctx = base.getContext('2d'); bctx.drawImage(img, 0, 0, R, R);

    // Luminance -> alpha weight; collect the bright "ink" pixels (the brain strokes).
    var lum = new Float32Array(R * R), ink = [];
    for (var p = 0; p < R * R; p++) {
      var i = p * 4, l = (data[i] + data[i + 1] + data[i + 2]) / 3;
      var a = Math.max(0, Math.min(1, (l - 45) / 210));
      lum[p] = a;
      if (a > 0.06) ink.push(p);
    }

    // Geodesic distance from the stem tip (bottom-most ink), constrained to ink,
    // via a chamfer BFS (10 orthogonal / 14 diagonal).
    var INF = 1e9, dist = new Float32Array(R * R).fill(INF), isInk = new Uint8Array(R * R);
    for (var k2 = 0; k2 < ink.length; k2++) isInk[ink[k2]] = 1;
    var maxY = 0;
    for (var k3 = 0; k3 < ink.length; k3++) { var y = (ink[k3] / R) | 0; if (y > maxY) maxY = y; }
    var queue = [];
    for (var k4 = 0; k4 < ink.length; k4++) { var pp = ink[k4], yy = (pp / R) | 0; if (yy >= maxY - 4) { dist[pp] = 0; queue.push(pp); } }
    var nb = [[-1, 0, 10], [1, 0, 10], [0, -1, 10], [0, 1, 10], [-1, -1, 14], [1, -1, 14], [-1, 1, 14], [1, 1, 14]];
    var headi = 0;
    while (headi < queue.length) {
      var cur = queue[headi++], cx = cur % R, cy = (cur / R) | 0, dc = dist[cur];
      for (var ni = 0; ni < 8; ni++) {
        var nx = cx + nb[ni][0], ny = cy + nb[ni][1];
        if (nx < 0 || ny < 0 || nx >= R || ny >= R) continue;
        var npx = ny * R + nx;
        if (!isInk[npx]) continue;
        var nd = dc + nb[ni][2];
        if (nd < dist[npx] - 0.5) { dist[npx] = nd; queue.push(npx); }
      }
    }
    var maxD = 1;
    for (var k5 = 0; k5 < ink.length; k5++) { var dv = dist[ink[k5]]; if (dv < INF && dv > maxD) maxD = dv; }

    // Precompute per-ink-pixel index, normalized distance, luminance.
    var n = ink.length, idx = new Int32Array(n), dn = new Float32Array(n), al = new Float32Array(n);
    for (var k6 = 0; k6 < n; k6++) {
      var pv = ink[k6];
      idx[k6] = pv * 4;
      dn[k6] = (dist[pv] >= INF ? 1 : dist[pv] / maxD);
      al[k6] = lum[pv];
    }

    var fctx = fluid.getContext('2d'), fimg = fctx.createImageData(R, R), fd = fimg.data;
    function paintColor() {
      var c = hex2rgb(getComputedStyle(host).getPropertyValue('--fluid'));
      for (var k = 0; k < n; k++) { var o = idx[k]; fd[o] = c[0]; fd[o + 1] = c[1]; fd[o + 2] = c[2]; }
    }
    paintColor();

    var gt = 0, dir = 0, raf = null, last = null;
    function render0() {
      if (gt <= 0.0005) { for (var k = 0; k < n; k++) fd[idx[k] + 3] = 0; }
      else for (var k = 0; k < n; k++) {
        var f = (gt * (1 + BAND) - dn[k]) / BAND;
        var rev = f <= 0 ? 0 : (f >= 1 ? 1 : f);
        fd[idx[k] + 3] = (rev * al[k] * 255) | 0;
      }
      fctx.putImageData(fimg, 0, 0);
    }
    function tick() {
      var now = performance.now(); if (last == null) last = now;
      var dt = (now - last) / 1000; last = now;
      if (dir > 0) gt = Math.min(1, gt + dt / flow); else if (dir < 0) gt = Math.max(0, gt - dt / drain);
      render0();
      var settled = (dir > 0 && gt >= 1) || (dir < 0 && gt <= 0);
      if (!settled) raf = requestAnimationFrame(tick); else raf = null;
    }
    function kick(d) {
      if (mq.matches) return; // reduced motion: stay static
      dir = d; last = performance.now();
      if (!raf) raf = requestAnimationFrame(tick);
    }
    render0();

    // Pointer over the logo; keyboard focus on the surrounding link (the real focus target).
    var focusEl = host.closest('a[href], button') || host;
    host.addEventListener('mouseenter', function () { kick(1); });
    host.addEventListener('mouseleave', function () { kick(-1); });
    focusEl.addEventListener('focus', function () { kick(1); });
    focusEl.addEventListener('blur', function () { kick(-1); });
  }

  function init() { document.querySelectorAll('.brain-logo').forEach(mount); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
