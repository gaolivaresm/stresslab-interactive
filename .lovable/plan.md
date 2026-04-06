

## Plan: Add Pin Support Symbols at Post Base and Cable Anchor

### What changes

Replace the current simple ground hatching at both support points (post base and cable anchor) with proper **articulated fixed support (apoyo articulado fijo)** symbols — the classic structural engineering triangle with a pin circle on top, sitting on a hatched ground line.

### Technical details

**Modify the `ground()` function** (or create a new `pinSupport()` function) that draws:

1. **Pin circle** at the support point (cx, cy) — small circle (r≈5) with white fill and black stroke
2. **Triangle** below the pin — an equilateral-ish triangle pointing downward, apex at the pin center, base ~30px wide, height ~20px
3. **Ground line** — horizontal line across the base of the triangle
4. **Hatching** — short diagonal lines below the ground line (existing pattern)

This symbol will be drawn at two locations:
- **Post base** (POST_X, BASE_Y)
- **Cable anchor** (ANC_X, ANC_Y)

The existing `ground()` function (lines 121-138) will be replaced with a `pinSupport(cx, cy, w)` function that draws the full articulated support symbol.

The existing pin circle at the anchor (lines 230-236) will be removed since the new support symbol already includes a pin circle.

**Affected lines**: 121-138 (ground function), 181-183 (ground calls), 229-236 (anchor pin circle).

### Files modified

- `/mnt/documents/StressLab_v1.3.html` — single file, modify SVG drawing functions

