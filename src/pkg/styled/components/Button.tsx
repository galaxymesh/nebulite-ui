import { styled } from "@mui/material/styles";
import React from "react";

export interface ButtonStyles {
  big?: boolean;
  disabled?: boolean;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  helper?: React.ReactNode;
  children: string;
}

export const Button = ({ helper, className, ...props }: ButtonProps) => {
  return (
    <div className={className}>
      <button className="button" {...props} />
      {helper && <span className="button-helper">{helper}</span>}
    </div>
  );
};

export default styled(
  Button,
  {}
)<ButtonStyles>(
  ({ theme, big, disabled }) => `
    & .button {
        line-height: ${!big ? "20px" : "30px"};
        color: ${theme.palette.grey};
        border-radius: 1px;
      
        width: 100%;
      
        padding: 5px 12px;
        margin: 7px 0;
        border: 2px solid transparent;
        outline: none;
      
        background-color: ${theme.palette.primary.main};
      
        cursor: pointer;
      }
      
      & .button:disabled, & .button:hover:disabled {
        color: ${theme.palette.grey};
        background-color: ${theme.palette.grey};
      }
      
      & .button.fake-hover,
      & .button:hover {
        background-color: ${theme.palette.primary.dark};
      }
      
      & .button.fake-focus,
      & .button:focus {
        background-color:${theme.palette.primary.main};
        border: 2px solid ${theme.palette.secondary.main};
        outline: none;
      }
      
      & .button.fake-click,
      & .button:active {
        background-color: ${theme.palette.primary.dark};
        outline: none;
        border: 2px solid transparent;
      }
`
);
