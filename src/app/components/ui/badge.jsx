import * as React from "react";
import { cn } from "./utils";

const base = "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none overflow-hidden";

const variantClasses = {
  default: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  outline: "text-foreground",
};

function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(base, variantClasses[variant], className)}
      {...props}
    />
  );
}

export { Badge };
