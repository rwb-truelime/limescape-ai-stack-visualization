# Limescape visual template

Source: [limescape.ai](https://limescape.ai), inspected 19 September 2026.
Colors and typography were read from the live site's `--ls-*` CSS variables
(`/_next/static/chunks/13ne248rbf_95.css`). The logo is the official horizontal
SVG already included in `assets/limescape.svg`.

## Palette

| Role | Color | Use in this project |
| --- | --- | --- |
| Brand charcoal | `#272F3C` | Headings, text, primary controls |
| Brand lime | `#8CBE26` | Active indicators, fine accents |
| Page neutral | `#F3F3F3` | Stage and secondary surfaces |
| White | `#FFFFFF` | Header, information panel, cards |
| Border neutral | `#E0E2E3` | Quiet separation (derived neutral) |
| Muted text | `#60656B` | Secondary copy (derived neutral) |
| Dark lime | `#456515` | Readable accent text on light surfaces (derived) |
| Brand orange | `#F59A38` | Original logo; inspiration for the sand model tint |
| Brand pink | `#E72679` | Original logo; inspiration for the rose model tint |

Keep the interface predominantly neutral, with lime accents on controls. The
pyramid uses lighter, low-saturation interpretations of the brand palette, with
solid colors and natural 3D shading rather than multicolor gradients. The
Limescape logo retains its original colors.

### Pyramid tints (foundation → tip)

These are derived visualization colors, not additional official brand colors.

| Layer | Tint | Color |
| --- | --- | --- |
| 01 Goed geregeld | Soft slate | `#8996A4` |
| 02 Jouw omgeving | Sage | `#A6BBA0` |
| 03 Jouw kennis | Warm sand | `#DFBD91` |
| 04 Inzicht & verantwoording | Dusty rose | `#D7A3B5` |
| 05 Jouw werk | Soft lime | `#B2CB70` |

Slate anchors the model without a dark base. Sage and soft lime echo the brand
green; sand and dusty rose soften the logo's orange and pink. The brighter lime
tip keeps the application layer recognizable. Check these colors under the 3D
lighting as well as in the flat SVG fallback.

Use charcoal text on lime, rather than white small text. Focus outlines use the
darker lime token. Selection also has a border/indicator and `aria-pressed`, so
color is not the only signal.

## Typography and implementation

The website specifies **Poppins** for headings/body and **Inter** for UI. This
compact interactive viewer uses Poppins headings and Inter for readable body
copy and controls. Google Fonts supplies these fonts; system fonts remain the
fallback when offline.

`theme.css` is the reusable color template. The model reads its five layer
colors from those same CSS properties for both 3D and 2D rendering. The other
stylesheets handle layout and components.

## Layer order (foundation → tip)

1. Goed geregeld
2. Jouw omgeving
3. Jouw kennis
4. Inzicht & verantwoording
5. Jouw werk
