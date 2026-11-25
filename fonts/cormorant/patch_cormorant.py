"""
Builds Gourmandique Display: Cormorant Garamond with calmer lowercase accents.

Cormorant draws its lowercase acute, grave and circumflex as long, near-vertical
hairlines that climb to ascender height, so "été" reads like "e/te/". Its
capital accents are short and angled. This script redraws every lowercase
letter carrying one of those three accents with the matching capital accent,
scaled down and set just above the x-height. Everything else is untouched.

Both variable fonts (roman and italic, wght 300-700) are patched. Each letter is
rebuilt at the light and bold masters independently and the difference is
written back to `gvar`, so the weight axis keeps working.

The output is subset to Google Fonts' "latin" range (what next/font/google
served before) and written as woff2 next to this file.

Usage (from the repo root):
    pip install fonttools brotli
    python fonts/cormorant/patch_cormorant.py
"""

import math
import urllib.request
from io import BytesIO
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables import ttProgram
from fontTools.ttLib.tables._g_l_y_f import Glyph, GlyphCoordinates
from fontTools.ttLib.tables.TupleVariation import TupleVariation
from fontTools.varLib.instancer import instantiateVariableFont

# Pinned google/fonts commit, so a rebuild reproduces the shipped files.
UPSTREAM = (
    "https://raw.githubusercontent.com/google/fonts/"
    "3dd78844021e948ceb633d1dcee3f7885561b5d9/ofl/cormorantgaramond/"
)
SOURCES = {
    "GourmandiqueDisplay-VF.woff2": "CormorantGaramond%5Bwght%5D.ttf",
    "GourmandiqueDisplay-Italic-VF.woff2": "CormorantGaramond-Italic%5Bwght%5D.ttf",
}

FAMILY_FROM, FAMILY_TO = "Cormorant Garamond", "Gourmandique Display"
PS_FROM, PS_TO = "CormorantGaramond", "GourmandiqueDisplay"

# Size of the new accent relative to the capital one, and its gap above the
# x-height in font units (UPM 1000).
SCALE = 0.9
GAP = 70

# Capital letter each accent shape is taken from.
ACCENT_SOURCE = {"acute": "Eacute", "grave": "Egrave", "circumflex": "Ecircumflex"}

# Lowercase letters to redraw, all within the latin subset.
TARGETS = [
    base + accent
    for base in "aeiouy"
    for accent in ("acute", "grave", "circumflex")
    if not (base == "y" and accent != "acute")
]

# Google Fonts' "latin" unicode-range.
LATIN = (
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,"
    "U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,"
    "U+FEFF,U+FFFD"
)
# fontTools' defaults plus the figure styles; the same features Google served.
EXTRA_FEATURES = ["lnum", "pnum", "tnum"]

PHANTOM_POINTS = 4


def contours(glyf, name):
    """The glyph's outline as a list of (points, flags) per contour."""
    coords, ends, flags = glyf[name].getCoordinates(glyf)
    out, start = [], 0
    for end in ends:
        out.append(([tuple(p) for p in coords[start : end + 1]], list(flags[start : end + 1])))
        start = end + 1
    return out


def split_above(glyf, name, y):
    """Split a glyph's contours into those lying wholly above `y` and the rest."""
    above, rest = [], []
    for c in contours(glyf, name):
        (above if min(p[1] for p in c[0]) > y else rest).append(c)
    return rest, above


def bbox(cs):
    xs = [p[0] for pts, _ in cs for p in pts]
    ys = [p[1] for pts, _ in cs for p in pts]
    return min(xs), min(ys), max(xs), max(ys)


