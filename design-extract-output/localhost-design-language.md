# Design Language: - Burdur Adliye Portal

> Extracted from `https://localhost:7023/KisitliKisiBilgileri/Details/105` on June 9, 2026
> 155 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#0d6efd` | rgb(13, 110, 253) | hsl(216, 98%, 52%) | 6 |
| Secondary | `#ffc107` | rgb(255, 193, 7) | hsl(45, 100%, 51%) | 1 |
| Accent | `#0dcaf0` | rgb(13, 202, 240) | hsl(190, 90%, 50%) | 1 |

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#2d3748` | hsl(218, 23%, 23%) | 79 |
| `#ffffff` | hsl(0, 0%, 100%) | 60 |
| `#212529` | hsl(210, 11%, 15%) | 46 |
| `#000000` | hsl(0, 0%, 0%) | 37 |
| `#64748b` | hsl(215, 16%, 47%) | 10 |
| `#6c757d` | hsl(208, 7%, 46%) | 8 |
| `#4f5d78` | hsl(220, 21%, 39%) | 4 |

### Background Colors

Used on large-area elements: `#f8f9fa`, `#ffffff`, `#f1f5f9`

### Text Colors

Text color palette: `#000000`, `#2d3748`, `#2c3e50`, `#34495e`, `#212529`, `#0d6efd`, `#ffffff`, `#1e293b`, `#64748b`, `#4f5d78`

### Gradients

```css
background-image: linear-gradient(135deg, rgb(172, 175, 233), rgb(115, 85, 176));
```

```css
background-image: linear-gradient(135deg, rgb(99, 102, 241), rgb(79, 70, 229));
```

```css
background-image: linear-gradient(135deg, rgb(23, 162, 184), rgb(19, 132, 150));
```

```css
background-image: linear-gradient(135deg, rgb(40, 167, 69), rgb(32, 160, 57));
```

```css
background-image: linear-gradient(135deg, rgb(255, 193, 7), rgb(224, 168, 0));
```

```css
background-image: linear-gradient(135deg, rgb(220, 53, 69), rgb(200, 35, 51));
```

```css
background-image: linear-gradient(135deg, rgb(0, 123, 255), rgb(0, 86, 179));
```

```css
background-image: linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162));
```

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#2d3748` | text, border | 79 |
| `#ffffff` | background, text, border | 60 |
| `#212529` | text, border | 46 |
| `#000000` | text, border | 37 |
| `#1e293b` | text, border | 35 |
| `#34495e` | text, border | 32 |
| `#64748b` | text, border | 10 |
| `#6c757d` | text, border | 8 |
| `#0d6efd` | text, border, background | 6 |
| `#e2e8f0` | border | 6 |
| `#dc3545` | background, text, border | 5 |
| `#4f5d78` | text, border | 4 |
| `#0dcaf0` | background | 1 |
| `#198754` | background | 1 |
| `#ffc107` | background | 1 |
| `#21417a` | border | 1 |

## Typography

### Font Families

- **Inter** — used for all (152 elements)
- **Segoe UI** — used for all (2 elements)

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 30.4px | 1.9rem | 700 | 36.48px | normal | h2 |
| 24px | 1.5rem | 700 | 28.8px | normal | h3 |
| 20px | 1.25rem | 600 | 32px | normal | a, i, button, span |
| 19.2px | 1.2rem | 600 | 28.8px | normal | h5, i |
| 18px | 1.125rem | 400 | 28.8px | normal | i |
| 17.6px | 1.1rem | 400 | 28.16px | normal | span, i, button |
| 16px | 1rem | 400 | normal | normal | html, head, meta, title |
| 15.2px | 0.95rem | 700 | 22.8px | normal | button, i |
| 15px | 0.9375rem | 600 | 18px | normal | h6 |
| 14.4px | 0.9rem | 700 | 23.04px | 1px | div, i |
| 14px | 0.875rem | 400 | 22.4px | normal | p |
| 13.6px | 0.85rem | 400 | 21.76px | normal | div, i, label |
| 13px | 0.8125rem | 400 | 16.9px | normal | small |
| 12px | 0.75rem | 400 | 19.2px | normal | div, span |
| 10px | 0.625rem | 600 | 16px | 1px | span |

### Heading Scale

```css
h2 { font-size: 30.4px; font-weight: 700; line-height: 36.48px; }
h3 { font-size: 24px; font-weight: 700; line-height: 28.8px; }
h5 { font-size: 20px; font-weight: 600; line-height: 32px; }
h5 { font-size: 19.2px; font-weight: 600; line-height: 28.8px; }
h6 { font-size: 15px; font-weight: 600; line-height: 18px; }
```

