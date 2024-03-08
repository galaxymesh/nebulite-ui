import { UiNode, UiNodeAnchorAttributes } from "@ory/client";
import React from "react";
import { Button } from "../styled/components/Button";

interface Props {
  node: UiNode;
  attributes: UiNodeAnchorAttributes;
}
export const NodeAnchor = ({ node, attributes }: Props) => {
  return (
    <Button
      data-testid={`node/anchor/${attributes.id}`}
      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();
        window.location.href = attributes.href;
      }}
    >
      {attributes.title.text}
    </Button>
  );
};
