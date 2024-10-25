---
title: Hugo js.Batch Demo
linktitle: Home
---

For most JavaScript building, [js.Build](https://gohugo.io/hugo-pipes/js/) is the right choice. The new `js.Batch` function added in Hugo `v0.140.0` can be used for more  advanced use cases. This function allows coordiniated creation of a JavaScript bundle from multiple sources (e.g. shortcodes, render hooks, page templates etc.).

Some key features:

* You can partition your scripts into [groups](#group) (e.g. one group per page or section).
* A [script] can have multiple [instances](#instance) (e.g. multiple React components with different options).
* A [group] can have one or more [runners](#runner) that will receive a data structure with all instances for that group with a binding of the [JavaScript import] of the defined `export`.
* You can control how imports gets resolved in [importContext](#importContext). This allows you to build scripts inside [page bundles] with relative imports resolved in the bundle. Combine it with [mount](#mount) for even more control.
* This enables [code splitting] with sharing of common code and dependencies (e.g. React)

As a consequence of this concurrent building, the build and inlude of any output will need to be done in a `templates.Defer` block:

```go-html-template
{{ $group := .group }}
{{ with (templates.Defer (dict "key" $group "data" $group )) }}
  {{ with (js.Batch "globaljs") }}
  {{ with .Build }}
    {{ with index .Groups $ }}
      {{ range . }}
        {{ $s := . }}
        {{ if eq $s.MediaType.SubType "css" }}
          <link href="{{ $s.RelPermalink }}" rel="stylesheet" />
        {{ else }}
          <script src="{{ $s.RelPermalink }}" type="module"></script>
        {{ end }}
      {{ end }}
    {{ end }}
  {{ end }}
{{ end }}

```

[config]: #config
[group]: #group
[script]: #script
[instance]: #instance
[with]: https://gohugo.io/functions/go-template/with/
[map]: https://gohugo.io/functions/collections/dictionary/
[OptionsSetter]: #optionssetter
[runner]: #runner
[code splitting]: https://esbuild.github.io/api/#splitting
[page bundles]: https://gohugo.io/content-management/page-bundles/
[JavaScript import]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
[js.Build options]: https://gohugo.io/hugo-pipes/js/#options



## Build

## Config

Returns a [OptionsSetter] that can be used to set options for the batch.

See [js.Build options], but note that:

* `targetPath` is set automatically (there may be multiple outputs).
* `format` must be `esm`, currently the only format supporting [code splitting].


## Group

### Script

Returns a [OptionsSetter] that can be used to set options for this script.

#### importContext

### Instance

Returns a [OptionsSetter] that can be used to set options for this instance.

### Runner

Returns a [OptionsSetter] that can be used to set options for this runner.

```js
import * as ReactDOM from 'react-dom/client';
import * as React from 'react';

export default function Run(scripts) {
	for (const script of scripts) {
		for (const instance of script.instances) {
			/* This is a convention in this project. */
			let elId = `${script.id}-${instance.id}`;
			let el = document.getElementById(elId);
			if (!el) {
				console.warn(`Element with id ${elId} not found`);
				continue;
			}
			const root = ReactDOM.createRoot(el);
			console.log('create', elId, 'with', instance.params);
			const reactEl = React.createElement(script.binding, instance.params);
			root.render(reactEl);
		}
	}
}
```

## OptionsSetter

An `OptionsSetter` is a special object that is returned once only. This means that you should wrap it with [with]:

```go-html-template
{{ with .Script "myscript" }}
    {{ .SetOptions (dict "resource" (resources.Get "myscript.js"))}}
{{ end }}
```

`SetOptions` takes a [map] of options.


## Mount

`Resources.Mount`. `TODO(bep):` I'm not totally convinced this new method is worth the extra API/complexitiy, but it's tempting. See [Buttons](/buttons/) for more details, but in short the common use case would be to mount component folders inside `/assets` to be on the same level as the `Page` bundle, so you can do:

```js
import { ButtonBasic } from "./button.jsx";
```

Instead of:

```js
import { ButtonBasic } from "/js/headlessui/button.jsx";
```

It's not in the example, but I guess this could be more visibly useful in situations where you need to override certain files (e.g. CSS) in the component folder.



----


```go
type Batcher interface {
	Build(context.Context) (BatchPackage, error)
	Config(ctx context.Context) OptionsSetter
	Group(ctx context.Context, id string) BatcherGroup
}

```

```go
type BatcherGroup interface {
	Script(id string) OptionsSetter
	Instance(sid, iid string) OptionsSetter
	Runner(id string) OptionsSetter
}
```

```go
type OptionsSetter interface {
	SetOptions(map[string]any) string
}
```