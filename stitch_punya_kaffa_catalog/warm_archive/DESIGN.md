---
name: Warm Archive
colors:
  surface: '#fff8f6'
  surface-dim: '#e8d6d2'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0ed'
  surface-container: '#fdeae6'
  surface-container-high: '#f7e4e0'
  surface-container-highest: '#f1dfda'
  on-surface: '#231917'
  on-surface-variant: '#56423e'
  inverse-surface: '#392e2b'
  inverse-on-surface: '#ffede9'
  outline: '#89726d'
  outline-variant: '#dcc0ba'
  surface-tint: '#9c422d'
  primary: '#99402b'
  on-primary: '#ffffff'
  primary-container: '#b95841'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4a3'
  secondary: '#006878'
  on-secondary: '#ffffff'
  secondary-container: '#9eebfe'
  on-secondary-container: '#0a6c7d'
  tertiary: '#00685e'
  on-tertiary: '#ffffff'
  tertiary-container: '#008376'
  on-tertiary-container: '#f4fffb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad2'
  primary-fixed-dim: '#ffb4a3'
  on-primary-fixed: '#3d0600'
  on-primary-fixed-variant: '#7d2c19'
  secondary-fixed: '#a7edff'
  secondary-fixed-dim: '#85d2e4'
  on-secondary-fixed: '#001f25'
  on-secondary-fixed-variant: '#004e5b'
  tertiary-fixed: '#8ef4e4'
  tertiary-fixed-dim: '#72d8c8'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005048'
  background: '#fff8f6'
  on-background: '#231917'
  surface-variant: '#f1dfda'
typography:
  h1:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  h2:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  h3:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  metadata:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  label:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2.5rem
  xl: 4rem
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
---

## Brand & Style

The design system is built on the concept of a **Digital Scrapbook**. It prioritizes warmth, nostalgia, and personal connection over clinical efficiency. The interface should feel like a curated physical album—intentional, slightly tactile, and deeply human.

The style is **Soft Minimalist with Tactile Accents**. It utilizes high-quality typography and a warm, off-white foundation to create a sense of heritage. The "scrapbook" feel is achieved through subtle imperfections: slight rotations on image containers, variable border radii, and a palette that evokes natural materials like paper, terracotta, and aged ink. 

Target emotions:
- **Nostalgia:** Evoked through high-contrast serif headings and warm tones.
- **Security:** Established through clean, modern body typography and organized metadata.
- **Joy:** Infused through playful, organic shapes and secondary pops of teal.

## Colors

The color palette is grounded in earth tones to reinforce the "archive" and "family" narrative. 

- **Primary (Terra Cotta):** Used for main actions, brand identity, and highlighted categories. It provides a sense of warmth and clay-like permanence.
- **Secondary (Teal):** Used for navigation, links, and accents to provide a cool, calming contrast to the terracotta.
- **Neutral System:** The background uses a warm off-white (light mode) or a deep charcoal-brown (dark mode) instead of pure gray, maintaining the organic feel.

In dark mode, saturation is slightly lowered, and lightness is increased on functional colors to ensure AA accessibility against the darkened surface.

## Typography

This system uses a three-family type hierarchy to balance emotion and utility:

1.  **Display (Playfair Display):** Used for headlines and story titles. Its high contrast and elegant serifs evoke the feeling of a classic storybook or handwritten journal.
2.  **Body (Plus Jakarta Sans):** Used for descriptions, notes, and general interface text. It is highly legible and modern, preventing the design from feeling dated.
3.  **Metadata (JetBrains Mono):** Used exclusively for technical data—dates, weights, prices, or archival IDs. The monospaced nature suggests "cataloging" and "logging," differentiating facts from stories.

Apply `body-lg` for personal notes and long-form memories to enhance readability.

## Layout & Spacing

The layout follows a **Hybrid Fluid Grid** system. While the structure is organized, content placement should feel airy and uncrowded.

- **Desktop:** 12-column grid with wide margins (40px) to center the content like a page in an album.
- **Mobile:** Single column with 16px side margins. 
- **Vertical Rhythm:** Use larger spacing (`xl`) between distinct archival sections (e.g., "Year 1" vs "Year 2") and tighter spacing (`md`) within item details.

**Signature Layout Rule:** Image-heavy grids should avoid perfect alignment. Use a "masonry" feel where possible, or apply the rotation tokens defined in the Components section to break the digital grid.

## Elevation & Depth

This system avoids heavy shadows in favor of **Tonal Layering** and **Soft Placements**.

- **Level 0 (Background):** The warm off-white `background` token.
- **Level 1 (Cards):** The `surface` token. Instead of a traditional shadow, cards use a very thin, low-opacity border (Primary color at 10% opacity) to define edges.
- **Level 2 (Modals/Overlays):** These use a soft, diffused shadow: `0 10px 25px -5px oklch(18% 0.025 60 / 0.1)`.
- **The "Tape" Effect:** For special featured items, use a decorative semi-transparent overlay at the top of the card to mimic "washi tape," reinforcing the physical archive metaphor.

## Shapes

The shape language is **Soft and Imperfect**. 

- **General UI:** Standard components (buttons, inputs) use a consistent `0.5rem` (rounded-md) radius.
- **Scrapbook Cards:** Use `rounded-lg` (1rem). To enhance the hand-made feel, photos inside cards should have a custom CSS `border-radius` that is slightly uneven (e.g., `95% 4% 92% 5% / 4% 95% 6% 95%`) and a random rotation between `-1.5deg` and `+1.5deg`.
- **Interactive Elements:** Buttons should feel "squishy" and tactile. Avoid sharp corners at all costs.

## Components

### Buttons
- **Primary:** Filled with `primary` token, white text. Uses a subtle "pressed" animation that scales the button to 97%.
- **Secondary:** Outlined with `secondary` token. 
- **Shape:** Rounded-md (8px).

### Scrapbook Cards
- **Background:** `surface` oklch token.
- **Image:** Contained within the card with a white border (mimicking a Polaroid or printed photo). Apply the `rotation_variance`.
- **Content:** Headline in `h3`, date/metadata in `metadata` (JetBrains Mono) at the bottom right.

### Input Fields
- **Style:** Minimalist. Only a bottom border in the `foreground` color at 20% opacity, which becomes the `primary` color on focus.
- **Typography:** Placeholder text in `body-md` with 50% opacity.

### Chips & Tags
- **Style:** Pill-shaped (`rounded-full`). 
- **Color:** Use `secondary` at 10% opacity for the background and 100% opacity for the text.

### Navigation
- Top navigation should be transparent until scroll, then blur the `background` token. Links use `label` typography with a `primary` underline on the active state.

### Lists
- For archival lists, use a "timeline" style with a vertical dotted line in the `primary` color connecting entries.