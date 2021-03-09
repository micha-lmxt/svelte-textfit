svelte-textfit
=========================

[![npm](https://img.shields.io/badge/npm-svelte--textfit-brightgreen.svg?style=flat-square)]()
[![npm version](https://img.shields.io/npm/v/react-textfit.svg?style=flat-square)](https://www.npmjs.com/package/svelte-textfit)
[![npm downloads](https://img.shields.io/npm/dm/react-textfit.svg?style=flat-square)](https://www.npmjs.com/package/svelte-textfit)

Svelte action based on [react-textfit](https://github.com/malte-wessel/react-textfit)

* fit **headlines and paragraphs** into any element
* **fast:** uses binary search for efficiently find the correct fit
* **100%** svelte-goodness
* works with **any style** configuration (line-height, padding, ...)
* **[check out the demo](http://gradientdescent.de/porting-textfit)**

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Modes](#modes)
- [API](#api)
- [License](#license)

## Installation
```bash
npm install svelte-textfit --save-dev
```

## Usage

### Headlines

```javascript
<script>
  import { textfit } from 'svelte-textfit';
  let parent;
</script>
<div bind:this={parent}>
  <h1 use:textfit={{parent,mode="single"}}>
    Fat headline!
  </h1>
</div>
```

#### Respect the element's height when using single lines

```javascript
<script>
  import { textfit } from 'svelte-textfit';
</script>
<div use:textfit={
  {
    mode="single", width:1000, height:100,
    forceSingleModeWidth=false
  }
}>      
  Fat headline!
</div>
```

### Paragraphs

```javascript
<script>
  import { textfit } from 'svelte-textfit';
  let parent;
</script>
<div bind:this={parent}>
  <p use:textfit={{mode="multi",parent}}>
    Lorem <strong>ipsum</strong> dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  </p>
<div>
    );
  }
}
```

## Modes

### `single`

**Algorithm steps:**

```
1. binary search to fit the element's width
2. if forceSingleModeWidth=false and text overflows height
    2a. binary search to also fit the elements height
```

### `multi`

**Algorithm steps:**

```
1. binary search to fit the element's height
2. if text overflows width
    2a. binary search to also fit the elements width
```

## API

### `<Textfit>`

#### Props

* `mode` (single|multi) Algorithm to fit the text. Use single for headlines and multi for paragraphs. Default is `multi`.
* `forceSingleModeWidth` (Boolean) When mode is single and forceSingleModeWidth is true, the element's height will be ignored. Default is `true`.
* `min` (Number) Minimum font size in pixel. Default is `1`.
* `max` (Number) Maximum font size in pixel. Default is `100`.
* `throttle` (Number) Window resize throttle in milliseconds. Default is `50`.
* `onReady` (Function) Will be called when text is fitted.
* `update` (any) An update element, change in this element will trigger an update 
* `autoResize` (boolean) Automatically resize. Adds a listener to the window if true to detect changes. Default is `false`.
* `style` (function(node,value) : void) Custom function to apply to the node, when a new interpolated value is checked.
* `width` & `height` (number) The width and height that should be enforced. Use either width & height or parent.
* `parent` (ref) Parent. Container, that should be filled.
* ``elementFitsWidth` & `elementFitsHeight` (function(node,width) : boolean) Custom functions which check, if the element fits the width/height.

## License

MIT
