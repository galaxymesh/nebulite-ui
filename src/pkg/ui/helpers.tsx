import { UiNode, UiNodeInputAttributes } from "@ory/client";
import React from "react";

export type ValueSetter = (
  value: string | number | boolean | undefined
) => Promise<void>;

export type FormDispatcher = (
  e: React.FormEvent<HTMLFormElement> | React.MouseEvent
) => Promise<void>;

export interface NodeInputProps {
  node: UiNode;
  attributes: UiNodeInputAttributes;
  value: any;
  disabled: boolean;
  dispatchSubmit: React.FormEvent<HTMLFormElement>;
  setValue: ValueSetter;
}

export const useOnload = (attributes: { onload?: string }) => {
  React.useEffect(() => {
    if (attributes.onload) {
      const intervalHandle = callWebauthnFunction(attributes.onload);

      return () => {
        window.clearInterval(intervalHandle);
      };
    }
  }, [attributes]);
};

export const callWebauthnFunction = (functionBody: string) => {
  const run = new Function(functionBody);

  const intervalHandle = window.setInterval(() => {
    if ((window as any).__oryWebAuthnInitialized) {
      run();
      window.clearInterval(intervalHandle);
    }
  }, 100);

  return intervalHandle;
};
