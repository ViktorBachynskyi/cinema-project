import type { CSSProperties, FC } from "react";
import cn from "classnames";

type DividerProps = {
  className?: string;
};

export const Divider: FC<DividerProps> = ({ className }) => {
  return (
    <div
      className={cn("divider", className)}
    />
  );
};
