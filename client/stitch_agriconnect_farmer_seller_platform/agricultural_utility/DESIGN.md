---
name: Agricultural Utility
colors:
  surface: '#f8faf8'
  surface-dim: '#d8dad9'
  surface-bright: '#f8faf8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f2'
  surface-container: '#eceeec'
  surface-container-high: '#e6e9e7'
  surface-container-highest: '#e1e3e1'
  on-surface: '#191c1b'
  on-surface-variant: '#434843'
  inverse-surface: '#2e3130'
  inverse-on-surface: '#eff1ef'
  outline: '#737973'
  outline-variant: '#c3c8c1'
  surface-tint: '#4d6453'
  primary: '#061b0e'
  on-primary: '#ffffff'
  primary-container: '#1b3022'
  on-primary-container: '#819986'
  inverse-primary: '#b4cdb8'
  secondary: '#56642b'
  on-secondary: '#ffffff'
  secondary-container: '#d6e7a1'
  on-secondary-container: '#5a682f'
  tertiary: '#291007'
  on-tertiary: '#ffffff'
  tertiary-container: '#41241a'
  on-tertiary-container: '#b3897a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d0e9d4'
  primary-fixed-dim: '#b4cdb8'
  on-primary-fixed: '#0b2013'
  on-primary-fixed-variant: '#364c3c'
  secondary-fixed: '#d9eaa3'
  secondary-fixed-dim: '#bdce89'
  on-secondary-fixed: '#161f00'
  on-secondary-fixed-variant: '#3e4c16'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ebbcac'
  on-tertiary-fixed: '#2e150b'
  on-tertiary-fixed-variant: '#603f33'
  background: '#f8faf8'
  on-background: '#191c1b'
  surface-variant: '#e1e3e1'
typography:
  display:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  container-padding: 20px
  gutter: 16px
---

## Brand & Style

The brand personality for this design system is rooted in **Agricultural Utility**: a blend of high-efficiency digital tools and the organic reliability of nature. It aims to evoke a sense of calm confidence for farmers and stakeholders who require immediate, legible data in varying outdoor conditions.

The visual style utilizes a **Polished Wireframe** approach. This involves using crisp 1px strokes, generous whitespace, and a strict structural grid to create a layout that feels intentional and "engineered." By stripping away heavy gradients and complex textures, the system prioritizes high contrast and cognitive clarity for non-technical users, ensuring the product feels like a professional tool rather than a social distraction.

## Colors

The color palette is inspired by the lifecycle of a crop. 

*   **Primary (Deep Forest Green):** Used for primary actions and brand anchoring. It conveys depth and stability.
*   **Secondary (Soft Sage):** Used for secondary buttons and subtle background containers to reduce visual fatigue.
*   **Tertiary (Earthy Brown):** Reserved for meaningful accents, such as soil-related data or specific category icons.
*   **Neutral (Off-White/Slate):** Light mode uses a "Paper White" (#F9FBF9) to reduce glare in sunlight. Dark mode transitions to a "Slate Carbon" palette to maintain readability in low-light environments.

**Accessibility Note:** All text-on-background combinations must meet WCAG AA standards. Semantic colors for status (Pending/Accepted/Rejected) are paired with distinct icons to ensure usability for color-blind users.

## Typography

This design system utilizes **Public Sans** for its institutional clarity and exceptional readability on mobile screens. As a typeface designed for accessibility, it ensures that technical agricultural data is legible even at small sizes or under direct sunlight.

*   **Display & Headlines:** Use tighter letter spacing and heavier weights to create a strong visual hierarchy.
*   **Body Text:** Set with a generous line height (1.5x - 1.6x) to facilitate scanning of long-form reports or logistics data.
*   **Labels:** Small caps are used for metadata and category tags to differentiate them from actionable body text.

## Layout & Spacing

The layout follows a **Fluid Mobile-First Grid** system. 

*   **Grid:** A 4-column grid for mobile devices, expanding to 12 columns for desktop viewports.
*   **Rhythm:** An 8px linear scale is used for all padding and margins to maintain a strict, mathematical rhythm consistent with the "wireframe" aesthetic.
*   **Safe Areas:** A minimum 20px container padding is enforced on mobile to prevent content from hitting the edges of the screen, ensuring comfortable thumb-tap zones.

## Elevation & Depth

To maintain the clean, low-fidelity wireframe feel, this design system avoids heavy, blurry shadows. Instead, it uses **Low-Contrast Outlines** and **Tonal Layering**:

1.  **Level 0 (Background):** The base canvas color.
2.  **Level 1 (Cards/Surface):** White (light mode) or Slate-Gray (dark mode) with a 1px border (#E2E8F0 in light, #2D3748 in dark).
3.  **Level 2 (Active/Floating):** Use a very subtle, "tight" shadow (0px 2px 4px rgba(0,0,0,0.05)) only for elements that require immediate user attention or interaction, such as bottom sheets or active modals.

This approach keeps the interface flat and efficient, mimicking the look of printed agricultural charts.

## Shapes

The shape language is **Soft and Geometric**. 

By using a `0.25rem` (4px) base radius, the UI maintains a professional, "tool-like" appearance without feeling overly playful or clinical. 
*   **Buttons:** Use the standard `rounded` (4px) for a crisp look.
*   **Cards:** Use `rounded-lg` (8px) to create a clear container distinction.
*   **Status Indicators:** Use `rounded-pill` for chips to differentiate them from interactive buttons.

## Components

### Buttons
*   **Primary:** Large (min-height 56px), Deep Forest Green background, White text. Bold weight.
*   **Secondary:** 1px Forest Green border, Sage-tinted background (5% opacity), Forest Green text.
*   **Tap Targets:** Every button must maintain a minimum 44x44px touch area.

### Dashboard Cards
*   White background with a 1px soft border. 
*   No heavy shadows; use a subtle inset 4px accent bar on the left side of the card using the primary or semantic color to indicate category or status.

### Status Indicators
*   Small, pill-shaped chips with high-contrast text. 
*   Use background tints: Pending (Light Amber), Accepted (Light Mint), Rejected (Light Rose).

### Inputs
*   Rectangular fields with 1px borders. 
*   Labels are always visible (not floating) above the input field for maximum accessibility.
*   Focus state: 2px Deep Forest Green border.

### Bottom Navigation
*   Fixed to the bottom of the viewport.
*   Utilizes a blurred background (Glassmorphism) or solid Slate to stay distinct from page content.
*   Active state indicated by a top-border accent and the primary color icon.

### Progress Gauges
*   Simple, thick-stroke circular or linear indicators to show crop cycles or moisture levels, using the Earthy Brown or Forest Green colors.