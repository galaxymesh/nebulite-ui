import { getNodeLabel } from "@ory/integrations/ui";

import { NodeInputProps } from "./helpers";
import Button from "../styled/components/Button";

export function NodeInputSubmit<T>({
  node,
  attributes,
  disabled,
}: NodeInputProps) {
  return (
    <>
      <Button
        name={attributes.name}
        value={attributes.value || ""}
        disabled={attributes.disabled || disabled}
      >
        {getNodeLabel(node)}
      </Button>
    </>
  );
}
