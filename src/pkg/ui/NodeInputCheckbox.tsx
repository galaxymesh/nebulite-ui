import React from "react";
import { getNodeLabel } from "@ory/integrations/ui";

import { NodeInputProps } from "./helpers";
import { Checkbox } from "../styled/components/Checkbox";

export function NodeInputCheckbox<T>({
  node,
  attributes,
  setValue,
  disabled,
}: NodeInputProps) {
  // Render a checkbox.
  return (
    <>
      <Checkbox
        name={attributes.name}
        defaultChecked={attributes.value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.checked)
        }
        disabled={attributes.disabled || disabled}
        label={getNodeLabel(node)}
        state={
          node.messages.find(({ type }) => type === "error")
            ? "error"
            : undefined
        }
        subtitle={node.messages.map(({ text }) => text).join("\n")}
      />
    </>
  );
}
