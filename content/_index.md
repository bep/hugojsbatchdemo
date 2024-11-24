---
title: Hugo js.Batch Demo
linktitle: Home
build:
  publishResources: false
cascade:
- build:
    publishResources: false

---

For most JavaScript building, [js.Build](https://gohugo.io/hugo-pipes/js/) is the right choice. The new `js.Batch` function added in Hugo `v0.140.0` can be used for more  advanced use cases. This function allows coordinated creation of a JavaScript bundle from multiple sources (e.g. shortcodes, render hooks, page templates etc.).

Some key features:

* You can partition your scripts into [groups](#group) (e.g. one group per section).
* A [script] can have multiple [instances](#instance) (e.g. multiple instances of the same React components with different options).
* A [group] can have one or more [runners](#runner) that will receive a data structure with all instances for that group with a binding of the [JavaScript import] of the defined `export`.
* You can control how imports gets resolved in [importContext](#importContext). This allows you to build scripts inside [page bundles] with relative imports resolved in the bundle. Combine it with [mount](#mount) for even more control.
* This enables [code splitting] with sharing of common code and dependencies (e.g. React)


[config]: #config
[group]: #group
[script]: #script
[instance]: #instance
[script options]: #script-options
[params options]: #params-options
[with]: https://gohugo.io/functions/go-template/with/
[map]: https://gohugo.io/functions/collections/dictionary/
[OptionsSetter]: #optionssetter
[runner]: #runner
[code splitting]: https://esbuild.github.io/api/#splitting
[page bundles]: https://gohugo.io/content-management/page-bundles/
[JavaScript import]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
[js.Build options]: https://gohugo.io/hugo-pipes/js/#options


## js.Batch

Args: `ID` The Batch `ID` is used to create the base directory for this batch. Forward slashes are allowed. The outline for creating a batch with one script group:


```goat
js.Batch "js/mybatch"
  |
  +-- Group "mygroup"
      |
      +-- Config
      |     |
      |     +-- SetOptions
      |
      +-- Runner "myrunner"
      |     |
      |     +-- SetOptions
      |
      +-- Script "myscript"
      |     |
      |     +-- SetOptions
      |
      +-- Instance "myscript" "myinstance"
            |
            +-- SetOptions
```


## Build

The `Build` method returns

```goat
Groups (map)
 |
 +-- Resources (slice)
```


As a consequence of the concurrent building, the building and inclusion of any output will need to be done in a `templates.Defer` block. The example below shows the common use case of including one group's resources in a template:

```go-html-template
{{ $group := .group }}
{{ with (templates.Defer (dict "key" $group "data" $group )) }}
  {{ with (js.Batch "js/mybatch") }}
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


## Config

Returns a [OptionsSetter] that can be used to set config options for the batch.

See [js.Build options], but note that:

* `targetPath` is set automatically (there may be multiple outputs).
* `format` must be `esm`, currently the only format supporting [code splitting].
* `params` will be available in th `@params/config` namespace in the scripts. This way you can import both the [script] or [runner] params and the [config] params with:

```js
import * as params from "@params";
import * as config from "@params/config";
```

```go-html-template
{{ with js.Batch "js/mybatch" }}
  {{ with .Config }}
       {{ .SetOptions (dict
        "target" "es2023"
        "format" "esm"
        "jsx" "automatic"
        "loaders" (dict ".png" "dataurl")
        "minify" true
        "params" (dict "param1" "value1")
        )
      }}
  {{ end }}
{{ end }}
```

## Group

Args: `ID`. No slashes.

**Most of the building blocks can be seen in hdx shortcode in this project:**

{{< hl r="layouts/shortcodes/hdx.html" l="go-html-template" >}}

### Script

Args: `ID`. No slashes.

Returns a [OptionsSetter] that can be used to set [script options] for this script.

```go-html-template
{{ with js.Batch "js/mybatch" }}
  {{ with .Group "mygroup" }}
      {{ with .Script "myscript" }}
          {{ .SetOptions (dict "resource" (resources.Get "myscript.js")) }}
      {{ end }}
  {{ end }}
{{ end }}
```

### Instance

Args: `SCRIPT_ID`, `INSTANCE_ID`. No slashes.

Returns a [OptionsSetter] that can be used to set [params options] for this instance.

```go-html-template
{{ with js.Batch "js/mybatch" }}
  {{ with .Group "mygroup" }}
      {{ with .Instance "myscript" "myinstance" }}
          {{ .SetOptions (dict "params" (dict "param1" "value1")) }}
      {{ end }}
  {{ end }}
{{ end }}
```

### Runner

Returns a [OptionsSetter] that can be used to set [script options] for this runner.

```go-html-template
{{ with js.Batch "js/mybatch" }}
  {{ with .Group "mygroup" }}
      {{ with .Runner "myrunner" }}
          {{ .SetOptions (dict "resource" (resources.Get "myrunner.js")) }}
      {{ end }}
  {{ end }}
{{ end }}
```

**The runner script used in this project:**

{{< hl r="js/batch/react-create-elements.js" >}}


`SetOptions` takes a [map] of options.


## Mount

`Resources.Mount`. See [Buttons](/buttons/) for more details, but in short the common use case would be to mount component folders inside `/assets` to be on the same level as the `Page` bundle, so you can do:

```js
import { ButtonBasic } from "./button.jsx";
```

Instead of:

```js
import { ButtonBasic } from "/js/headlessui/button.jsx";
```

It's not in the example, but I guess this could be more visibly useful in situations where you need to override certain files (e.g. CSS) in the component folder.


## OptionsSetter

An `OptionsSetter` is a special object that is returned once only. This means that you should wrap it with [with]:

```go-html-template
{{ with .Script "myscript" }}
    {{ .SetOptions (dict "resource" (resources.Get "myscript.js"))}}
{{ end }}
```

## Script Options

resource
: The resource to build. This can be a file resource or a virtual resource.

export
: The export to bind the runner to. Set it to `*` to export the [entire namespace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#namespace_import). Default is `default` for [runner] scripts and `*` for other [scripts](#script).

importContext
: An additional context for resolving imports. Hugo will always check this one first before falling back to `assets` and `node_modules`. A common use of this is to resolve imports inside a page bundle.

params
: A map of parameters that will be passed to the script as JSON. These gets bound to the `@params` namespace:
```js
import * as params from '@params';
```

## Import Context

## Params Options

params
: A map of parameters that will be passed to the script as JSON. 


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