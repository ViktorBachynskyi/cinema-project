## What is Code Splitting?

Code splitting is a technique that breaks a large JavaScript bundle into smaller chunks that can be loaded when needed.
Instead of downloading the entire application on the first page load, users download only the code required for the current page or feature.

### Benefits
* Faster initial page load
* Smaller JavaScript bundles
* Better performance on slow networks
* Improved caching
* Reduced memory usage
* Better user experience

---

## Why Code Splitting Matters

Without code splitting:

main.js (2 MB)
├── Home page code
├── Product page code
├── Admin page code
├── Analytics
├── Charts
└── Everything else

Every user downloads all code, even if they never visit some pages.

With code splitting:

main.js (200 KB)
├── Home page

product.chunk.js (300 KB)
├── Product page

admin.chunk.js (500 KB)
├── Admin page

charts.chunk.js (400 KB)
├── Chart library


Users only download what they need.

---

# Types of Code Splitting

Webpack supports three main approaches:

1. Entry Points
2. Dynamic Imports
3. SplitChunks Plugin

---

# 1. Entry Point Splitting

Multiple entry points create separate bundles.

### webpack.config.js

```js
module.exports = {
  entry: {
    home: './src/home.js',
    admin: './src/admin.js'
  }
};
```

### Output

home.bundle.js
admin.bundle.js

### Pros

* Easy to configure
* Good for completely separate applications

### Cons

* Can duplicate shared dependencies
* Harder to maintain

---

# 2. Dynamic Imports (Recommended)

Dynamic imports allow loading code only when needed.

### Basic Example

```js
button.addEventListener('click', async () => {
  const module = await import('./calculator');

  module.calculate();
});
```

Webpack creates a separate chunk automatically.

### Generated Bundles

main.bundle.js
calculator.chunk.js

The calculator code is downloaded only after the button is clicked.

---

## Dynamic Import with React

### Lazy Loading Component

```tsx
import { lazy } from 'react';

const ProductDetails = lazy(() => import('./ProductDetails'));
```

### Suspense Wrapper

```tsx
import { Suspense } from 'react';

<Suspense fallback={<div>Loading...</div>}>
  <ProductDetails />
</Suspense>
```

### Benefits

* Smaller initial bundle
* Components loaded on demand
* Simple implementation

---

# 3. SplitChunks Plugin

The most common production setup.

Webpack can automatically extract shared dependencies into separate chunks.

### webpack.config.js

```js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
```

### Example

Suppose two pages use React:

home.js
admin.js

Both import:

```js
import React from 'react';
```

Webpack can create:

home.bundle.js
admin.bundle.js
vendors.bundle.js

React is downloaded once and reused.

---

## Common SplitChunks Configuration

```js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 250000,
      minChunks: 1,
      automaticNameDelimiter: '-'
    }
  }
};
```

### Important Options

| Option      | Description                                              |
| ----------- | -------------------------------------------------------- |
| chunks      | Which chunks should be split (`all`, `async`, `initial`) |
| minSize     | Minimum chunk size before splitting                      |
| maxSize     | Maximum chunk size                                       |
| minChunks   | Number of times module must be reused                    |
| cacheGroups | Custom chunk grouping rules                              |

---

# Vendor Bundle Splitting

Third-party libraries are usually good candidates for separate chunks.

### Example

```js
optimization: {
  splitChunks: {
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all'
      }
    }
  }
}
```

### Result

main.bundle.js
vendors.bundle.js

Benefits:

* Better browser caching
* Users don't re-download vendor code often

---

# Named Chunks

You can give chunks readable names.

```js
import(
  /* webpackChunkName: "analytics" */
  './analytics'
);
```

Generated file:

analytics.chunk.js

Instead of:

123.chunk.js

This helps debugging and bundle analysis.

---

# Prefetching

Webpack can tell the browser to download code in the background.

```js
import(
  /* webpackPrefetch: true */
  './settings'
);
```

### Use Case

User is on:

Home Page

You know they might visit:

Settings Page

Browser downloads the chunk when idle.

Result:

* Faster navigation
* Better user experience

---

# Preloading

Preloading is more aggressive than prefetching.

```js
import(
  /* webpackPreload: true */
  './critical-module'
);
```

### Difference

| Feature       | Prefetch          | Preload            |
| ------------- | ----------------- | ------------------ |
| Priority      | Low               | High               |
| Download Time | Browser idle time | Immediately        |
| Use Case      | Future navigation | Current navigation |

---

# Bundle Analysis

Before splitting code, identify what makes bundles large.

### Install

```bash
npm install --save-dev webpack-bundle-analyzer
```

### Configuration

```js
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [new BundleAnalyzerPlugin()]
};
```

### Benefits

* Visual bundle size analysis
* Finds duplicate dependencies
* Helps identify optimization opportunities

---

# Best Practices

## Split by Route

Good:

```text
Home
Products
Cart
Profile
Admin
```

Each route gets its own chunk.

---

## Split Large Libraries

Good candidates:

```text
Chart.js
Monaco Editor
Moment.js
Three.js
```

Load them only when needed.

---

## Avoid Too Many Small Chunks

Bad:

```text
20 chunks × 5 KB
```

Good:

```text
4 chunks × 25 KB
```

Too many requests can hurt performance.

---

## Analyze Before Optimizing

Always:

1. Measure bundle size
2. Analyze dependencies
3. Split strategically
4. Verify improvement

Do not split code blindly.

---

# Example Production Configuration

```js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

This configuration is suitable for many React applications and serves as a good starting point.

---

# Quick Summary

### Use Dynamic Imports

```js
const module = await import('./module');
```

Loads code only when needed.

### Enable SplitChunks

```js
optimization: {
  splitChunks: {
    chunks: 'all'
  }
}
```

Extracts shared code automatically.

### Use React.lazy

```tsx
const Page = lazy(() => import('./Page'));
```

Loads React components on demand.

### Analyze Bundles

```bash
npm install --save-dev webpack-bundle-analyzer
```

Find large dependencies before optimizing.

---

# Interview Notes

### What is code splitting?

Breaking a large bundle into smaller chunks that can be loaded on demand.

### Why use it?

To reduce initial bundle size and improve application performance.

### How can it be implemented in Webpack?

* Multiple entry points
* Dynamic imports
* SplitChunks plugin

### What is the recommended approach?

Dynamic imports combined with SplitChunks.

### What is the difference between prefetch and preload?

* Prefetch loads resources for future use with low priority.
* Preload loads resources needed soon with high priority.
