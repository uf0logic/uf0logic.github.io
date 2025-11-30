# UI-Kit - Reusable Component Library

A modern, flexible CSS UI-Kit built with CSS custom properties (variables) for easy customization and theming.

## Features

- 🎨 **CSS Custom Properties** - Easy theming with design tokens
- 🧩 **Component-Based** - Reusable components (buttons, cards, inputs, badges, etc.)
- 📱 **Responsive** - Mobile-first approach with utility classes
- 🎯 **Utility Classes** - Comprehensive utility classes for rapid development
- 🔧 **Customizable** - Easy to modify colors, spacing, typography, and more

## Quick Start

Include the CSS file in your HTML:

```html
<link rel="stylesheet" href="ui-kit.css">
```

## Customization

All design tokens are defined as CSS custom properties in the `:root` selector. Simply override these variables to customize the design:

```css
:root {
  --color-primary: #YOUR_COLOR;
  --font-family-primary: 'Your Font', sans-serif;
  --spacing-md: 1.5rem;
  /* ... and more */
}
```

## Components

### Buttons

```html
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-outline">Outline Button</button>
<button class="btn btn-ghost">Ghost Button</button>

<!-- Sizes -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-lg">Large</button>
```

### Cards

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
  </div>
  <div class="card-body">
    <p class="card-text">Card content goes here.</p>
  </div>
  <div class="card-footer">
    Footer content
  </div>
</div>
```

### Inputs

```html
<input type="text" class="input" placeholder="Enter text">
<textarea class="input textarea" placeholder="Enter message"></textarea>
<input type="text" class="input input-error" placeholder="Error state">
```

### Badges

```html
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-error">Error</span>
```

### Typography

```html
<h1 class="heading-1">Heading 1</h1>
<h2 class="heading-2">Heading 2</h2>
<h3 class="heading-3">Heading 3</h3>
<p class="text-body">Body text</p>
<p class="text-small">Small text</p>
```

### Layout

```html
<div class="container container-lg">
  <div class="d-flex gap-md align-center">
    <!-- Flexbox layout -->
  </div>
</div>
```

## Design Tokens

The UI-Kit uses CSS custom properties for:

- **Colors**: Primary, secondary, semantic colors, and neutral grays
- **Typography**: Font families, sizes, weights, and line heights
- **Spacing**: Consistent spacing scale
- **Border Radius**: Rounded corners
- **Shadows**: Elevation system
- **Transitions**: Animation timing
- **Z-Index**: Layering system

## Updating from Figma

To sync with your Figma design:

1. Extract design tokens from Figma (colors, typography, spacing)
2. Update the CSS custom properties in `:root`
3. Adjust component styles as needed

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Custom Properties support required
- Flexbox support required

## License

Free to use in your projects.

