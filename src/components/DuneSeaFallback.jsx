/* Static stand-in for the dune sea, and the bridge the real canvas fades onto.
 *
 * This lives in its own module, with no three.js import, so it can do two jobs
 * from one definition:
 *
 *   1. the fallback when WebGL2 is genuinely unavailable, and
 *   2. the bridge image underneath the real canvas while the chunk downloads
 *      and the shaders compile.
 *
 * It used to be what every phone saw permanently, because the capability gate
 * read `!webgl2 || innerWidth < 768`. That gate is gone -- it was covering for a
 * framing bug, not a capability one -- so this is now only ever a fallback or a
 * bridge, and it needs to survive being looked at for about a second rather
 * than for a whole visit.
 *
 * Job 2 is why it is not still inside DuneSea.jsx. Importing it from there
 * would pull three, @react-three/fiber and postprocessing into whatever bundle
 * referenced it -- which for HomePage is the main bundle, defeating the code
 * split it is meant to cover for. That constraint is why the sky below is DOM
 * and CSS rather than a canvas, and why nothing here is generated at runtime.
 *
 * EVERY NUMBER IN THIS FILE IS COMPUTED, NOT CHOSEN. The moon centres, the moon
 * diameters and all 19 named stars come from the same camera the real scene
 * uses -- pitch -3.8, vertical FOV 52 -- projected to NDC and converted to
 * percentages. Regenerate rather than hand-edit if the camera, PALETTE's night
 * end, or the moon placements move.
 *
 * THE PLATE, which is the one idea here worth understanding. Horizontal
 * position depends on aspect and vertical position does not, because fov is the
 * VERTICAL field of view. The real scene handles that with a frame fit that
 * scales tan(azimuth) by aspect/(4:3), clamped at 1. CSS cannot compute an
 * aspect ratio, but it does not need to: putting the bodies inside a plate that
 * is exactly 4:3 above the reference aspect and exactly the viewport below it
 * reproduces both regimes from one set of percentages. Above 4:3 a percentage
 * of the plate's width is a percentage of 4/3 x height, which is the clamped
 * case; below it, the percentage is of the real width, which is the fitted
 * case. The two agree at 4:3, so there is no seam. Moon diameters ride the same
 * trick, which is why they are expressed as a share of width. */
