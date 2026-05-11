---
name: Agri-Utility System
colors:
  surface: '#fdf7ff'
  surface-dim: '#ded8e0'
  surface-bright: '#fdf7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f2fa'
  surface-container: '#f2ecf4'
  surface-container-high: '#ece6ee'
  surface-container-highest: '#e6e0e9'
  on-surface: '#1d1b20'
  on-surface-variant: '#494551'
  inverse-surface: '#322f35'
  inverse-on-surface: '#f5eff7'
  outline: '#7a7582'
  outline-variant: '#cbc4d2'
  surface-tint: '#6750a4'
  primary: '#4f378a'
  on-primary: '#ffffff'
  primary-container: '#6750a4'
  on-primary-container: '#e0d2ff'
  inverse-primary: '#cfbcff'
  secondary: '#63597c'
  on-secondary: '#ffffff'
  secondary-container: '#e1d4fd'
  on-secondary-container: '#645a7d'
  tertiary: '#765b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c9a74d'
  on-tertiary-container: '#503d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbcff'
  on-primary-fixed: '#22005d'
  on-primary-fixed-variant: '#4f378a'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#cdc0e9'
  on-secondary-fixed: '#1f1635'
  on-secondary-fixed-variant: '#4b4263'
  tertiary-fixed: '#ffdf93'
  tertiary-fixed-dim: '#e7c365'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#fdf7ff'
  on-background: '#1d1b20'
  surface-variant: '#e6e0e9'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-max: 1280px
---

## Brand & Style

The design system is rooted in a **Minimalist-Corporate** aesthetic, tailored for the agricultural sector. It prioritizes clarity and utility, ensuring that complex logistical data is easily digestible for two primary user groups: Farmers and Sellers. 

The brand personality is grounded, reliable, and precise. By utilizing generous white space and high-quality typography, the interface moves away from the cluttered "industrial" look often found in ag-tech, instead offering a sophisticated dashboard experience. The distinction between user roles is achieved through subtle but consistent color-theming, ensuring that users always feel oriented within their specific workflow while maintaining a unified product identity.

## Colors

The palette is bifurcated to signal user context. 

- **Farmer Flow:** Utilizes **Deep Green (#1B3022)** for structural elements and navigation, paired with **Emerald Green (#10B981)** for interaction states. This evokes growth and agricultural heritage.
- **Seller Flow:** Utilizes **Professional Slate (#1E293B)** and a **Neutral palette**, conveying commerce, stability, and institutional trust.

**Status Tokens:** 
- **Pending:** Amber is used to signal a state of transition without urgency.
- **Accepted:** Emerald is used to denote successful completion or validation.
- **Rejected:** Rose/Red is reserved for errors or declined transactions.
- **Verified:** A specific Bright Blue is used exclusively for the "Verified" badge to differentiate it from action-oriented status chips.

## Typography

This design system uses a combination of **Manrope** for headlines and **Inter** for body and UI elements. 

- **Manrope** provides a modern, balanced geometric feel for large data points and page headers. 
- **Inter** is used for its exceptional readability in dense data tables and forms. 
- **Labels** and small metadata should use `label-caps` to provide clear hierarchy in status chips and badges without consuming excessive vertical space.

## Layout & Spacing

The layout follows a **Fixed Grid** model on desktop and a **Fluid** model on mobile. 
- **Grid:** A 12-column grid with a 24px gutter is used for the main dashboard content.
- **Margins:** Standard page margins are 48px on large screens and 16px on mobile.
- **Rhythm:** An 8px linear scale (referenced as units of 4px) ensures vertical rhythm. Elements are spaced primarily in increments of 16px (md) and 24px (lg) to maintain the minimal, airy aesthetic.

## Elevation & Depth

This design system utilizes **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows. 
- **Surface 0:** The main background (#F8FAFC) is used as the base.
- **Surface 1:** Main cards and content containers use #FFFFFF with a 1px border (#E2E8F0).
- **Elevation:** A singular, very soft shadow (0px 4px 20px rgba(0,0,0,0.05)) is used only for floating elements like dropdowns, modals, or active hover states on cards.
- **Empty States:** Use a light grey fill for illustrations with no stroke, ensuring they feel "sunken" and secondary to the active UI.

## Shapes

The shape language is **Rounded (Level 2)**. 
- **Cards/Buttons:** 0.5rem (8px) corner radius.
- **Status Chips:** Full pill-shaped radius for distinct visual separation from actionable buttons.
- **Verified Badge:** A slightly tighter radius (4px) or a circular icon format to signal "seal of quality" rather than a clickable chip.
- **Input Fields:** Consistent 8px radius to match buttons, creating a unified form-factor.

## Components

### Buttons & Inputs
Buttons use the role-based primary colors. Farmers see Deep Green buttons; Sellers see Slate buttons. Inputs use #FFFFFF backgrounds with #E2E8F0 borders, shifting to the role-specific accent color on focus.

### Status Chips
Status chips are small, pill-shaped elements with a light background and dark text (e.g., Pending uses an Amber-50 background with Amber-900 text).
- **Pending:** Amber
- **Accepted:** Emerald
- **Rejected:** Rose

### Verified Badge
The "Verified" badge is a special component. It features a checkmark icon inside a circular blue container. In list views, it is a small icon; on profile pages, it is a blue badge with white text.

### Empty States
Empty states consist of a centered layout featuring a 120px tall illustration in a monochrome neutral palette. Use a `headline-md` for the title and `body-sm` for the descriptive text, always followed by a primary "Call to Action" button to guide the user back into the flow.

### Lists & Data Tables
Tables use a flat design. Rows are separated by 1px borders (#E2E8F0). The header row uses a light gray background (#F8FAFC) with `label-caps` typography for column titles.