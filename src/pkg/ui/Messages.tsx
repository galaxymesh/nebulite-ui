import { styled } from "@mui/material/styles";
import { UiText } from "@ory/client";
import React from "react";

export interface AlertStyles {
  severity?: "error" | "info";
}

const AlertContent = styled("h3")`
  margin: 0;
`;

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    AlertStyles {
  children?: React.ReactNode;
}

const Alert = ({ severity, ...props }: AlertProps) => (
  <div {...props}>{props.children}</div>
);

interface MessageProps {
  message: UiText;
}

export const Message = ({ message }: MessageProps) => {
  return (
    <Alert severity={message.type === "error" ? "error" : "info"}>
      <AlertContent data-testid={`ui/message/${message.id}`}>
        {message.text}
      </AlertContent>
    </Alert>
  );
};

interface MessagesProps {
  messages?: Array<UiText>;
}

export const Messages = ({ messages }: MessagesProps) => {
  if (!messages) {
    // No messages? Do nothing.
    return null;
  }

  return (
    <div>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};
