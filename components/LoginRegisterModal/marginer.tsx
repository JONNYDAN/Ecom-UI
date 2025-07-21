import React from "react";

interface MarginerProps {
  direction?: "horizontal" | "vertical";
  margin?: number | string;
  className?: string;
}

export function Marginer({
  direction = "horizontal",
  margin = 0,
  className = "",
}: MarginerProps) {
  const style =
    direction === "horizontal"
      ? { display: "flex", width: typeof margin === "string" ? margin : `${margin}px` }
      : { display: "flex", height: typeof margin === "string" ? margin : `${margin}px` };

  return <span className={className} style={style} />;
}
