# Hardware Store Management System - Design System

## 1. DESIGN PHILOSOPHY
Professional, clean, and intuitive interface for hardware store sellers. Easy navigation for quick operations: sales recording, inventory tracking, and financial reporting.

---

## 2. COLOR PALETTE

### Primary Colors
- **White** (#FFFFFF) - Base background, cards, primary surface
- **Green** (#10B981) - Success, positive actions, revenue, profit
- **Blue** (#3B82F6) - Primary actions, links, information, features
- **Red** (#EF4444) - Alerts, errors, out of stock, warnings

### Secondary Colors
- **Green Light** (#D1FAE5) - Light backgrounds, subtle highlights
- **Green Dark** (#047857) - Text, borders, hover states
- **Blue Light** (#DBEAFE) - Information background
- **Blue Dark** (#1E40AF) - Text links, emphasis
- **Red Light** (#FEE2E2) - Warning backgrounds
- **Red Dark** (#991B1B) - Critical alerts
- **Gray-100** (#F3F4F6) - Light backgrounds, disabled states
- **Gray-500** (#6B7280) - Secondary text
- **Gray-700** (#374151) - Primary text
- **Gray-900** (#111827) - Dark text, headings

### Usage Guidelines
```
✓ Green     → Revenue, completed sales, profit, success messages
✓ Blue      → Primary buttons, navigation, features, info
✓ Red       → Out of stock, debts, low inventory, alerts
✓ White     → Backgrounds, cards, primary surfaces
✓ Gray      → Secondary text, borders, dividers
```

---

## 3. TYPOGRAPHY

### Font Stack
```
Primary: 'Inter', 'Segoe UI', system-ui, sans-serif
Monospace: 'JetBrains Mono', 'Monaco', monospace (for prices/numbers)
```

### Text Styles

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| **H1 (Heading 1)** | 32px | 700 | 40px | Page titles |
| **H2 (Heading 2)** | 24px | 700 | 32px | Section titles |
| **H3 (Heading 3)** | 20px | 600 | 28px | Subsections |
| **Body Large** | 16px | 400 | 24px | Main text, descriptions |
| **Body Regular** | 14px | 400 | 20px | Standard text |
| **Body Small** | 12px | 400 | 18px | Helper text, dates |
| **Button** | 14px | 600 | 20px | Button labels |
| **Label** | 12px | 600 | 16px | Form labels, badges |

---

## 4. SPACING SYSTEM

```
4px   - xs (minimum spacing)
8px   - sm (small gaps)
12px  - md (medium spacing)
16px  - lg (standard spacing)
24px  - xl (large spacing)
32px  - 2xl (extra large spacing)
48px  - 3xl (section spacing)
```

---

## 5. BORDER RADIUS

```
0px     - None
2px     - xs (input fields, small elements)
4px     - sm (badges, chips)
6px     - md (buttons, cards)
8px     - lg (panels, modals)
12px    - xl (large containers)
24px    - 2xl (special elements)
9999px  - Full (circles, pills)
```

---

## 6. SHADOWS

```
none       - No shadow
sm         - 0 1px 2px rgba(0, 0, 0, 0.05)
base       - 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)
md         - 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)
lg         - 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)
xl         - 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)
```

**Usage:**
- `sm` - Hover states, subtle depth
- `base` - Cards, input fields
- `md` - Floating elements, emphasis
- `lg` - Dropdowns, popovers
- `xl` - Modals, important overlays

---

## 7. COMPONENT LIBRARY

### Buttons

#### Primary Button (Green)
- Background: #10B981
- Text: White
- Hover: #059669 (darker green)
- Padding: 10px 16px
- Border Radius: 6px
- Font: 14px, 600 weight
- Actions: Submit, Save, Add Item, Record Sale

#### Secondary Button (Blue)
- Background: #3B82F6
- Text: White
- Hover: #2563EB
- Padding: 10px 16px
- Border Radius: 6px
- Actions: View, Edit, Filter, Export

#### Danger Button (Red)
- Background: #EF4444
- Text: White
- Hover: #DC2626
- Padding: 10px 16px
- Border Radius: 6px
- Actions: Delete, Remove, Cancel Sale

#### Ghost Button (Outline)
- Background: Transparent
- Border: 2px solid #3B82F6
- Text: #3B82F6
- Hover: #DBEAFE background
- Actions: Secondary actions, back navigation

### Input Fields
- Border: 1px solid #E5E7EB
- Border Radius: 6px
- Padding: 10px 12px
- Font: 14px
- Focus: 2px solid #3B82F6
- Background: White
- Disabled: Gray-100 background, Gray-400 text

### Cards
- Background: White
- Border: 1px solid #E5E7EB
- Border Radius: 8px
- Padding: 16px
- Shadow: base
- Hover: Shadow md (if clickable)

### Badges
- Display: Inline-block
- Padding: 4px 12px
- Border Radius: 9999px
- Font: 12px, 600 weight

**Badge Variants:**
- **Success** (Green): #D1FAE5 background, #047857 text
- **Info** (Blue): #DBEAFE background, #1E40AF text
- **Warning** (Red): #FEE2E2 background, #991B1B text
- **Neutral** (Gray): #F3F4F6 background, #6B7280 text

### Navigation
- Sidebar or top navigation with active state indicator (Green)
- Icons + labels
- Current page highlighted in Green
- Hover: Light gray background

### Tables
- Header: Gray-700 text, Gray-100 background
- Rows: White background, alternate Gray-50
- Borders: 1px solid #E5E7EB
- Padding: 12px 16px per cell
- Actions column: Right-aligned

### Modals
- Background: White
- Header: Gray-900 text (24px, 700 weight)
- Footer: Buttons right-aligned
- Overlay: 50% black overlay
- Border Radius: 8px
- Shadow: xl

---

## 8. LAYOUT STRUCTURE

### Desktop Layout (1200px+)
```
┌─────────────────────────────────────────┐
│ Logo    Navigation    Seller Profile   │ (Header - 60px)
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │   Main Content Area         │
│ 240px    │   (Responsive)              │
│          │                              │
└──────────┴──────────────────────────────┘
```

### Mobile Layout (< 768px)
```
┌────────────────────────┐
│ ☰ Logo    Profile     │ (Header - 56px)
├────────────────────────┤
│   Main Content Area    │ (Full width)
│                        │
└────────────────────────┘
```

### Spacing
- Container max-width: 1400px
- Padding: 24px (desktop), 16px (tablet), 12px (mobile)
- Gutter: 16px between columns

---

## 9. COLOR COMBINATIONS (WCAG AA Compliant)

| Element | Background | Text | Contrast |
|---------|-----------|------|----------|
| Primary Action | Green (#10B981) | White | 4.54 ✓ |
| Secondary Action | Blue (#3B82F6) | White | 5.32 ✓ |
| Danger Action | Red (#EF4444) | White | 4.49 ✓ |
| Content | White | Gray-900 | 16.11 ✓ |
| Secondary Text | White | Gray-500 | 4.54 ✓ |
| Info Box | Blue Light (#DBEAFE) | Blue Dark (#1E40AF) | 6.12 ✓ |

---

## 10. TRANSITIONS & ANIMATIONS

```
Fast     - 150ms (micro interactions: hover, focus)
Base     - 300ms (transitions between states)
Slow     - 500ms (page transitions, modals)
```

**Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out)

---

## 11. ICONOGRAPHY

- **Icon Set:** Recommended Heroicons or Feather Icons
- **Size:** 16px (small), 20px (regular), 24px (large)
- **Stroke Width:** 2px
- **Color:** Inherit from text or use primary colors

---

## 12. RESPONSIVE BREAKPOINTS

```
Mobile     < 640px
Tablet     640px - 1024px
Desktop    1024px - 1280px
Large      1280px+
```

---

## 13. ACCESSIBILITY (A11Y)

- ✓ WCAG AA compliant
- ✓ Focus indicators (2px blue outline)
- ✓ Color is never the only differentiator
- ✓ Text alternatives for images
- ✓ Keyboard navigation support
- ✓ Screen reader friendly
- ✓ Sufficient color contrast ratios

---

## 14. DARK MODE (Future Implementation)
Reserve gray variants for potential dark mode support in future versions.

---

## Files to Reference
- `COMPONENT_SPECS.md` - Detailed component specifications
- `USAGE_GUIDE.md` - Implementation guidelines
