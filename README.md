# Crystal · Medical Visualization

This VuePress site presents the Crystal project, research demos, dataset catalog, and English and Chinese team CVs.

```sh
npm run docs:dev
npm run docs:build
```

## Refresh the volume catalog

Run `scripts/refresh_volume_catalog.py` with `--collection` set to the Volume-Temp directory, `--crystal-source` set to the CrystalVis checkout, and `--snapshot YYYY-MM-DD`. It uses Crystal's INFORAW header reader and updates `docs/.vuepress/theme/data/volume-catalog.json`. The snapshot contains public provenance and volume metadata.

## Gaussian viewer

The homepage and the standalone demo route use the same Vue component. The viewer
loads PlayCanvas when its canvas approaches the viewport. PlayCanvas selects GPU
sorting and rasterization on WebGPU and uses CPU-worker sorting with WebGL2 when
WebGPU is unavailable. The badge reports the renderer selected for the current
model. Production WebGPU requires HTTPS.

The sample models and previews under docs/.vuepress/public/gaussian-models come
from Medi-3DGS, with its license preserved. Add a .splat file and a .jpg preview
there and register the sample under docs/.vuepress/theme/gaussian/examples.ts.
Files selected on the device are decoded locally by the viewer. It accepts
Medi-3DGS .splat files and binary Gaussian .ply files.

All 16 Medi-3DGS examples are included. Manix CT 2 loads first, and each
other model loads only when selected. Dragging orbits around the specimen,
including overhead and underside views. Scroll or pinch to change distance.
With the viewport focused, the horizontal arrows move the camera sideways,
the vertical arrows move it forward or back, and Shift with the vertical
arrows raises or lowers it.
