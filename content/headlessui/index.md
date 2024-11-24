---
title: HeadlessUI Misc
weight: 10
---

Thse ar all based on the examples on  [headlessui.com](https://headlessui.com/react/). 

## Radio Group

Radio Group populated from YAML in shortcode inner content:

{{< hdx r="radiogroup.jsx" c="w-96 p-8">}}
props:
  plans:
    - name: "Startup"
      ram: "8GB"
      cpus: "4 CPUs"
      disk: "160GB SSD"
    - name: "Business"
      ram: "16GB"
      cpus: "8 CPUs"
      disk: "512GB SSD"
{{< /hdx >}}


## Dropdown Menus

{{< hdx r="dropdownmenu.jsx" c="h-64 w-64" />}}



## Text Area

### Props from shortcode params

{{< hdx r="textarea.jsx" title="First text area" description="This is a description." c="w-64 p-4" />}}

### Props YAML shortcode inner content

{{< hdx r="textarea.jsx" c="w-64 p-4" >}}
props:
   title: Second text area
   description: This is a description.
{{< /hdx >}}

### Props mix of params and inner content

{{< hdx r="textarea.jsx" title="Third text area" c="w-64 p-4" >}}
props:
   description: This is another description.
{{< /hdx >}}


