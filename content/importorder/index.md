---
title: Import Order
weight: 200
---

There are two main cases:

1. Undefined execution order of imports, see [this comment](https://github.com/evanw/esbuild/issues/399#issuecomment-1458680887)
2. Only one execution order of imports, see [this comment](https://github.com/evanw/esbuild/issues/399#issuecomment-735355932)

Many would call both of the above [code smells](https://en.wikipedia.org/wiki/Code_smell). The first one has a simple workaround in Hugo. Define the import order in its own script and make sure it gets passed early to ESBuild, e.g. by putting it in a script goup with a name that comes early in the alphabet.

{{< script resource="entrypoints-workaround.js" group="__aardwark" >}}

```
{{</* script resource="entrypoints-workaround.js" id="__aardwark" */>}}
```

Removing the shortcode reference above makes the JS fail. 


```js
import './lib2.js';
import './lib1.js';

console.log('entrypoints-workaround.js');

```


{{< hdx r="entry1.jsx" />}}
{{< hdx r="entry2.jsx" />}}

Note that the workaround does not make [this case](https://github.com/evanw/esbuild/issues/399#issuecomment-735355932) work, but that also seem to be a problem in other bundlers (e.g. [Rollup](https://github.com/rollup/rollup/issues/3888)).
