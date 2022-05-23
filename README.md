# Basic Style Dictionary

This example code is bare-bones to show you what this framework can do. If you have the style-dictionary module installed
globally, you can `cd` into this directory and run:

```bash
npm istall
npm run build
```

You should see something like this output:

```
scss
✔︎  build/variables.scss

css
✔︎  build/variables.css

```

**SCSS**

```scss
// variables.scss
$color-base-gray-light: #cccccc;
$color-base-gray-medium: #999999;
$color-base-gray-dark: #111111;
$color-base-red: #ff0000;
$color-base-green: #00ff00;
$color-font-base: #ff0000;
$color-font-secondary: #00ff00;
$color-font-tertiary: #cccccc;
$size-font-small: 0.75rem;
$size-font-medium: 1rem;
$size-font-large: 2rem;
$size-font-base: 1rem;
```

**CSS**

```scss
// variables.css
:root {
  --color-base-gray-light: #cccccc;
  --color-base-gray-medium: #999999;
  --color-base-gray-dark: #111111;
  --color-base-red: #ff0000;
  --color-base-green: #00ff00;
  --color-font-base: #ff0000;
  --color-font-secondary: #00ff00;
  --color-font-tertiary: #cccccc;
  --size-font-small: 0.75rem;
  --size-font-medium: 1rem;
  --size-font-large: 2rem;
  --size-font-base: 1rem;
} 
```
