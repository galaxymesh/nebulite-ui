import React from "react";
import { NodeInputProps } from "./helpers";

interface TextInputPropsBase {
  help?: boolean;
  state?: "success" | "error" | "disabled";
}

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    TextInputPropsBase {
  subtitle?: React.ReactNode;
  helper?: React.ReactNode;
}

const TextInput = ({}: TextInputProps) => {
  return <div></div>;
};

export function NodeInputDefault<T>(props: NodeInputProps) {
  const { node, attributes, value = "", setValue, disabled } = props;

  // Some attributes have dynamic JavaScript - this is for example required for WebAuthn.
  const onClick = () => {
    // This section is only used for WebAuthn. The script is loaded via a <script> node
    // and the functions are available on the global window level. Unfortunately, there
    // is currently no better way than executing eval / function here at this moment.
    if (attributes.onclick) {
      const run = new Function(attributes.onclick);
      run();
    }
  };

  // Render a generic text input field.
  return (
    <TextInput
      title={node.meta.label?.text}
      onClick={onClick}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      type={attributes.type}
      name={attributes.name}
      value={value}
      disabled={attributes.disabled || disabled}
      help={node.messages.length > 0}
      state={
        node.messages.find(({ type }) => type === "error") ? "error" : undefined
      }
      subtitle={
        <>
          {node.messages.map(({ text, id }, k) => (
            <span key={`${id}-${k}`} data-testid={`ui/message/${id}`}>
              {text}
            </span>
          ))}
        </>
      }
    />
  );
}
