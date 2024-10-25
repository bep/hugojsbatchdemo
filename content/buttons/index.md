---
title: Import resolution
weight: 40
---


{{< hdx r="mybutton.jsx" label="Save Me!" c="w-64" />}}

{{< hdx r="mybutton.jsx" label="Save Me, Too!" c="w-64" />}}

**Looking at the JSX script:**

{{< hl r="mybutton.jsx" >}}

* `mystyles.css` is a resource bundled in this page.
* `button.jsx` lives in `assets/js/headlessui`, but is mounted relative to this bundle using `Resources.Mount` in this shortcode:

{{< hl r="layouts/shortcodes/hdx.html" l="go-html-template" >}}