def rebuild(font, name):
    """The redrawn outline of `name` at this master: (points, flags, endPts)."""
    glyf = font["glyf"]
    xh, cap = font["OS/2"].sxHeight, font["OS/2"].sCapHeight
    slant = math.tan(math.radians(-font["post"].italicAngle))

    accent = next(a for a in ACCENT_SOURCE if name.endswith(a))
    base, old = split_above(glyf, name, xh + 5)
    _, new = split_above(glyf, ACCENT_SOURCE[accent], cap + 5)
    assert old and new, f"no accent found on {name}"

    # Centre the new accent where the old one was, corrected for the italic
    # slant since the new one sits lower.
    ox0, oy0, ox1, oy1 = bbox(old)
    nx0, ny0, nx1, ny1 = bbox(new)
    new_mid_y = xh + GAP + (ny1 - ny0) * SCALE / 2
    target_x = (ox0 + ox1) / 2 - ((oy0 + oy1) / 2 - new_mid_y) * slant
    src_x = (nx0 + nx1) / 2

    placed = [
        (
            [((x - src_x) * SCALE + target_x, (y - ny0) * SCALE + xh + GAP) for x, y in pts],
            [f & 0x01 for f in flags],  # on-curve bit only
        )
        for pts, flags in new
    ]

    points, flags, ends = [], [], []
    for pts, fl in base + placed:
        points += pts
        flags += fl
        ends.append(len(points) - 1)
    return [(round(x), round(y)) for x, y in points], flags, ends


def origin_and_advance(font, name):
    glyf, hmtx = font["glyf"], font["hmtx"]
    advance, lsb = hmtx[name]
    return glyf[name].xMin - lsb, advance


def patch(font):
    bold = instantiateVariableFont(TTFont(BytesIO(serialize(font))), {"wght": 700})
    glyf, hmtx, gvar = font["glyf"], font["hmtx"], font["gvar"]

    for name in TARGETS:
        origin, advance = origin_and_advance(font, name)
        origin_b, advance_b = origin_and_advance(bold, name)

        points, flags, ends = rebuild(font, name)
        points_b, _, ends_b = rebuild(bold, name)
        assert ends == ends_b, f"{name}: masters disagree on structure"

        glyph = Glyph()
        glyph.numberOfContours = len(ends)
        glyph.coordinates = GlyphCoordinates(points)
        glyph.endPtsOfContours = ends
        glyph.flags = bytearray(flags)
        glyph.program = ttProgram.Program()
        glyph.program.fromBytecode(b"")
        glyph.recalcBounds(glyf)
        glyf[name] = glyph
        hmtx[name] = (advance, glyph.xMin - origin)

        deltas = [(xb - x, yb - y) for (x, y), (xb, yb) in zip(points, points_b)]
        deltas += [
            (origin_b - origin, 0),
            (origin_b + advance_b - origin - advance, 0),
            (0, 0),
            (0, 0),
        ]
        var = TupleVariation({"wght": (0.0, 1.0, 1.0)}, deltas)
        coords, ctrl = glyf._getCoordinatesAndControls(name, hmtx.metrics)
        var.optimize(coords, ctrl.endPts)
        gvar.variations[name] = [var]


def rename(font):
    for record in font["name"].names:
        if record.nameID in (0, 13, 14):  # copyright and licence stay as-is
            continue
        text = record.toUnicode()
        renamed = text.replace(FAMILY_FROM, FAMILY_TO).replace(PS_FROM, PS_TO)
        if renamed != text:
            record.string = renamed
    font["name"].setName(
        "Modified from Cormorant Garamond for Gourmandique: lowercase accents "
        "redrawn with the capital accent shapes.",
        10, 3, 1, 0x409,
    )


def subset_latin(font):
    options = subset.Options()
    options.layout_features += EXTRA_FEATURES
    options.name_IDs = ["*"]
    options.name_legacy = True
    options.notdef_outline = True
    options.glyph_names = False
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=subset.parse_unicodes(LATIN))
    subsetter.subset(font)


def serialize(font):
    buf = BytesIO()
    font.save(buf)
    return buf.getvalue()


def main():
    out_dir = Path(__file__).parent
    for out_name, source in SOURCES.items():
        print(f"{source} -> {out_name}")
        with urllib.request.urlopen(UPSTREAM + source) as res:
            font = TTFont(BytesIO(res.read()))
        patch(font)
        rename(font)
        subset_latin(font)
        font.flavor = "woff2"
        font.save(out_dir / out_name)


if __name__ == "__main__":
    main()
