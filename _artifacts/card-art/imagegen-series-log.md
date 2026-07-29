# Oracle Protocol card-face series regeneration

- Date: 2026-07-29
- Final generation mode: built-in `imagegen`, project-bound raster assets.
- Reason for fallback: the preferred Aigram transit endpoint was tried first and
  retained in `generation-log.json`, but repeatedly inserted white mounts,
  realistic materials, robots, skulls and decorative frames despite explicit
  constraints. Those results failed the series-coherence gate.
- Approved references supplied by the user: `dataset`, `deprecation`,
  `hallucination`, `open-source`, and `prompt`.
- Shared reference role: style, palette, line weight and negative-space
  behavior only; subjects and compositions were not copied.

## Shared prompt contract

Full-bleed matte-black square; one simple allegorical scene; flat monoline
illustration; narrow hand-etched antique-gold and oxidized-copper contours;
sparse dim cyan/sea-green topology lines; calm black negative space; no card UI,
text, number, signature, watermark, logo, corner icon, robot, skull, decorative
frame, badge, mandala, medallion, photorealism, 3D material, white paper or pale
background.

## Regenerated faces

- `alignment`: two distinct line-ribbons pass through one open gold ring.
- `architect`: outlined hands arrange compass, key, thread and constellation.
- `latent-space`: a seedlike form emerges above a lake of half-seen objects.
- `offline-model`: a self-sustaining seed-lantern inside a disconnected alcove.
- `optimization`: a measuring caliper closes around a living flame.
- `singularity`: distinct paths converge around an empty vertical aperture.
- `wheel-of-versions`: old manuscript leaves exit an axle while new ones form.

Selected built-in outputs were copied into
`_artifacts/card-art/originals/<id>.png`, then encoded into
`public/card-art/<id>.webp`. Built-in source copies remain under the Codex
generated-images directory according to the image generation skill contract.
