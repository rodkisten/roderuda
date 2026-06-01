<div align="center">
  <h1>RodEruda</h1>
  <p>Console for Mobile Browsers — a fork and rebrand of <a href="https://github.com/liriliri/eruda">Eruda</a></p>
</div>

<div align="center">

[![License][license-image]][npm-url]

</div>

[npm-url]: https://npmjs.org/package/roderuda
[license-image]: https://img.shields.io/npm/l/roderuda?style=flat-square

<img src="https://eruda.liriliri.io/screenshot.jpg" style="width:100%">

## Install

```bash
npm install roderuda --save-dev
```

Add this script to your page:

```html
<script src="node_modules/roderuda/roderuda.js"></script>
<script>RodEruda.init();</script>
```

Or use the CDN from GitHub Pages:

```html
<script src="https://oirodolfo.github.io/eruda-console-browser/roderuda/roderuda.js"></script>
<script>RodEruda.init();</script>
```

Minified version:

```html
<script src="https://oirodolfo.github.io/eruda-console-browser/roderuda/roderuda.min.js"></script>
<script>RodEruda.init();</script>
```

## Browser Global

When loaded via a `<script>` tag, `RodEruda` is exposed as `window.RodEruda`.

```html
<script src="roderuda.js"></script>
<script>
  RodEruda.init();
  RodEruda.show();
</script>
```

## Build

This project uses [tsdown](https://tsdown.dev) for bundling.

| Output file | Description |
|---|---|
| `dist/roderuda.js` | Non-minified, sourcemap included |
| `dist/roderuda.min.js` | Minified, sourcemap included |
| `dist/roderuda.with-comments.js` | Non-minified, comments preserved, no sourcemap |

```bash
# Full build (all three outputs)
npm run build

# Minified only
npm run build:min

# Dev build (development mode)
npm run build:dev

# Type check
npm run typecheck

# Tests
npm run test

# Clean dist/
npm run clean
```

## GitHub Pages

Built assets are published to GitHub Pages under the `/roderuda` path:

- https://oirodolfo.github.io/eruda-console-browser/roderuda/

## API

`RodEruda` exposes the same API as the original Eruda:

```js
// Initialize
RodEruda.init();

// Initialize with options
RodEruda.init({
  container: document.getElementById('my-container'),
  tool: ['console', 'elements'],
  useShadowDom: true,
  inline: false,
  defaults: {
    theme: 'Dark',
    displaySize: 50,
  },
});

// Show / hide
RodEruda.show();
RodEruda.hide();

// Destroy
RodEruda.destroy();

// Get a tool panel
const consolePanel = RodEruda.get('console');
```

## Related Projects

* [eruda](https://github.com/liriliri/eruda): Original project this was forked from.
* [chobitsu](https://github.com/liriliri/chobitsu): Chrome devtools protocol JavaScript implementation.
* [licia](https://github.com/liriliri/licia): Utility library.
* [luna](https://github.com/liriliri/luna): UI components.

## License

MIT