export default function DuneSeaFallback() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
      <style>{CSS}</style>
      {/* The base is unchanged: three stops matched to PALETTE at scroll 0 with
          the sun at its intro depth, so the canvas cross-fades onto an image it
          already almost is. */}
      <div className="dsf-base" />
      <div className="dsf-plate">
        {/* Field stars. Dimmed toward the horizon, because the sky brightens
            into the ember band and a low star is washed out by it. */}
        <i className="dsf-s" style={{ left: '32.65%', top: '46.39%', opacity: 0.316, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '7.88%', top: '25.7%', opacity: 0.536, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '4.44%', top: '31.19%', opacity: 0.482, width: '2px', height: '2px' }} />
        <i className="dsf-s" style={{ left: '9.69%', top: '31.68%', opacity: 0.477, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '12.94%', top: '42.5%', opacity: 0.362, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '94.1%', top: '23.48%', opacity: 0.556, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '96.91%', top: '52.0%', opacity: 0.24, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '29.28%', top: '46.75%', opacity: 0.311, width: '2px', height: '2px' }} />
        <i className="dsf-s" style={{ left: '31.14%', top: '10.63%', opacity: 0.671, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '58.04%', top: '20.16%', opacity: 0.587, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '54.7%', top: '51.13%', opacity: 0.253, width: '2px', height: '2px' }} />
        <i className="dsf-s" style={{ left: '21.04%', top: '17.93%', opacity: 0.607, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '45.39%', top: '38.39%', opacity: 0.408, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '69.6%', top: '41.38%', opacity: 0.375, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '72.6%', top: '39.02%', opacity: 0.401, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '12.38%', top: '32.03%', opacity: 0.474, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '15.72%', top: '28.22%', opacity: 0.511, width: '2px', height: '2px' }} />
        <i className="dsf-s" style={{ left: '66.57%', top: '13.4%', opacity: 0.647, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '86.98%', top: '37.64%', opacity: 0.416, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '59.3%', top: '23.33%', opacity: 0.558, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '83.49%', top: '3.72%', opacity: 0.729, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '66.17%', top: '51.24%', opacity: 0.251, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '64.49%', top: '1.12%', opacity: 0.751, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '28.78%', top: '33.76%', opacity: 0.456, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '17.3%', top: '48.21%', opacity: 0.293, width: '2px', height: '2px' }} />
        <i className="dsf-s" style={{ left: '76.42%', top: '47.55%', opacity: 0.301, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '39.26%', top: '7.66%', opacity: 0.696, width: '2px', height: '2px' }} />
        <i className="dsf-s" style={{ left: '44.99%', top: '24.97%', opacity: 0.542, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '81.45%', top: '8.06%', opacity: 0.693, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '41.66%', top: '35.22%', opacity: 0.441, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '95.09%', top: '46.39%', opacity: 0.316, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '23.6%', top: '41.96%', opacity: 0.368, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '58.78%', top: '40.38%', opacity: 0.386, width: '2px', height: '2px' }} />
        <i className="dsf-s" style={{ left: '56.53%', top: '3.27%', opacity: 0.733, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '51.53%', top: '21.3%', opacity: 0.576, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '6.07%', top: '6.15%', opacity: 0.709, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '39.4%', top: '33.05%', opacity: 0.464, width: '2px', height: '2px' }} />
        <i className="dsf-s" style={{ left: '63.23%', top: '51.15%', opacity: 0.252, width: '2px', height: '2px' }} />
        <i className="dsf-s" style={{ left: '21.31%', top: '45.78%', opacity: 0.323, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '5.93%', top: '54.49%', opacity: 0.2, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '10.74%', top: '34.96%', opacity: 0.444, width: '2px', height: '2px' }} />
        <i className="dsf-s" style={{ left: '86.87%', top: '21.49%', opacity: 0.575, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '25.6%', top: '35.83%', opacity: 0.435, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '12.85%', top: '8.87%', opacity: 0.686, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '46.65%', top: '28.49%', opacity: 0.509, width: '2px', height: '2px' }} />
        <i className="dsf-s" style={{ left: '26.83%', top: '9.95%', opacity: 0.677, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '3.02%', top: '3.38%', opacity: 0.732, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '15.19%', top: '25.3%', opacity: 0.539, width: '2px', height: '2px' }} />
        <i className="dsf-s" style={{ left: '52.77%', top: '1.91%', opacity: 0.744, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '36.87%', top: '45.52%', opacity: 0.326, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '53.21%', top: '12.63%', opacity: 0.654, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '22.72%', top: '10.88%', opacity: 0.669, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '23.08%', top: '26.68%', opacity: 0.526, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '3.6%', top: '53.0%', opacity: 0.225, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '26.28%', top: '17.28%', opacity: 0.613, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '44.8%', top: '4.14%', opacity: 0.726, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '94.82%', top: '34.9%', opacity: 0.445, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '89.43%', top: '9.33%', opacity: 0.682, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '9.1%', top: '18.99%', opacity: 0.597, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '47.84%', top: '44.9%', opacity: 0.334, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '40.29%', top: '3.61%', opacity: 0.73, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '15.64%', top: '5.86%', opacity: 0.712, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '97.31%', top: '19.17%', opacity: 0.596, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '54.79%', top: '47.46%', opacity: 0.302, width: '2px', height: '2px' }} />
        <i className="dsf-s" style={{ left: '82.13%', top: '43.16%', opacity: 0.354, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '29.61%', top: '41.57%', opacity: 0.373, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '26.3%', top: '31.98%', opacity: 0.474, width: '2px', height: '2px' }} />
        <i className="dsf-s" style={{ left: '90.39%', top: '35.48%', opacity: 0.439, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '50.16%', top: '25.91%', opacity: 0.533, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '18.79%', top: '54.29%', opacity: 0.203, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '72.18%', top: '24.59%', opacity: 0.546, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '55.94%', top: '41.14%', opacity: 0.377, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '76.82%', top: '27.21%', opacity: 0.521, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '75.61%', top: '5.45%', opacity: 0.715, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '61.08%', top: '27.33%', opacity: 0.52, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '68.98%', top: '30.19%', opacity: 0.492, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '47.84%', top: '3.89%', opacity: 0.728, width: '1px', height: '1px' }} />
        <i className="dsf-s" style={{ left: '87.09%', top: '3.86%', opacity: 0.728, width: '1px', height: '1px' }} />

        {/* The three named figures, at their real placements. These are the
            part a returning visitor recognises, so they are worth the DOM. */}
        <i className="dsf-s dsf-cs" style={{ left: '22.62%', top: '5.02%', opacity: 0.895, width: '3px', height: '3px', boxShadow: '0 0 4px rgba(198,224,255,0.492)' }} /> {/* Orion */}
        <i className="dsf-s dsf-cs" style={{ left: '30.54%', top: '5.72%', opacity: 0.77, width: '2px', height: '2px', boxShadow: '0 0 3px rgba(198,224,255,0.424)' }} /> {/* Orion */}
        <i className="dsf-s dsf-cs" style={{ left: '24.39%', top: '14.37%', opacity: 0.77, width: '2px', height: '2px', boxShadow: '0 0 3px rgba(198,224,255,0.424)' }} /> {/* Orion */}
        <i className="dsf-s dsf-cs" style={{ left: '26.08%', top: '14.13%', opacity: 0.795, width: '2px', height: '2px', boxShadow: '0 0 3px rgba(198,224,255,0.437)' }} /> {/* Orion */}
        <i className="dsf-s dsf-cs" style={{ left: '27.92%', top: '13.94%', opacity: 0.745, width: '2px', height: '2px', boxShadow: '0 0 3px rgba(198,224,255,0.41)' }} /> {/* Orion */}
        <i className="dsf-s dsf-cs" style={{ left: '21.49%', top: '22.57%', opacity: 0.76, width: '2px', height: '2px', boxShadow: '0 0 3px rgba(198,224,255,0.418)' }} /> {/* Orion */}
        <i className="dsf-s dsf-cs" style={{ left: '29.64%', top: '23.50%', opacity: 0.92, width: '3px', height: '3px', boxShadow: '0 0 4px rgba(198,224,255,0.506)' }} /> {/* Orion */}
        <i className="dsf-s dsf-cs" style={{ left: '78.25%', top: '12.17%', opacity: 0.78, width: '2px', height: '2px', boxShadow: '0 0 3px rgba(198,224,255,0.429)' }} /> {/* Cassiopeia */}
        <i className="dsf-s dsf-cs" style={{ left: '81.34%', top: '14.40%', opacity: 0.845, width: '2px', height: '2px', boxShadow: '0 0 3px rgba(198,224,255,0.465)' }} /> {/* Cassiopeia */}
        <i className="dsf-s dsf-cs" style={{ left: '85.11%', top: '12.56%', opacity: 0.77, width: '2px', height: '2px', boxShadow: '0 0 3px rgba(198,224,255,0.424)' }} /> {/* Cassiopeia */}
        <i className="dsf-s dsf-cs" style={{ left: '88.36%', top: '14.71%', opacity: 0.78, width: '2px', height: '2px', boxShadow: '0 0 3px rgba(198,224,255,0.429)' }} /> {/* Cassiopeia */}
        <i className="dsf-s dsf-cs" style={{ left: '92.54%', top: '12.18%', opacity: 0.73, width: '2px', height: '2px', boxShadow: '0 0 3px rgba(198,224,255,0.402)' }} /> {/* Cassiopeia */}
        <i className="dsf-s dsf-cs" style={{ left: '44.99%', top: '6.92%', opacity: 0.845, width: '2px', height: '2px', boxShadow: '0 0 3px rgba(198,224,255,0.465)' }} /> {/* Big Dipper */}
        <i className="dsf-s dsf-cs" style={{ left: '46.50%', top: '10.63%', opacity: 0.82, width: '2px', height: '2px', boxShadow: '0 0 3px rgba(198,224,255,0.451)' }} /> {/* Big Dipper */}
        <i className="dsf-s dsf-cs" style={{ left: '49.59%', top: '11.29%', opacity: 0.81, width: '2px', height: '2px', boxShadow: '0 0 3px rgba(198,224,255,0.446)' }} /> {/* Big Dipper */}
        <i className="dsf-s dsf-cs" style={{ left: '50.98%', top: '8.99%', opacity: 0.72, width: '2px', height: '2px', boxShadow: '0 0 3px rgba(198,224,255,0.396)' }} /> {/* Big Dipper */}
        <i className="dsf-s dsf-cs" style={{ left: '53.47%', top: '8.11%', opacity: 0.86, width: '2px', height: '2px', boxShadow: '0 0 3px rgba(198,224,255,0.473)' }} /> {/* Big Dipper */}
        <i className="dsf-s dsf-cs" style={{ left: '56.40%', top: '6.46%', opacity: 0.79, width: '2px', height: '2px', boxShadow: '0 0 3px rgba(198,224,255,0.435)' }} /> {/* Big Dipper */}
        <i className="dsf-s dsf-cs" style={{ left: '59.80%', top: '7.42%', opacity: 0.85, width: '2px', height: '2px', boxShadow: '0 0 3px rgba(198,224,255,0.468)' }} /> {/* Big Dipper */}

        {/* Moons. Additive in the real scene and with no halo outside the
            limb, so a soft edge here would be wrong -- the falloff below
            stops at the limb and the sky takes over. */}
        <i className="dsf-moon" style={{ left: '6.133%', top: '7.053%', width: '6.937%', background: 'radial-gradient(circle at 38% 34%, #fff6e8 0%, #f0dcc0 42%, #c9ae92 72%, #8d7a66 92%, rgba(141,122,102,0) 100%)', boxShadow: '0 0 14px rgba(255,238,214,0.28)' }} /> {/* moon A */}
        <i className="dsf-moon" style={{ left: '93.115%', top: '28.596%', width: '4.162%', background: 'radial-gradient(circle at 42% 36%, #cfd8e4 0%, #a8b3c2 50%, #6e7784 88%, rgba(110,119,132,0) 100%)' }} /> {/* moon B */}
      </div>

      {/* Dunes. Two silhouettes rather than one edge: a single horizon line
          reads as fog, and a far/near pair is the cheapest thing that reads as
          distance. Stretched with preserveAspectRatio="none" on purpose, so the
          crests widen with the viewport instead of scaling like a logo. */}
      <svg
        className="dsf-dunes"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          <linearGradient id="dsfFar" x1="0" y1="0.55" x2="0" y2="1">
            <stop offset="0" stopColor="#1b130d" />
            <stop offset="1" stopColor="#0a0705" />
          </linearGradient>
          <linearGradient id="dsfNear" x1="0" y1="0.62" x2="0" y2="1">
            <stop offset="0" stopColor="#0d0906" />
            <stop offset="1" stopColor="#050403" />
          </linearGradient>
        </defs>
        <path d="M 0 565.1 C 10.0 565.1, 10.0 570.24, 20 570.24 C 30.0 570.24, 30.0 571.58, 40 571.58 C 50.0 571.58, 50.0 562.77, 60 562.77 C 70.0 562.77, 70.0 571.34, 80 571.34 C 90.0 571.34, 90.0 564.88, 100 564.88 C 110.0 564.88, 110.0 564.48, 120 564.48 C 130.0 564.48, 130.0 573.19, 140 573.19 C 150.0 573.19, 150.0 573.27, 160 573.27 C 170.0 573.27, 170.0 575.09, 180 575.09 C 190.0 575.09, 190.0 562.76, 200 562.76 C 210.0 562.76, 210.0 568.22, 220 568.22 C 230.0 568.22, 230.0 570.58, 240 570.58 C 250.0 570.58, 250.0 571.65, 260 571.65 C 270.0 571.65, 270.0 563.99, 280 563.99 C 290.0 563.99, 290.0 568.43, 300 568.43 C 310.0 568.43, 310.0 565.71, 320 565.71 C 330.0 565.71, 330.0 568.25, 340 568.25 C 350.0 568.25, 350.0 573.79, 360 573.79 C 370.0 573.79, 370.0 563.96, 380 563.96 C 390.0 563.96, 390.0 574.95, 400 574.95 C 410.0 574.95, 410.0 576.41, 420 576.41 C 430.0 576.41, 430.0 576.23, 440 576.23 C 450.0 576.23, 450.0 567.59, 460 567.59 C 470.0 567.59, 470.0 575.47, 480 575.47 C 490.0 575.47, 490.0 575.87, 500 575.87 C 510.0 575.87, 510.0 569.74, 520 569.74 C 530.0 569.74, 530.0 567.75, 540 567.75 C 550.0 567.75, 550.0 564.66, 560 564.66 C 570.0 564.66, 570.0 568.61, 580 568.61 C 590.0 568.61, 590.0 565.13, 600 565.13 C 610.0 565.13, 610.0 566.46, 620 566.46 C 630.0 566.46, 630.0 575.63, 640 575.63 C 650.0 575.63, 650.0 570.48, 660 570.48 C 670.0 570.48, 670.0 575.38, 680 575.38 C 690.0 575.38, 690.0 565.93, 700 565.93 C 710.0 565.93, 710.0 570.76, 720 570.76 C 730.0 570.76, 730.0 572.6, 740 572.6 C 750.0 572.6, 750.0 566.01, 760 566.01 C 770.0 566.01, 770.0 576.3, 780 576.3 C 790.0 576.3, 790.0 571.46, 800 571.46 C 810.0 571.46, 810.0 570.28, 820 570.28 C 830.0 570.28, 830.0 570.08, 840 570.08 C 850.0 570.08, 850.0 578.91, 860 578.91 C 870.0 578.91, 870.0 562.95, 880 562.95 C 890.0 562.95, 890.0 572.58, 900 572.58 C 910.0 572.58, 910.0 567.77, 920 567.77 C 930.0 567.77, 930.0 572.52, 940 572.52 C 950.0 572.52, 950.0 567.39, 960 567.39 C 970.0 567.39, 970.0 575.8, 980 575.8 C 990.0 575.8, 990.0 564.92, 1000 564.92 L 1000 1000 L 0 1000 Z" fill="url(#dsfFar)" />
        <path d="M 0 670.51 C 10.0 670.51, 10.0 670.95, 20 670.95 C 30.0 670.95, 30.0 662.23, 40 662.23 C 50.0 662.23, 50.0 658.3, 60 658.3 C 70.0 658.3, 70.0 687.95, 80 687.95 C 90.0 687.95, 90.0 681.07, 100 681.07 C 110.0 681.07, 110.0 663.44, 120 663.44 C 130.0 663.44, 130.0 651.15, 140 651.15 C 150.0 651.15, 150.0 647.98, 160 647.98 C 170.0 647.98, 170.0 648.33, 180 648.33 C 190.0 648.33, 190.0 672.6, 200 672.6 C 210.0 672.6, 210.0 666.68, 220 666.68 C 230.0 666.68, 230.0 670.07, 240 670.07 C 250.0 670.07, 250.0 677.45, 260 677.45 C 270.0 677.45, 270.0 663.83, 280 663.83 C 290.0 663.83, 290.0 670.16, 300 670.16 C 310.0 670.16, 310.0 672.03, 320 672.03 C 330.0 672.03, 330.0 652.77, 340 652.77 C 350.0 652.77, 350.0 647.11, 360 647.11 C 370.0 647.11, 370.0 675.57, 380 675.57 C 390.0 675.57, 390.0 677.82, 400 677.82 C 410.0 677.82, 410.0 659.45, 420 659.45 C 430.0 659.45, 430.0 669.45, 440 669.45 C 450.0 669.45, 450.0 661.04, 460 661.04 C 470.0 661.04, 470.0 670.69, 480 670.69 C 490.0 670.69, 490.0 655.88, 500 655.88 C 510.0 655.88, 510.0 661.06, 520 661.06 C 530.0 661.06, 530.0 668.66, 540 668.66 C 550.0 668.66, 550.0 653.01, 560 653.01 C 570.0 653.01, 570.0 678.77, 580 678.77 C 590.0 678.77, 590.0 679.65, 600 679.65 C 610.0 679.65, 610.0 664.48, 620 664.48 C 630.0 664.48, 630.0 663.4, 640 663.4 C 650.0 663.4, 650.0 655.3, 660 655.3 C 670.0 655.3, 670.0 664.02, 680 664.02 C 690.0 664.02, 690.0 649.23, 700 649.23 C 710.0 649.23, 710.0 667.86, 720 667.86 C 730.0 667.86, 730.0 654.7, 740 654.7 C 750.0 654.7, 750.0 650.63, 760 650.63 C 770.0 650.63, 770.0 658.39, 780 658.39 C 790.0 658.39, 790.0 687.5, 800 687.5 C 810.0 687.5, 810.0 688.87, 820 688.87 C 830.0 688.87, 830.0 669.54, 840 669.54 C 850.0 669.54, 850.0 669.86, 860 669.86 C 870.0 669.86, 870.0 667.81, 880 667.81 C 890.0 667.81, 890.0 652.75, 900 652.75 C 910.0 652.75, 910.0 661.74, 920 661.74 C 930.0 661.74, 930.0 669.81, 940 669.81 C 950.0 669.81, 950.0 668.86, 960 668.86 C 970.0 668.86, 970.0 655.01, 980 655.01 C 990.0 655.01, 990.0 670.84, 1000 670.84 L 1000 1000 L 0 1000 Z" fill="url(#dsfNear)" />
      </svg>
    </div>
  );
}

/* Scoped to this component rather than added to global.css, so the module stays
   self-contained and the stylesheet does not grow a section that only matters
   for a second of page life. Nothing here animates: the real scene owns the
   motion, and a bridge that moves would draw the eye to the hand-off it is
   supposed to hide -- which also means there is no reduced-motion case to
   answer for. */
const CSS = `
.dsf-base {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(38% 16% at 50% 55%, rgba(255,209,102,0.50), transparent 70%),
    radial-gradient(120% 34% at 50% 57%, rgba(255,158,0,0.24), transparent 72%),
    linear-gradient(to bottom, #04060F 0%, #080C18 34%, #17110E 52%, #0C0906 60%, #070505 100%);
}
.dsf-plate { position: absolute; inset: 0; }
@media (min-aspect-ratio: 4/3) {
  .dsf-plate {
    inset: 0 auto;
    aspect-ratio: 4 / 3;
    left: 50%;
    transform: translateX(-50%);
  }
}
.dsf-s {
  position: absolute;
  border-radius: 50%;
  background: #e6eefb;
  transform: translate(-50%, -50%);
}
.dsf-cs { background: #f4f8ff; }
.dsf-moon {
  position: absolute;
  aspect-ratio: 1;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.dsf-dunes {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
`;
