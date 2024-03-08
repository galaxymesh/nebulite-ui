import { styled } from "@mui/material/styles";
import React from "react";

export interface CardStyles {
  wide?: boolean;
}

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    CardStyles {}

const Card = ({ className, ...props }: CardProps) => {
  return <div className={className} {...props} />;
};

export default styled(Card, {
  shouldForwardProp: (prop) => prop !== "wide",
})<CardStyles>(
  ({ theme, wide }) => `
    background: white;
    border: 1px solid ${theme.palette.grey};
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width:  ${wide ? "680" : "336"}px;
    margin: 0 auto;
    padding: 20px;
  `
);
