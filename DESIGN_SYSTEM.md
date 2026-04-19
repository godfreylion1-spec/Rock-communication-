# ROCK Design System

## Brand Identity

**ROCK** is a premium, futuristic social messaging platform. The visual identity evokes power, elegance, and immersion through a seamless digital experience.

### Logo
- **Emblem:** Scorpion + Mountain merged into a single cohesive symbol
- **Asset:** `/home/ubuntu/webdev-static-assets/rock-logo.png`
- **CDN URL (Compressed):** `https://d2xsxph8kpxj0f.cloudfront.net/310519663511834075/jPScNeMjT9vs9LvfPjZ6L5/rock-logo-eD5RD45fkdG6XSNbEFG8RH.webp`
- **CDN URL (Original):** `https://d2xsxph8kpxj0f.cloudfront.net/310519663511834075/jPScNeMjT9vs9LvfPjZ6L5/rock-logo-dme3iUGg79pS2CiQnxJRHk.png`
- **Usage:** App header, splash screen, favicon, brand touchpoints

---

## Color Palette

### Primary Gradient
- **Start:** Deep Violet (`#4B0082` / `#6B1B9A`)
- **End:** Vibrant Teal (`#00CED1` / `#00BCD4`)
- **Direction:** Top-left to bottom-right for atmospheric depth

### Semantic Colors
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Background | Deep Violet | `#0F0F1E` | Primary app background |
| Surface | Dark Navy | `#1A1A2E` | Cards, panels, modals |
| Primary | Vibrant Teal | `#00CED1` | Buttons, links, accents |
| Secondary | Soft Purple | `#7C3AED` | Secondary actions |
| Success | Emerald Green | `#10B981` | Confirmations, online status |
| Error | Coral Red | `#EF4444` | Errors, destructive actions |
| Warning | Amber | `#F59E0B` | Warnings, cautions |
| Foreground | White | `#FFFFFF` | Primary text |
| Muted | Light Gray | `#9CA3AF` | Secondary text, disabled |

### Gradient Backgrounds
- **Hero Gradient:** `linear-gradient(135deg, #4B0082 0%, #00CED1 100%)`
- **Card Gradient:** `linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)`
- **Accent Gradient:** `linear-gradient(135deg, #7C3AED 0%, #00CED1 100%)`

---

## Typography

### Font Family
- **Primary:** Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- **Monospace:** Fira Code, Courier New, monospace

### Type Scale
| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| H1 | 48px | 700 (Bold) | 1.2 | Page titles, hero headlines |
| H2 | 36px | 700 (Bold) | 1.3 | Section headers |
| H3 | 28px | 600 (SemiBold) | 1.4 | Subsection headers |
| H4 | 24px | 600 (SemiBold) | 1.4 | Card titles |
| Body Large | 18px | 400 (Regular) | 1.6 | Large body text |
| Body | 16px | 400 (Regular) | 1.6 | Standard body text |
| Body Small | 14px | 400 (Regular) | 1.5 | Secondary text |
| Label | 12px | 600 (SemiBold) | 1.4 | Labels, badges |
| Caption | 12px | 400 (Regular) | 1.4 | Captions, hints |

### Text Hierarchy
- **Bold, Oversized (Bottom-Left):** Primary headlines and CTAs for strong visual impact
- **Delicate, Minimalist (Upper-Right):** Subtitles, secondary information, and supporting text
- **Generous Negative Space:** Asymmetric positioning creates calm, futuristic elegance

---

## Spacing System

| Scale | Value | Usage |
|-------|-------|-------|
| xs | 4px | Micro spacing, icon gaps |
| sm | 8px | Component padding, small gaps |
| md | 16px | Standard padding, section gaps |
| lg | 24px | Large padding, section spacing |
| xl | 32px | Extra large spacing, major sections |
| 2xl | 48px | Page-level spacing |
| 3xl | 64px | Hero sections |

---

## Shadows & Depth

### Shadow System
- **Subtle:** `0 1px 2px rgba(0, 0, 0, 0.05)`
- **Small:** `0 4px 6px rgba(0, 0, 0, 0.1)`
- **Medium:** `0 10px 15px rgba(0, 0, 0, 0.15)`
- **Large:** `0 20px 25px rgba(0, 0, 0, 0.2)`
- **Glow:** `0 0 20px rgba(0, 206, 209, 0.3)` (Teal glow for interactive elements)

### Elevation Levels
- **Level 1 (Raised):** Small shadow for cards, buttons
- **Level 2 (Floating):** Medium shadow for modals, popovers
- **Level 3 (Overlay):** Large shadow for full-page overlays

---

## Border Radius

| Scale | Value | Usage |
|-------|-------|-------|
| None | 0px | Sharp edges (rare) |
| sm | 4px | Small components, inputs |
| md | 8px | Standard components |
| lg | 12px | Cards, panels |
| xl | 16px | Large containers |
| Full | 9999px | Avatars, badges, pills |

