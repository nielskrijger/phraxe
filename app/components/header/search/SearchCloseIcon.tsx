import type { ReactElement } from "react";
import React from "react";
import { Close } from "@mui/icons-material";

interface Props {
  onClick(): void;
}
export default function SearchCloseIcon({ onClick }: Props): ReactElement {
  return (
    <div className="absolute right-[6px] top-[6px]">
      <Close onClick={onClick} />
    </div>
  );
}
