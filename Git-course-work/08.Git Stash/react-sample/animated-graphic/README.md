# Orrery

A small centered, animated graphic: a quiet canvas orrery — concentric
rings on independent orbits around a slowly pulsing sun, each with a
short fading trail.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Structure

```
animated-graphic/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    └── components/
        └── Orrery.jsx    # canvas animation logic
```

## Notes

- Pure Canvas 2D, no animation libraries.
- Respects `prefers-reduced-motion` (renders a single static frame).
- Resizes responsively with the window, capped at 2x device pixel ratio.
- Tweak the look by editing the `RINGS` array in `Orrery.jsx` — each
  entry controls a ring's radius, tilt (perspective squash), speed,
  and color.