### Body Text

```css
body { font-size: 16px; font-weight: 400; line-height: normal; }
```

### Font Weights in Use

`400` (119x), `500` (17x), `600` (12x), `700` (6x), `300` (1x)

## Spacing

**Base unit:** 2px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-2 | 2px | 0.125rem |
| spacing-12 | 12px | 0.75rem |
| spacing-24 | 24px | 1.5rem |
| spacing-28 | 28px | 1.75rem |
| spacing-32 | 32px | 2rem |
| spacing-40 | 40px | 2.5rem |
| spacing-70 | 70px | 4.375rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| md | 6px | 4 |
| md | 10px | 8 |
| lg | 16px | 1 |

## Box Shadows

**sm** — blur: 0px
```css
box-shadow: rgba(102, 126, 234, 0.15) 0px 0px 0px 4px;
```

**sm** — blur: 4px
```css
box-shadow: rgba(0, 0, 0, 0.075) 0px 2px 4px 0px;
```

**md** — blur: 12px
```css
box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px 0px;
```

**xl** — blur: 50px
```css
box-shadow: rgba(0, 0, 0, 0.1) -10px 0px 50px 0px;
```

**xl** — blur: 60px
```css
box-shadow: rgba(102, 126, 234, 0.08) 0px 25px 60px 0px;
```

## CSS Custom Properties

### Colors

```css
--primary-color: #6366f1;
--primary-hover: #4f46e5;
--secondary-color: #f1f5f9;
--text-primary: #1e293b;
--text-secondary: #64748b;
--border-color: #e2e8f0;
--primary: #21417a;
--primary-light: #3d6a9e;
--bg-light: #EEF4FB;
--bs-link-hover-color-rgb: 10,88,202;
--bs-warning-bg-subtle: #fff3cd;
--bs-border-style: solid;
--bs-primary: #0d6efd;
--bs-border-radius-2xl: 2rem;
--bs-code-color: #d63384;
--bs-light-bg-subtle: #fcfcfd;
--bs-primary-border-subtle: #9ec5fe;
--bs-link-hover-color: #0a58ca;
--bs-primary-text-emphasis: #052c65;
--bs-border-radius-sm: 0.25rem;
--bs-primary-bg-subtle: #cfe2ff;
--bs-border-radius: 0.375rem;
--bs-body-bg-rgb: 255,255,255;
--bs-border-radius-xxl: 2rem;
--bs-success-bg-subtle: #d1e7dd;
--bs-link-color-rgb: 13,110,253;
--bs-secondary-bg-subtle: #e2e3e5;
--bs-border-radius-lg: 0.5rem;
--bs-primary-rgb: 13,110,253;
--bs-info-border-subtle: #9eeaf9;
--bs-success-border-subtle: #a3cfbb;
--bs-secondary-text-emphasis: #2b2f32;
--bs-focus-ring-color: rgba(13, 110, 253, 0.25);
--bs-border-color: #dee2e6;
--bs-warning-border-subtle: #ffe69c;
--bs-secondary-color-rgb: 33,37,41;
--bs-info-bg-subtle: #cff4fc;
--bs-emphasis-color: #000;
--bs-form-invalid-color: #dc3545;
--bs-light-border-subtle: #e9ecef;
--bs-secondary-color: rgba(33, 37, 41, 0.75);
--bs-body-color-rgb: 33,37,41;
--bs-border-radius-xl: 1rem;
--bs-tertiary-color: rgba(33, 37, 41, 0.5);
--bs-dark-bg-subtle: #ced4da;
--bs-border-width: 1px;
--bs-danger-bg-subtle: #f8d7da;
--bs-secondary-bg: #e9ecef;
--bs-secondary: #6c757d;
--bs-danger-border-subtle: #f1aeb5;
--bs-form-valid-color: #198754;
--bs-secondary-rgb: 108,117,125;
--bs-heading-color: ;
--bs-tertiary-color-rgb: 33,37,41;
--bs-highlight-bg: #fff3cd;
--bs-focus-ring-opacity: 0.25;
--bs-secondary-border-subtle: #c4c8cb;
--bs-tertiary-bg: #f8f9fa;
--bs-emphasis-color-rgb: 0,0,0;
--bs-form-invalid-border-color: #dc3545;
--bs-secondary-bg-rgb: 233,236,239;
--bs-tertiary-bg-rgb: 248,249,250;
--bs-border-radius-pill: 50rem;
--bs-body-bg: #fff;
--bs-dark-border-subtle: #adb5bd;
--bs-focus-ring-width: 0.25rem;
--bs-border-color-translucent: rgba(0, 0, 0, 0.175);
--bs-link-color: #0d6efd;
--bs-form-valid-border-color: #198754;
--bs-body-color: #212529;
```

