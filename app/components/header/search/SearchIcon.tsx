import type { ReactElement } from "react";
import React from "react";
import Spinner from "~/components/Spinner";
import { Search } from "@mui/icons-material";

type Props = {
  isLoading: boolean;
  onClick(): void;
};

export default function SearchIcon({
  onClick,
  isLoading,
}: Props): ReactElement {
  return (
    <div className="absolute p-2">
      {isLoading && <Spinner className="m-1" />}
      {!isLoading && <Search onClick={onClick} />}
    </div>
  );
}
