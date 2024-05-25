import { useContext } from "react";
import { MyndersContext } from "../context/mynders-context";

export default function useMynders() {
  return useContext(MyndersContext);
}