### Spacing

```css
--bs-font-monospace: SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
--bs-body-font-size: 1rem;
```

### Typography

```css
--bs-danger-text-emphasis: #58151c;
--bs-info-text-emphasis: #055160;
--bs-body-font-weight: 400;
--bs-body-line-height: 1.5;
--bs-dark-text-emphasis: #495057;
--bs-success-text-emphasis: #0a3622;
--bs-light-text-emphasis: #495057;
--bs-warning-text-emphasis: #664d03;
--bs-font-sans-serif: system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans","Liberation Sans",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
--bs-body-font-family: system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans","Liberation Sans",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
```

### Shadows

```css
--shadow: 0 25px 60px rgba(102,126,234,0.08);
--shadow-hover: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--bs-box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
--bs-box-shadow-inset: inset 0 1px 2px rgba(0, 0, 0, 0.075);
--bs-box-shadow-lg: 0 1rem 3rem rgba(0, 0, 0, 0.175);
--bs-box-shadow-sm: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
```

### Radii

```css
--radius: 1rem;
```

### Other

```css
--bs-breakpoint-xs: 0;
--bs-breakpoint-sm: 576px;
--bs-breakpoint-md: 768px;
--bs-breakpoint-lg: 992px;
--bs-breakpoint-xl: 1200px;
--bs-breakpoint-xxl: 1400px;
--gradient: linear-gradient(135deg, #667eea, #764ba2);
--error: #dc3545;
--bs-orange: #fd7e14;
--bs-success: #198754;
--bs-warning-rgb: 255,193,7;
--bs-cyan: #0dcaf0;
--bs-purple: #6f42c1;
--bs-green: #198754;
--bs-info-rgb: 13,202,240;
--bs-gray-400: #ced4da;
--bs-pink: #d63384;
--bs-gray-100: #f8f9fa;
--bs-link-decoration: underline;
--bs-white: #fff;
--bs-danger: #dc3545;
--bs-gray-600: #6c757d;
--bs-dark-rgb: 33,37,41;
--bs-gradient: linear-gradient(180deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0));
--bs-gray-500: #adb5bd;
--bs-teal: #20c997;
--bs-indigo: #6610f2;
--bs-dark: #212529;
--bs-gray-800: #343a40;
--bs-black-rgb: 0,0,0;
--bs-warning: #ffc107;
--bs-success-rgb: 25,135,84;
--bs-blue: #0d6efd;
--bs-yellow: #ffc107;
--bs-info: #0dcaf0;
--bs-gray: #6c757d;
--bs-danger-rgb: 220,53,69;
--bs-gray-200: #e9ecef;
--bs-gray-dark: #343a40;
--bs-red: #dc3545;
--bs-gray-700: #495057;
--bs-white-rgb: 255,255,255;
--bs-black: #000;
--bs-light-rgb: 248,249,250;
--bs-gray-300: #dee2e6;
--bs-gray-900: #212529;
--bs-light: #f8f9fa;
```

### Semantic

```css
success: [object Object];
warning: [object Object];
error: [object Object];
info: [object Object];
```

## Breakpoints

| Name | Value | Type |
|------|-------|------|
| sm | 576px | max-width |
| md | 768px | max-width |
| 900px | 900px | max-width |
| lg | 992px | min-width |
| 1200px | 1200px | min-width |
| 1400px | 1400px | min-width |

## Transitions & Animations

**Easing functions:** `[object Object]`, `[object Object]`, `[object Object]`

**Durations:** `0.15s`, `0.3s`, `0.2s`

### Common Transitions

```css
transition: all;
transition: box-shadow 0.15s ease-in-out;
transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
transition: transform 0.3s;
transition: transform 0.3s ease-in-out;
transition: border 0.2s, box-shadow 0.2s;
transition: color 0.2s;
transition: transform 0.15s, box-shadow 0.15s;
```

### Keyframe Animations

**progress-bar-stripes**
```css
@keyframes progress-bar-stripes {
  0% { background-position-x: 1rem; }
}
```

**spinner-border**
```css
@keyframes spinner-border {
  100% { transform: rotate(360deg); }
}
```

**spinner-grow**
```css
@keyframes spinner-grow {
  0% { transform: scale(0); }
  50% { opacity: 1; transform: none; }
}
```

**placeholder-glow**
```css
@keyframes placeholder-glow {
  50% { opacity: 0.2; }
}
```

