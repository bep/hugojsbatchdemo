import { Description, Field, Label, Textarea } from "@headlessui/react";
import clsx from "clsx";

export default function Example(props) {
  return (
    <div className="w-full max-w-md">
      <Field>
        <Label className="text-sm/6 font-medium text-white">
          {props.title}
        </Label>
        <Description className="text-sm/6 text-white/50">
          {props.description}
        </Description>
        <Textarea
          className={clsx(
            "mt-3 block w-full resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
          )}
          rows={3}
        />
      </Field>
    </div>
  );
}
