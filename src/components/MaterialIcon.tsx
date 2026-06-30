import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface MaterialIconProps {
  name: string;
  size?: number;
  color?: string;
  filled?: boolean;
  className?: string;
  onClick?: () => void;
}

export function MaterialIcon({ name, size = 24, color, filled, className, onClick }: MaterialIconProps) {
  const style: CSSProperties = {
    fontFamily: "'Material Symbols Rounded'",
    fontSize: size,
    color,
    fontVariationSettings: filled ? "'FILL' 1" : undefined,
    lineHeight: 1,
  };
  return (
    <span style={style} className={cn(className, onClick && "cursor-pointer")} onClick={onClick}>
      {name}
    </span>
  );
}