**placeholder-wave**
```css
@keyframes placeholder-wave {
  100% { mask-position: -200% 0%; }
}
```

**slideInRight**
```css
@keyframes slideInRight {
  0% { opacity: 0; transform: translateX(30px); }
  100% { opacity: 1; transform: translateX(0px); }
}
```

**spin**
```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (7 instances)

```css
.button {
  color: rgb(255, 255, 255);
  font-size: 16px;
  font-weight: 400;
  padding-top: 4px;
  padding-right: 12px;
  border-radius: 6px;
}
```

### Cards (1 instances)

```css
.card {
  background-color: rgb(255, 255, 255);
  border-radius: 16px;
  box-shadow: rgba(102, 126, 234, 0.08) 0px 25px 60px 0px;
  padding-top: 0px;
  padding-right: 0px;
}
```

### Inputs (3 instances)

```css
.input {
  background-color: rgb(255, 255, 255);
  color: rgb(33, 37, 41);
  border-color: rgb(33, 65, 122);
  border-radius: 10.4px;
  font-size: 16px;
  padding-top: 12px;
  padding-right: 16px;
}
```

### Links (23 instances)

```css
.link {
  color: rgb(52, 73, 94);
  font-size: 16px;
  font-weight: 400;
}
```

### Navigation (25 instances)

```css
.navigatio {
  background-color: rgb(248, 249, 250);
  color: rgb(45, 55, 72);
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  position: static;
  box-shadow: rgba(0, 0, 0, 0.075) 0px 2px 4px 0px;
}
```

### Modals (6 instances)

```css
.modal {
  background-color: rgb(255, 255, 255);
  border-radius: 0px;
  padding-top: 0px;
  padding-right: 0px;
  max-width: 1140px;
}
```

### Dropdowns (26 instances)

```css
.dropdown {
  background-color: rgb(255, 255, 255);
  border-radius: 0px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px 0px;
  border-color: rgb(33, 37, 41);
  padding-top: 0px;
}
```

### Badges (1 instances)

```css
.badge {
  color: rgb(52, 73, 94);
  font-size: 16px;
  font-weight: 500;
  padding-top: 0px;
  padding-right: 0px;
  border-radius: 0px;
}
```

### Switches (5 instances)

```css
.switche {
  border-radius: 0px;
  border-color: rgb(52, 73, 94);
}
```

## Component Clusters

Reusable component instances grouped by DOM structure and style similarity:

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(13, 110, 253);
  padding: 6px 12px 6px 12px;
  border-radius: 6px;
  border: 1px solid rgb(13, 110, 253);
  font-size: 16px;
  font-weight: 400;
```

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(255, 255, 255);
  padding: 15px 12px 15px 12px;
  border-radius: 12px;
  border: 0px none rgb(255, 255, 255);
  font-size: 16px;
  font-weight: 400;
```

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(0, 0, 0);
  padding: 8px 8px 8px 8px;
  border-radius: 6px;
  border: 0px none rgb(0, 0, 0);
  font-size: 16px;
  font-weight: 400;
```

### Card — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgb(255, 255, 255);
  color: rgb(45, 55, 72);
  padding: 0px 0px 0px 0px;
  border-radius: 16px;
  border: 0px none rgb(45, 55, 72);
  font-size: 16px;
  font-weight: 400;
```

### Input — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgb(255, 255, 255);
  color: rgb(33, 37, 41);
  padding: 12px 16px 12px 16px;
  border-radius: 10.4px;
  border: 1px solid rgb(33, 65, 122);
  font-size: 16px;
  font-weight: 400;
```

### Button — 2 instances, 1 variant