---

## Interactive States

### Button States
- **Default:** Teal background, white text
- **Hover:** Lighter teal, elevated shadow
- **Active:** Darker teal, inset shadow
- **Disabled:** Gray background, muted text, no interaction

### Input States
- **Default:** Dark surface, light border
- **Focus:** Teal border, glow shadow
- **Error:** Red border, error text
- **Disabled:** Muted background, disabled text

### Hover Effects
- **Subtle Scale:** `transform: scale(1.02)`
- **Glow Effect:** Teal shadow on interactive elements
- **Transition:** `all 200ms cubic-bezier(0.4, 0, 0.2, 1)`

---

## Layout Principles

### Asymmetric Design
- **Bold Headlines:** Bottom-left positioning for strong visual anchor
- **Subtle Subtitles:** Upper-right positioning for balance
- **Generous Whitespace:** Creates calm, premium feel
- **Grid System:** 12-column responsive grid with 16px gutter

### Responsive Breakpoints
| Breakpoint | Width | Usage |
|------------|-------|-------|
| Mobile | 320px - 640px | Small phones, compact layouts |
| Tablet | 641px - 1024px | Tablets, landscape phones |
| Desktop | 1025px+ | Full desktop experience |

---

## Animation & Motion

### Transition Timing
- **Fast:** 150ms (micro-interactions, hover states)
- **Standard:** 200ms (UI transitions, modal opens)
- **Slow:** 300ms (page transitions, complex animations)

### Easing Functions
- **Ease In:** `cubic-bezier(0.4, 0, 1, 1)` (Deceleration)
- **Ease Out:** `cubic-bezier(0, 0, 0.2, 1)` (Acceleration)
- **Ease In-Out:** `cubic-bezier(0.4, 0, 0.2, 1)` (Smooth, natural)

### Common Animations
- **Fade In:** Opacity 0 → 1 (200ms ease-out)
- **Slide Up:** Transform translateY(20px) → 0 (200ms ease-out)
- **Scale In:** Transform scale(0.95) → 1 (200ms ease-out)
- **Pulse:** Opacity pulse for notifications (1s infinite)

---

## Accessibility

### Color Contrast
- **AA Standard:** Minimum 4.5:1 for normal text, 3:1 for large text
- **AAA Standard:** Minimum 7:1 for normal text, 4.5:1 for large text
- **Teal on Dark Background:** High contrast for readability

### Focus States
- **Visible Focus Ring:** 2px teal outline with 2px offset
- **Keyboard Navigation:** All interactive elements must be keyboard accessible
- **ARIA Labels:** Semantic HTML with proper ARIA attributes

### Motion Preferences
- **Respect `prefers-reduced-motion`:** Disable animations for users with motion sensitivity
- **Meaningful Motion Only:** Animations should enhance UX, not distract

---

## Component Guidelines

### Buttons
- **Primary:** Teal background, white text, full width on mobile
- **Secondary:** Purple background, white text
- **Outline:** Transparent background, teal border, teal text
- **Ghost:** No background, teal text, hover background

### Cards
- **Background:** Dark navy with subtle gradient
- **Border:** Optional 1px light border for definition
- **Padding:** 16px - 24px depending on content
- **Shadow:** Small to medium elevation

### Input Fields
- **Background:** Slightly lighter than surface
- **Border:** 1px light gray, teal on focus
- **Padding:** 12px 16px for standard size
- **Placeholder:** Muted gray text

### Modals & Overlays
- **Backdrop:** Semi-transparent dark with blur effect
- **Modal:** Centered, max-width 500px on desktop
- **Animation:** Fade in + scale up (200ms)

---

## Brand Voice & Tone

- **Premium:** Sophisticated, high-quality, exclusive
- **Futuristic:** Modern, innovative, forward-thinking
- **Elegant:** Refined, minimalist, intentional
- **Immersive:** Engaging, seamless, intuitive
- **Powerful:** Confident, capable, reliable

---

## Implementation Notes

1. **CSS Variables:** All colors, spacing, and shadows are defined as CSS variables in `client/src/index.css`
2. **Tailwind Integration:** Tailwind 4 with custom theme configuration for ROCK brand colors
3. **Dark Mode Default:** App launches in dark mode by default (violet-to-teal gradient background)
4. **Logo Integration:** Use CDN URLs for logo across all touchpoints (header, splash, favicon)
5. **Responsive Design:** Mobile-first approach with progressive enhancement for larger screens
6. **Performance:** Optimize images, use WebP compression, lazy-load non-critical assets

---

## Version History

- **v1.0** (2026-04-18): Initial design system with ROCK brand identity, color palette, typography, and component guidelines
