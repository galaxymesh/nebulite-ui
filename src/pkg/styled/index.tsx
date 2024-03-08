import { styled } from "@mui/material/styles";
import Card from "./components/Card";

export const MarginCard = styled(Card)(({ theme }) => ({
  marginTop: "70px",
  marginBottom: "18px",
}));

export const ActionCard = styled(Card)(({ theme }) => ({
  marginBottom: "18px",
}));