**Variant 1** (2 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(108, 117, 125);
  padding: 4px 4px 4px 4px;
  border-radius: 0px;
  border: 0px none rgb(108, 117, 125);
  font-size: 17.6px;
  font-weight: 400;
```

## Layout System

**0 grid containers** and **28 flex containers** detected.

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 100% | 0px |
| 1140px | 12px |
| 920px | 0px |

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| row/nowrap | 22x |
| column/nowrap | 5x |
| row/wrap | 1x |

**Gap values:** `12px`, `16px`, `4px`, `8px`

## Accessibility (WCAG 2.1)

**Overall Score: 100%** — 0 passing, 0 failing color pairs

## Design System Score

**Overall: 90/100 (Grade: A)**

| Category | Score |
|----------|-------|
| Color Discipline | 92/100 |
| Typography Consistency | 82/100 |
| Spacing System | 100/100 |
| Shadow Consistency | 100/100 |
| Border Radius Consistency | 100/100 |
| Accessibility | 100/100 |
| CSS Tokenization | 100/100 |

**Strengths:** Tight, disciplined color palette, Well-defined spacing scale, Clean elevation system, Consistent border radii, Strong accessibility compliance, Good CSS variable tokenization

**Issues:**
- 1722 !important rules — prefer specificity over overrides
- 92% of CSS is unused — consider purging
- 3727 duplicate CSS declarations

## Gradients

**8 unique gradients** detected.

| Type | Direction | Stops | Classification |
|------|-----------|-------|----------------|
| linear | 135deg | 2 | brand |
| linear | 135deg | 2 | brand |
| linear | 135deg | 2 | brand |
| linear | 135deg | 2 | brand |
| linear | 135deg | 2 | brand |
| linear | 135deg | 2 | brand |
| linear | 135deg | 2 | brand |
| linear | 135deg | 2 | brand |

```css
background: linear-gradient(135deg, rgb(172, 175, 233), rgb(115, 85, 176));
background: linear-gradient(135deg, rgb(99, 102, 241), rgb(79, 70, 229));
background: linear-gradient(135deg, rgb(23, 162, 184), rgb(19, 132, 150));
background: linear-gradient(135deg, rgb(40, 167, 69), rgb(32, 160, 57));
background: linear-gradient(135deg, rgb(255, 193, 7), rgb(224, 168, 0));
```

## Z-Index Map

**4 unique z-index values** across 1 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| modal | 1000,1100 | ul.d.r.o.p.d.o.w.n.-.m.e.n.u, ul.d.r.o.p.d.o.w.n.-.m.e.n.u, div.o.f.f.c.a.n.v.a.s. .o.f.f.c.a.n.v.a.s.-.e.n.d |

## Font Files

| Family | Source | Weights | Styles |
|--------|--------|---------|--------|
| bootstrap-icons | self-hosted | 400, normal | normal |

## Motion Language

**Feel:** smooth · **Scroll-linked:** yes

### Duration Tokens

| name | value | ms |
|---|---|---|
| `xs` | `150ms` | 150 |
| `sm` | `200ms` | 200 |
| `md` | `300ms` | 300 |

### Easing Families

- **ease-in-out** (12 uses) — `ease`
- **custom** (6 uses) — `cubic-bezier(0.4, 0, 0.2, 1)`
- **linear** (1 uses) — `linear`

### Keyframes In Use

| name | kind | properties | uses |
|---|---|---|---|
| `slideInRight` | slide-x | opacity, transform | 5 |

## Component Anatomy

### button — 5 instances

**Slots:** label
**Variants:** outline

| variant | count | sample label |
|---|---|---|
| default | 4 | HIZLI MENÜ |
| outline | 1 | Yönetici / Yetkili Girişi |

## Brand Voice

**Tone:** neutral · **Pronoun:** third-person · **Headings:** Title Case (tight)

### Top CTA Verbs

- **y** (1)
- **hizli** (1)
- **giri** (1)

### Button Copy Patterns

- "yönetici / yetkili girişi" (1×)
- "hizli menü" (1×)
- "giriş yap" (1×)

### Sample Headings

> Yönetici Girişi
> Giriş Bilgileri

## Page Intent

**Type:** `unknown` (confidence 0)

## Section Roles

Reading order (top→bottom): nav → content

| # | Role | Heading | Confidence |
|---|------|---------|------------|
| 0 | nav | — | 0.9 |
| 1 | content | Yönetici Girişi | 0.3 |

## Material Language

**Label:** `flat` (confidence 0)

| Metric | Value |
|--------|-------|
| Avg saturation | 0.468 |
| Shadow profile | soft |
| Avg shadow blur | 0px |
| Max radius | 16px |
| backdrop-filter in use | no |
| Gradients | 8 |

## Component Library

**Detected:** `bootstrap` (confidence 0.6)

Evidence:
- bootstrap utility hits: 3

## Component Screenshots

6 retina crops written to `screenshots/`. Index: `*-screenshots.json`.

| Cluster | Variant | Size (px) | File |
|---------|---------|-----------|------|
| button--outline | 0 | 152 × 62 | `screenshots/button-outline-0.png` |
| button--default | 0 | 44 × 132 | `screenshots/button-default-0.png` |
| button--default | 1 | 26 × 36 | `screenshots/button-default-1.png` |
| button--default | 2 | 220 × 47 | `screenshots/button-default-2.png` |
| card--default | 0 | 920 × 365 | `screenshots/card-default-0.png` |
| input--default | 0 | 380 × 50 | `screenshots/input-default-0.png` |

Full-page: `screenshots/full-page.png`

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `Inter` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
